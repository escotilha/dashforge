import { createClient } from "@clickhouse/client";
import { CLICKHOUSE_CONFIG } from "./config";
import type {
  SensorReading,
  Alert,
  SalesEvent,
  TeamMetric,
} from "./generators/base";

const client = createClient({
  url: CLICKHOUSE_CONFIG.url,
  username: CLICKHOUSE_CONFIG.username,
  password: CLICKHOUSE_CONFIG.password,
  database: CLICKHOUSE_CONFIG.database,
});

export async function insertSensorReadings(
  readings: SensorReading[],
): Promise<void> {
  if (readings.length === 0) return;
  await client.insert({
    table: "sensor_readings",
    values: readings,
    format: "JSONEachRow",
  });
}

export async function insertAlerts(alerts: Alert[]): Promise<void> {
  if (alerts.length === 0) return;
  await client.insert({
    table: "alerts",
    values: alerts,
    format: "JSONEachRow",
  });
}

export async function insertSalesEvents(events: SalesEvent[]): Promise<void> {
  if (events.length === 0) return;
  await client.insert({
    table: "sales_events",
    values: events,
    format: "JSONEachRow",
  });
}

export async function insertTeamMetrics(metrics: TeamMetric[]): Promise<void> {
  if (metrics.length === 0) return;
  await client.insert({
    table: "team_metrics",
    values: metrics,
    format: "JSONEachRow",
  });
}

export async function ping(): Promise<boolean> {
  try {
    const result = await client.ping();
    return result.success;
  } catch {
    return false;
  }
}

export async function close(): Promise<void> {
  await client.close();
}
