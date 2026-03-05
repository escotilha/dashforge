import { io } from "socket.io-client";
import { EMIT_INTERVAL_MS, WS_URL, DEMO_TENANTS } from "./config";
import { getAllGenerators } from "./generators";
import {
  insertSensorReadings,
  insertAlerts,
  insertSalesEvents,
  ping,
  close,
} from "./clickhouse";

let running = true;

async function main() {
  console.log("DashForge Simulator - Live Data Emitter");
  console.log("========================================");

  // Check ClickHouse
  const chOk = await ping();
  if (!chOk) {
    console.warn("ClickHouse not available - will emit via WebSocket only");
  } else {
    console.log("ClickHouse connected.");
  }

  // Connect to WebSocket server
  const socket = io(WS_URL, {
    transports: ["websocket"],
    auth: {
      type: "simulator",
      key: process.env.SIMULATOR_API_KEY ?? "sim-dev-key",
    },
  });

  socket.on("connect", () => {
    console.log(`WebSocket connected: ${socket.id}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`WebSocket disconnected: ${reason}`);
  });

  socket.on("connect_error", (err) => {
    console.warn(`WebSocket connection error: ${err.message}`);
  });

  const generators = getAllGenerators();

  console.log(
    `\nEmitting data every ${EMIT_INTERVAL_MS / 1000}s for ${generators.length} clients...`,
  );
  console.log("Press Ctrl+C to stop.\n");

  // Graceful shutdown
  process.on("SIGINT", () => {
    running = false;
    console.log("\nShutting down...");
  });
  process.on("SIGTERM", () => {
    running = false;
  });

  while (running) {
    const now = new Date();

    for (const [clientName, gen] of generators) {
      const readings = gen.generateSensorReadings(now);
      const alerts = gen.maybeGenerateAlert(readings, now);

      // Persist to ClickHouse
      if (chOk) {
        await insertSensorReadings(readings).catch(() => {});
        await insertAlerts(alerts).catch(() => {});

        // Generate a sales event ~20% of the time
        if (Math.random() < 0.2) {
          await insertSalesEvents([gen.generateSalesEvent(now)]).catch(
            () => {},
          );
        }
      }

      // Emit via WebSocket for real-time dashboards
      const tenantId = DEMO_TENANTS[clientName];

      socket.emit("sensor:batch", {
        tenantId,
        readings: readings.map((r) => ({
          deviceId: r.device_id,
          deviceName: r.device_name,
          metric: r.metric_name,
          value: r.value,
          unit: r.unit,
          status: r.status,
          lat: r.latitude,
          lng: r.longitude,
          timestamp: r.timestamp,
        })),
      });

      if (alerts.length > 0) {
        socket.emit("alerts:batch", {
          tenantId,
          alerts: alerts.map((a) => ({
            id: a.alert_id,
            deviceId: a.device_id,
            severity: a.severity,
            title: a.title,
            message: a.message,
            metric: a.metric_name,
            value: a.metric_value,
            threshold: a.threshold,
            timestamp: a.timestamp,
          })),
        });
      }
    }

    await new Promise((resolve) => setTimeout(resolve, EMIT_INTERVAL_MS));
  }

  socket.disconnect();
  await close();
  console.log("Simulator stopped.");
}

main().catch((err) => {
  console.error("Simulator error:", err);
  process.exit(1);
});
