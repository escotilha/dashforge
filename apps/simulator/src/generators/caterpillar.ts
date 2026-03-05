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

const TENANT_ID = DEMO_TENANTS["caterpillar"];

const DEVICES = [
  { id: "CAT-D11-01", name: "D11 Dozer #1", lat: 40.693, lng: -89.589 },
  { id: "CAT-D11-02", name: "D11 Dozer #2", lat: 40.698, lng: -89.595 },
  { id: "CAT-390F-01", name: "390F Excavator #1", lat: 40.685, lng: -89.58 },
  { id: "CAT-777G-01", name: "777G Truck #1", lat: 40.701, lng: -89.601 },
  { id: "CAT-777G-02", name: "777G Truck #2", lat: 40.688, lng: -89.575 },
  { id: "CAT-994K-01", name: "994K Loader #1", lat: 40.71, lng: -89.612 },
];

const METRICS = [
  {
    name: "engine_rpm",
    unit: "RPM",
    min: 600,
    max: 2200,
    warn: 1900,
    crit: 2100,
  },
  {
    name: "transmission_temp",
    unit: "C",
    min: 60,
    max: 130,
    warn: 110,
    crit: 125,
  },
  { name: "tire_pressure", unit: "PSI", min: 60, max: 120, warn: 70, crit: 65 },
  { name: "fuel_rate", unit: "gal/h", min: 10, max: 80, warn: 70, crit: 75 },
  { name: "bucket_load", unit: "t", min: 0, max: 50, warn: 45, crit: 48 },
];

const SALESPEOPLE = [
  "James Wilson",
  "Mary Davis",
  "Robert Brown",
  "Patricia Garcia",
];
const REGIONS = [
  "North America",
  "Latin America",
  "Middle East",
  "Asia Pacific",
];
const PRODUCTS = [
  "Mining Trucks",
  "Dozers",
  "Excavators",
  "Loaders",
  "Aftermarket",
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
        latitude: device.lat + randomBetween(-0.002, 0.002),
        longitude: device.lng + randomBetween(-0.002, 0.002),
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
    if (r.status === "critical" && Math.random() < 0.25) {
      alerts.push({
        tenant_id: TENANT_ID,
        alert_id: newAlertId(),
        device_id: r.device_id,
        severity: "critical",
        title: `${r.metric_name} alarm on ${r.device_name}`,
        message: `Reading ${r.value}${r.unit} exceeds safe limit`,
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
    deal_id: `CAT-${randomInt(10000, 99999)}`,
    deal_name: `${pick(REGIONS)} ${pick(PRODUCTS)} Fleet`,
    amount: randomBetween(200000, 10000000),
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
    { id: "CAT-E01", name: "John Carter", dept: "Mining Operations" },
    { id: "CAT-E02", name: "Anna Reed", dept: "Mining Operations" },
    { id: "CAT-E03", name: "Chris Hall", dept: "Engineering" },
    { id: "CAT-E04", name: "Diana Foster", dept: "Engineering" },
    { id: "CAT-E05", name: "Steve Morris", dept: "Field Service" },
    { id: "CAT-E06", name: "Kelly Price", dept: "Field Service" },
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
        metric_name: "output_efficiency",
        value: randomBetween(72, 99),
        target: 90,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
      {
        tenant_id: TENANT_ID,
        employee_id: emp.id,
        employee_name: emp.name,
        department: emp.dept,
        metric_name: "downtime_hours",
        value: randomBetween(0, 12),
        target: 4,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
    );
  }
  return metrics;
}
