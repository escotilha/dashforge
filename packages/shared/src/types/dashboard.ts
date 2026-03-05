export type DashboardType =
  | "operations"
  | "sales"
  | "team"
  | "iot"
  | "predictive"
  | "custom";

export type WidgetType =
  | "kpi"
  | "line"
  | "bar"
  | "area"
  | "pie"
  | "gauge"
  | "heatmap"
  | "funnel"
  | "table"
  | "status-grid"
  | "alert-feed"
  | "map";

export interface Dashboard {
  id: string;
  tenantId: string;
  name: string;
  type: DashboardType;
  description: string | null;
  layout: GridItem[];
  isTemplate: boolean;
  dataSourceId: string | null;
  settings: DashboardSettings;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSettings {
  refreshInterval: number;
  dateRange: DateRange;
  timezone: string;
  filters: FilterConfig[];
}

export type DateRange =
  | "last_hour"
  | "last_24h"
  | "last_7d"
  | "last_30d"
  | "last_90d"
  | "custom";

export interface FilterConfig {
  field: string;
  operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "in" | "like";
  value: string | number | string[];
}

export interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface Widget {
  id: string;
  dashboardId: string;
  tenantId: string;
  type: WidgetType;
  title: string;
  config: Record<string, unknown>;
  queryConfig: QueryConfig;
  position: { x: number; y: number; w: number; h: number };
  createdAt: string;
  updatedAt: string;
}

export interface QueryConfig {
  source: "clickhouse" | "tenant-db";
  table: string;
  columns: string[];
  aggregation?: "sum" | "avg" | "min" | "max" | "count";
  groupBy?: string[];
  orderBy?: { column: string; direction: "asc" | "desc" };
  filters?: FilterConfig[];
  limit?: number;
  timeColumn?: string;
  interval?: "1m" | "5m" | "15m" | "1h" | "1d";
}
