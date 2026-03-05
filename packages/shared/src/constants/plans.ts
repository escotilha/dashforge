import type { PlanConfig } from "../types/plan";

export const PLAN_FEATURES: PlanConfig = {
  free: {
    dashboardTypes: ["operations", "sales", "team"],
    maxDataSources: 1,
    maxUsers: 5,
    realTimeStreaming: false,
    whiteLabel: false,
    apiAccess: false,
    customDashboards: false,
  },
  paid: {
    dashboardTypes: [
      "operations",
      "sales",
      "team",
      "iot",
      "predictive",
      "custom",
    ],
    maxDataSources: 10,
    maxUsers: 50,
    realTimeStreaming: true,
    whiteLabel: true,
    apiAccess: true,
    customDashboards: true,
  },
  enterprise: {
    dashboardTypes: [
      "operations",
      "sales",
      "team",
      "iot",
      "predictive",
      "custom",
    ],
    maxDataSources: Infinity,
    maxUsers: Infinity,
    realTimeStreaming: true,
    whiteLabel: true,
    apiAccess: true,
    customDashboards: true,
  },
};

export const PLAN_PRICES = {
  paid: {
    monthly: 9900, // $99/month in cents
    annual: 7900, // $79/month in cents (billed annually)
  },
} as const;
