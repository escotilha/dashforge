import { decrypt, type EncryptedData } from "../encryption";

interface PoolEntry {
  client: unknown;
  type: "postgresql" | "mysql" | "clickhouse";
  lastUsed: number;
}

const pools = new Map<string, PoolEntry>();
const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export async function getConnection(
  dataSourceId: string,
  type: "postgresql" | "mysql" | "clickhouse",
  encryptedConnectionString: EncryptedData,
): Promise<unknown> {
  const existing = pools.get(dataSourceId);
  if (existing) {
    existing.lastUsed = Date.now();
    return existing.client;
  }

  const connectionString = decrypt(encryptedConnectionString);
  let client: unknown;

  switch (type) {
    case "postgresql": {
      const { Pool } = await import("pg");
      const pool = new Pool({
        connectionString,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: connectionString.includes("sslmode=require")
          ? { rejectUnauthorized: false }
          : undefined,
      });
      client = pool;
      break;
    }
    case "mysql": {
      const mysql = await import("mysql2/promise");
      client = mysql.createPool({
        uri: connectionString,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
      });
      break;
    }
    case "clickhouse": {
      const { createClient } = await import("@clickhouse/client");
      const url = new URL(connectionString);
      client = createClient({
        url: `${url.protocol}//${url.host}`,
        username: url.username,
        password: url.password,
        database: url.pathname.slice(1) || "default",
      });
      break;
    }
  }

  pools.set(dataSourceId, { client, type, lastUsed: Date.now() });
  return client;
}

export async function testConnection(
  type: "postgresql" | "mysql" | "clickhouse",
  connectionString: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    switch (type) {
      case "postgresql": {
        const { Client } = await import("pg");
        const client = new Client({
          connectionString,
          connectionTimeoutMillis: 10000,
          ssl: connectionString.includes("sslmode=require")
            ? { rejectUnauthorized: false }
            : undefined,
        });
        await client.connect();
        await client.query("SELECT 1");
        await client.end();
        break;
      }
      case "mysql": {
        const mysql = await import("mysql2/promise");
        const conn = await mysql.createConnection({ uri: connectionString });
        await conn.query("SELECT 1");
        await conn.end();
        break;
      }
      case "clickhouse": {
        const { createClient } = await import("@clickhouse/client");
        const url = new URL(connectionString);
        const client = createClient({
          url: `${url.protocol}//${url.host}`,
          username: url.username,
          password: url.password,
          database: url.pathname.slice(1) || "default",
        });
        await client.ping();
        await client.close();
        break;
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function removeConnection(dataSourceId: string): Promise<void> {
  const entry = pools.get(dataSourceId);
  if (!entry) return;

  try {
    switch (entry.type) {
      case "postgresql": {
        const pool = entry.client as { end: () => Promise<void> };
        await pool.end();
        break;
      }
      case "mysql": {
        const pool = entry.client as { end: () => Promise<void> };
        await pool.end();
        break;
      }
      case "clickhouse": {
        const client = entry.client as { close: () => Promise<void> };
        await client.close();
        break;
      }
    }
  } catch {
    // Best effort cleanup
  }
  pools.delete(dataSourceId);
}

// Cleanup idle connections periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of pools) {
    if (now - entry.lastUsed > IDLE_TIMEOUT_MS) {
      removeConnection(id);
    }
  }
}, 60000);
