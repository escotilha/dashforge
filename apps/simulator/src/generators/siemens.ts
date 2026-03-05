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

const TENANT_ID = DEMO_TENANTS["siemens"];

const DEVICES = [
  {
    id: "SIE-SGT-01",
    name: "SGT-800 Gas Turbine #1",
    lat: 48.135,
    lng: 11.582,
  },
  {
    id: "SIE-SGT-02",
    name: "SGT-800 Gas Turbine #2",
    lat: 48.139,
    lng: 11.588,
  },
  {
    id: "SIE-SWT-01",
    name: "SWT-4.0 Wind Turbine #1",
    lat: 54.321,
    lng: 10.136,
  },
  {
    id: "SIE-SWT-02",
    name: "SWT-4.0 Wind Turbine #2",
    lat: 54.325,
    lng: 10.142,
  },
  { id: "SIE-TRF-01", name: "Power Transformer T1", lat: 48.131, lng: 11.576 },
  {
    id: "SIE-MCC-01",
    name: "Motor Control Center #1",
    lat: 48.141,
    lng: 11.595,
  },
];

const METRICS = [
  { name: "power_output", unit: "MW", min: 0, max: 50, warn: 45, crit: 48 },
  { name: "vibration", unit: "mm/s", min: 0, max: 12, warn: 8, crit: 10 },
  { name: "bearing_temp", unit: "C", min: 40, max: 120, warn: 95, crit: 110 },
  { name: "efficiency", unit: "%", min: 30, max: 99, warn: 40, crit: 35 },
  {
    name: "grid_frequency",
    unit: "Hz",
    min: 49.5,
    max: 50.5,
    warn: 49.7,
    crit: 49.6,
  },
];

const SALESPEOPLE = [
  "Hans Mueller",
  "Claudia Fischer",
  "Thomas Weber",
  "Petra Schneider",
];
const REGIONS = ["DACH", "Western Europe", "Middle East", "Southeast Asia"];
const PRODUCTS = [
  "Gas Turbines",
  "Wind Power",
  "Grid Solutions",
  "Digital Industries",
  "Smart Infrastructure",
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
        value: Math.round(value * 1000) / 1000,
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
    if (r.status === "critical" && Math.random() < 0.35) {
      alerts.push({
        tenant_id: TENANT_ID,
        alert_id: newAlertId(),
        device_id: r.device_id,
        severity: r.metric_name === "grid_frequency" ? "emergency" : "critical",
        title: `${r.device_name}: ${r.metric_name} critical`,
        message: `${r.metric_name} = ${r.value}${r.unit}`,
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
    deal_id: `SIE-${randomInt(10000, 99999)}`,
    deal_name: `${pick(REGIONS)} ${pick(PRODUCTS)} Project`,
    amount: randomBetween(500000, 20000000),
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
    { id: "SIE-E01", name: "Wolfgang Schmidt", dept: "Power Generation" },
    { id: "SIE-E02", name: "Katarina Braun", dept: "Power Generation" },
    { id: "SIE-E03", name: "Markus Hoffmann", dept: "Digital" },
    { id: "SIE-E04", name: "Lena Richter", dept: "Digital" },
    { id: "SIE-E05", name: "Stefan Koch", dept: "Grid Solutions" },
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
        metric_name: "project_completion",
        value: randomBetween(60, 100),
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
        metric_name: "innovation_index",
        value: randomBetween(50, 100),
        target: 75,
        period_start: formatDate(week),
        period_end: formatDate(weekEnd),
        timestamp: formatTimestamp(timestamp),
      },
    );
  }
  return metrics;
}
