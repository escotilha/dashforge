import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";
import { Redis } from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

const PORT = parseInt(process.env.PORT ?? "3001", 10);
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
const SIMULATOR_KEY = process.env.SIMULATOR_API_KEY ?? "sim-dev-key";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : null;

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ status: "ok", connections: io.engine.clientsCount }),
    );
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
  pingInterval: 25000,
  pingTimeout: 20000,
});

// Redis adapter for horizontal scaling
async function setupRedis() {
  try {
    const pubClient = new Redis(REDIS_URL);
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    console.log("Redis adapter connected.");
  } catch (err) {
    console.warn(
      "Redis not available, running without adapter:",
      (err as Error).message,
    );
  }
}

// Rate limiting: max 100 events per minute per client
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(socketId: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(socketId);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(socketId, { count: 1, resetAt: now + 60000 });
    return true;
  }
  entry.count++;
  return entry.count <= 100;
}

// Verify user has access to the tenant
async function verifyTenantAccess(
  userId: string,
  tenantId: string,
): Promise<boolean> {
  if (!supabase) return true; // Dev mode: allow all
  const { data } = await supabase
    .from("tenant_members")
    .select("id")
    .eq("user_id", userId)
    .eq("tenant_id", tenantId)
    .single();
  return !!data;
}

// Connection handling
io.on("connection", async (socket) => {
  const auth = socket.handshake.auth;

  // Simulator connections (server-to-server)
  if (auth?.type === "simulator" && auth?.key === SIMULATOR_KEY) {
    console.log(`Simulator connected: ${socket.id}`);

    socket.on(
      "sensor:batch",
      (data: { tenantId: string; readings: unknown[] }) => {
        if (!checkRateLimit(socket.id)) return;
        io.to(`tenant:${data.tenantId}`).emit("sensor:update", data.readings);
      },
    );

    socket.on(
      "alerts:batch",
      (data: { tenantId: string; alerts: unknown[] }) => {
        if (!checkRateLimit(socket.id)) return;
        io.to(`tenant:${data.tenantId}`).emit("alerts:update", data.alerts);
      },
    );

    socket.on("disconnect", () => {
      console.log(`Simulator disconnected: ${socket.id}`);
      rateLimits.delete(socket.id);
    });
    return;
  }

  // Client connections (browser)
  const userId = auth?.userId as string | undefined;
  const tenantId = auth?.tenantId as string | undefined;

  if (!tenantId) {
    socket.emit("error", { message: "tenantId required" });
    socket.disconnect(true);
    return;
  }

  // In demo mode (no supabase), allow all connections
  if (userId) {
    const hasAccess = await verifyTenantAccess(userId, tenantId);
    if (!hasAccess) {
      socket.emit("error", { message: "Unauthorized" });
      socket.disconnect(true);
      return;
    }
  }

  // Join tenant room
  await socket.join(`tenant:${tenantId}`);
  console.log(`Client ${socket.id} joined tenant:${tenantId}`);

  // Subscribe to specific dashboard
  socket.on("dashboard:subscribe", (dashboardId: string) => {
    socket.join(`dashboard:${dashboardId}`);
  });

  socket.on("dashboard:unsubscribe", (dashboardId: string) => {
    socket.leave(`dashboard:${dashboardId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
    rateLimits.delete(socket.id);
  });
});

// Cleanup stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits) {
    if (now > entry.resetAt) rateLimits.delete(key);
  }
}, 300000);

async function start() {
  await setupRedis();
  httpServer.listen(PORT, () => {
    console.log(`DashForge WebSocket server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start ws-server:", err);
  process.exit(1);
});
