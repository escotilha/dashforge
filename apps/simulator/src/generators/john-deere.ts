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

const TENANT_ID = DEMO_TENANTS["john-deere"];

const DEVICES = [
  { id: "JD-8R-001", name: "8R 410 Tractor #1", lat: 41.587, lng: -93.625 },
  { id: "JD-8R-002", name: "8R 410 Tractor #2", lat: 41.592, lng: -93.631 },
  { id: "JD-S7-001", name: "S780 Combine #1", lat: 41.581, lng: -93.619 },
  { id: "JD-S7-002", name: "S780 Combine #2", lat: 41.596, lng: -93.642 },
  { id: "JD-9RX-001", name: "9RX 640 Track #1", lat: 41.578, lng: -93.611 },
  { id: "JD-CF-001", name: "CF600 Sprayer #1", lat: 41.601, lng: -93.655 },
];

const METRICS = [
  { name: "engine_temp", unit: "C", min: 75, max: 110, warn: 95, crit: 105 },
  { name: "fuel_level", unit: "%", min: 5, max: 100, warn: 15, crit: 8 },
  {
    name: "hydraulic_pressure",
    unit: "PSI",
    min: 1800,
    max: 3200,
    warn: 2800,
    crit: 3000,
  },
  { name: "ground_speed", unit: "km/h", min: 0, max: 25, warn: 20, crit: 24 },
  {
    name: "engine_hours",
    unit: "hrs",
    min: 100,
    max: 15000,
    warn: 12000,
    crit: 14000,
  },
  { name: "pto_rpm", unit: "RPM", min: 0, max: 1100, warn: 950, crit: 1050 },
];

const SALESPEOPLE = [
  "Mike Johnson",
  "Sarah Williams",
  "Tom Anderson",
  "Lisa Chen",
];
const REGIONS = ["Midwest US", "Great Plains", "Southeast US", "Brazil"];
const PRODUCTS = [
  "8R Series",
  "S7 Combine",
  "9RX Track",
  "CF Sprayer",
  "Parts & Service",
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
        latitude: device.lat + randomBetween(-0.001, 0.001),
        longitude: device.lng + randomBetween(-0.001, 0.001),
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
        title: `High ${r.metric_name} on ${r.device_name}`,
        message: `${r.metric_name} at ${r.value}${r.unit} exceeds threshold`,
        metric_name: r.metric_name,
        metric_value: r.value,
        threshold: METRICS.find((m) => m.name === r.metric_name)?.crit ?? 0,
        timestamp: formatTimestamp(timestamp),
      });
    } else if (r.status === "warning" && Math.random() < 0.1) {
      alerts.push({
        tenant_id: TENANT_ID,
        alert_id: newAlertId(),
        device_id: r.device_id,
        severity: "warning",
        title: `Elevated ${r.metric_name} on ${r.device_name}`,
        message: `${r.metric_name} at ${r.value}${r.unit} approaching limit`,
        metric_name: r.metric_name,
        metric_value: r.value,
        threshold: METRICS.find((m) => m.name === r.metric_name)?.warn ?? 0,
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
    deal_id: `JD-${randomInt(10000, 99999)}`,
    deal_name: `${pick(REGIONS)} - ${pick(PRODUCTS)} Deal`,
    amount: randomBetween(50000, 2000000),
    currency: "USD",
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
    { id: "JDE-001", name: "Bob Miller", dept: "Manufacturing" },
    { id: "JDE-002", name: "Alice Cooper", dept: "Manufacturing" },
    { id: "JDE-003", name: "Dave Park", dept: "Engineering" },
    { id: "JDE-004", name: "Eve Santos", dept: "Engineering" },
    { id: "JDE-005", name: "Frank Zhao", dept: "Sales" },
    { id: "JDE-006", name: "Grace Kim", dept: "Sales" },
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
        metric_name: "productivity_score",
        value: randomBetween(65, 100),
        target: 85,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
      {
        tenant_id: TENANT_ID,
        employee_id: emp.id,
        employee_name: emp.name,
        department: emp.dept,
        metric_name: "quality_rate",
        value: randomBetween(90, 99.9),
        target: 95,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
    );
  }
  return metrics;
}
