import { DEMO_TENANTS } from "../config";
import {
  type SensorReading,
  type Alert,
  type SalesEvent,
  type TeamMetric,
  randomBetween,
  randomInt,
  pick,
  getStatus,
  formatTimestamp,
  formatDate,
  newAlertId,
} from "./base";

const TENANT_ID = DEMO_TENANTS["abb"];

const DEVICES = [
  { id: "ABB-IRB-01", name: "IRB 6700 Robot #1", lat: 59.329, lng: 18.068 },
  { id: "ABB-IRB-02", name: "IRB 6700 Robot #2", lat: 59.333, lng: 18.074 },
  { id: "ABB-ACS-01", name: "ACS880 Drive #1", lat: 59.325, lng: 18.062 },
  { id: "ABB-ACS-02", name: "ACS880 Drive #2", lat: 59.337, lng: 18.08 },
  {
    id: "ABB-REL-01",
    name: "REL670 Protection Relay #1",
    lat: 59.321,
    lng: 18.056,
  },
  { id: "ABB-TRF-01", name: "ABB Transformer TX1", lat: 59.341, lng: 18.086 },
];

const METRICS = [
  { name: "cycle_time", unit: "s", min: 2, max: 15, warn: 12, crit: 14 },
  { name: "motor_current", unit: "A", min: 5, max: 120, warn: 100, crit: 115 },
  { name: "winding_temp", unit: "C", min: 40, max: 160, warn: 130, crit: 150 },
  { name: "uptime", unit: "%", min: 85, max: 100, warn: 90, crit: 88 },
  { name: "error_rate", unit: "%", min: 0, max: 5, warn: 3, crit: 4 },
];

const SALESPEOPLE = [
  "Anna Lindqvist",
  "Magnus Norberg",
  "Yuki Tanaka",
  "Priya Sharma",
];
const REGIONS = ["Nordic", "Central Europe", "Asia", "Americas"];
const PRODUCTS = [
  "Robotics",
  "Drives",
  "Electrification",
  "Process Automation",
  "Motion",
];

export function generateSensorReadings(timestamp: Date): SensorReading[] {
  const readings: SensorReading[] = [];
  for (const device of DEVICES) {
    for (const metric of METRICS) {
      const value = randomBetween(metric.min, metric.max);
      readings.push({
        tenant_id: TENANT_ID,
        device_id: device.id,
        device_name: device.name,
        metric_name: metric.name,
        value: Math.round(value * 100) / 100,
        unit: metric.unit,
        status: getStatus(value, metric.warn, metric.crit),
        latitude: device.lat,
        longitude: device.lng,
        timestamp: formatTimestamp(timestamp),
      });
    }
  }
  return readings;
}

export function maybeGenerateAlert(
  readings: SensorReading[],
  timestamp: Date,
): Alert[] {
  const alerts: Alert[] = [];
  for (const r of readings) {
    if (r.status === "critical" && Math.random() < 0.3) {
      alerts.push({
        tenant_id: TENANT_ID,
        alert_id: newAlertId(),
        device_id: r.device_id,
        severity: "critical",
        title: `${r.device_name} ${r.metric_name} alarm`,
        message: `${r.metric_name} at ${r.value}${r.unit} — action required`,
        metric_name: r.metric_name,
        metric_value: r.value,
        threshold: METRICS.find((m) => m.name === r.metric_name)?.crit ?? 0,
        timestamp: formatTimestamp(timestamp),
      });
    }
  }
  return alerts;
}

export function generateSalesEvent(timestamp: Date): SalesEvent {
  const eventTypes = [
    "lead",
    "opportunity",
    "proposal",
    "negotiation",
    "closed_won",
    "closed_lost",
  ] as const;
  const eventType = pick([...eventTypes]);
  const isClosed = eventType === "closed_won" || eventType === "closed_lost";
  return {
    tenant_id: TENANT_ID,
    event_type: eventType,
    deal_id: `ABB-${randomInt(10000, 99999)}`,
    deal_name: `${pick(REGIONS)} ${pick(PRODUCTS)} Contract`,
    amount: randomBetween(100000, 8000000),
    currency: "CHF",
    salesperson: pick(SALESPEOPLE),
    region: pick(REGIONS),
    product_line: pick(PRODUCTS),
    stage_entered_at: formatTimestamp(timestamp),
    closed_at: isClosed ? formatTimestamp(timestamp) : null,
    timestamp: formatTimestamp(timestamp),
  };
}

export function generateTeamMetrics(timestamp: Date): TeamMetric[] {
  const employees = [
    { id: "ABB-E01", name: "Erik Johansson", dept: "Robotics" },
    { id: "ABB-E02", name: "Mei Chen", dept: "Robotics" },
    { id: "ABB-E03", name: "Rajesh Patel", dept: "Electrification" },
    { id: "ABB-E04", name: "Julia Wagner", dept: "Electrification" },
    { id: "ABB-E05", name: "Sven Gustafsson", dept: "Process Automation" },
  ];

  const week = new Date(timestamp);
  week.setDate(week.getDate() - week.getDay());
  const weekEnd = new Date(week);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const metrics: TeamMetric[] = [];
  for (const emp of employees) {
    metrics.push(
      {
        tenant_id: TENANT_ID,
        employee_id: emp.id,
        employee_name: emp.name,
        department: emp.dept,
        metric_name: "tasks_completed",
        value: randomInt(15, 50),
        target: 35,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
      {
        tenant_id: TENANT_ID,
        employee_id: emp.id,
        employee_name: emp.name,
        department: emp.dept,
        metric_name: "customer_satisfaction",
        value: randomBetween(3.5, 5.0),
        target: 4.5,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
    );
  }
  return metrics;
}
