import { lazy } from "react";
import type { WidgetType } from "@dashforge/shared";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const widgetRegistry: Record<
  WidgetType,
  React.LazyExoticComponent<React.ComponentType<{ data: any }>>
> = {
  kpi: lazy(() => import("./KPICard")),
  line: lazy(() => import("./LineChart")),
  bar: lazy(() => import("./BarChart")),
  area: lazy(() => import("./AreaChart")),
  pie: lazy(() => import("./PieChart")),
  gauge: lazy(() => import("./GaugeChart")),
  heatmap: lazy(() => import("./HeatmapChart")),
  funnel: lazy(() => import("./FunnelChart")),
  table: lazy(() => import("./DataTable")),
  "status-grid": lazy(() => import("./StatusGrid")),
  "alert-feed": lazy(() => import("./AlertFeed")),
  map: lazy(() => import("./MapWidget")),
};

export function getWidgetComponent(type: WidgetType) {
  const Component = widgetRegistry[type];
  if (!Component) throw new Error(`Unknown widget type: ${type}`);
  return Component;
}
