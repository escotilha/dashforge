import type { DashboardType } from "../types/dashboard";

export const DASHBOARD_TYPE_META: Record<
  DashboardType,
  { label: string; description: string; icon: string; plan: "free" | "paid" }
> = {
  operations: {
    label: "Operations Overview",
    description: "KPI cards, trend lines, status indicators",
    icon: "Activity",
    plan: "free",
  },
  sales: {
    label: "Sales & Revenue",
    description: "Revenue charts, pipeline, conversion funnels",
    icon: "TrendingUp",
    plan: "free",
  },
  team: {
    label: "Team Performance",
    description: "Employee metrics, productivity, goals tracking",
    icon: "Users",
    plan: "free",
  },
  iot: {
    label: "Real-Time IoT Monitor",
    description: "Live sensor data, equipment status, alerts",
    icon: "Radio",
    plan: "paid",
  },
  predictive: {
    label: "Predictive Analytics",
    description: "ML-powered forecasts, anomaly detection",
    icon: "BrainCircuit",
    plan: "paid",
  },
  custom: {
    label: "Custom Executive",
    description: "Template-based with custom data bindings",
    icon: "LayoutDashboard",
    plan: "paid",
  },
};
