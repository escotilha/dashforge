import { v4 as uuid } from "uuid";

export interface SensorReading {
  tenant_id: string;
  device_id: string;
  device_name: string;
  metric_name: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
}

export interface Alert {
  tenant_id: string;
  alert_id: string;
  device_id: string;
  severity: "info" | "warning" | "critical" | "emergency";
  title: string;
  message: string;
  metric_name: string;
  metric_value: number;
  threshold: number;
  timestamp: string;
}

export interface SalesEvent {
  tenant_id: string;
  event_type:
    | "lead"
    | "opportunity"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  deal_id: string;
  deal_name: string;
  amount: number;
  currency: string;
  salesperson: string;
  region: string;
  product_line: string;
  stage_entered_at: string;
  closed_at: string | null;
  timestamp: string;
}

export interface TeamMetric {
  tenant_id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  metric_name: string;
  value: number;
  target: number;
  period_start: string;
  period_end: string;
  timestamp: string;
}

// Utility functions
export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getStatus(
  value: number,
  warningThreshold: number,
  criticalThreshold: number,
): "normal" | "warning" | "critical" {
  if (value >= criticalThreshold) return "critical";
  if (value >= warningThreshold) return "warning";
  return "normal";
}

export function formatTimestamp(date: Date): string {
  return date.toISOString().replace("T", " ").replace("Z", "");
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function newAlertId(): string {
  return uuid();
}

export function generateTimeSeries(
  startDate: Date,
  endDate: Date,
  intervalMinutes: number,
  generator: (timestamp: Date) => void,
): void {
  const current = new Date(startDate);
  while (current <= endDate) {
    generator(new Date(current));
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }
}
