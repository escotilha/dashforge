export const CLICKHOUSE_CONFIG = {
  url: process.env.CLICKHOUSE_URL ?? "http://localhost:8123",
  username: process.env.CLICKHOUSE_USER ?? "default",
  password: process.env.CLICKHOUSE_PASSWORD ?? "",
  database: "dashforge",
};

export const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
export const WS_URL = process.env.WS_URL ?? "http://localhost:3001";

// Simulated tenant IDs for the 5 demo enterprise clients
export const DEMO_TENANTS = {
  "john-deere": "00000000-0000-0000-0000-000000000001",
  volvo: "00000000-0000-0000-0000-000000000002",
  caterpillar: "00000000-0000-0000-0000-000000000003",
  siemens: "00000000-0000-0000-0000-000000000004",
  abb: "00000000-0000-0000-0000-000000000005",
} as const;

export type DemoClient = keyof typeof DEMO_TENANTS;

export const EMIT_INTERVAL_MS = 5000; // 5 seconds between live data points
export const HISTORICAL_DAYS = 30; // How many days of historical data to seed
