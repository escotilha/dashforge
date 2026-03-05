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

const TENANT_ID = DEMO_TENANTS["volvo"];

const DEVICES = [
  { id: "VCE-L220-01", name: "L220H Loader #1", lat: 57.707, lng: 11.973 },
  { id: "VCE-L220-02", name: "L220H Loader #2", lat: 57.712, lng: 11.981 },
  { id: "VCE-EC480-01", name: "EC480E Excavator #1", lat: 57.699, lng: 11.965 },
  { id: "VCE-A40-01", name: "A40G Hauler #1", lat: 57.715, lng: 11.989 },
  { id: "VCE-A40-02", name: "A40G Hauler #2", lat: 57.701, lng: 11.958 },
];

const METRICS = [
  { name: "engine_load", unit: "%", min: 10, max: 100, warn: 85, crit: 95 },
  { name: "coolant_temp", unit: "C", min: 70, max: 115, warn: 100, crit: 110 },
  {
    name: "oil_pressure",
    unit: "kPa",
    min: 200,
    max: 600,
    warn: 250,
    crit: 210,
  },
  {
    name: "fuel_consumption",
    unit: "L/h",
    min: 15,
    max: 65,
    warn: 55,
    crit: 60,
  },
  { name: "payload_weight", unit: "t", min: 0, max: 42, warn: 38, crit: 41 },
];

const SALESPEOPLE = [
  "Erik Lindberg",
  "Astrid Johansson",
  "Karl Svensson",
  "Ingrid Nilsson",
];
const REGIONS = ["Scandinavia", "Western Europe", "APAC", "North America"];
const PRODUCTS = [
  "L-Series Loaders",
  "EC Excavators",
  "A-Series Haulers",
  "Paving",
  "Parts",
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
        title: `Critical ${r.metric_name} on ${r.device_name}`,
        message: `${r.metric_name} reached ${r.value}${r.unit}`,
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
    deal_id: `VCE-${randomInt(10000, 99999)}`,
    deal_name: `${pick(REGIONS)} - ${pick(PRODUCTS)}`,
    amount: randomBetween(100000, 5000000),
    currency: "EUR",
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
    { id: "VCE-E01", name: "Lars Eriksson", dept: "Production" },
    { id: "VCE-E02", name: "Mia Andersson", dept: "Production" },
    { id: "VCE-E03", name: "Oscar Bergman", dept: "R&D" },
    { id: "VCE-E04", name: "Sofia Larsson", dept: "R&D" },
    { id: "VCE-E05", name: "Henrik Olsson", dept: "Sales" },
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
        value: randomBetween(70, 100),
        target: 88,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
      {
        tenant_id: TENANT_ID,
        employee_id: emp.id,
        employee_name: emp.name,
        department: emp.dept,
        metric_name: "safety_compliance",
        value: randomBetween(92, 100),
        target: 98,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
    );
  }
  return metrics;
}
