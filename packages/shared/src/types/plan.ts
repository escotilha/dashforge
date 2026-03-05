import type { DashboardType } from "./dashboard";
import type { Plan } from "./tenant";

export interface PlanFeatures {
  dashboardTypes: DashboardType[];
  maxDataSources: number;
  maxUsers: number;
  realTimeStreaming: boolean;
  whiteLabel: boolean;
  apiAccess: boolean;
  customDashboards: boolean;
}

export type PlanConfig = Record<Plan, PlanFeatures>;
