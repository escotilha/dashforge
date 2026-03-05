import type { DashboardType } from "@dashforge/shared";
import type { WidgetData } from "@/components/dashboard/DashboardRenderer";

function generateTimeSeries(points: number, base: number, variance: number) {
  const data = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    value = value + (Math.random() - 0.48) * variance;
    value = Math.max(base * 0.5, Math.min(base * 1.8, value));
    const date = new Date();
    date.setDate(date.getDate() - (points - i));
    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: Math.round(value),
    });
  }
  return data;
}

export function getDemoWidgets(type: DashboardType): WidgetData[] {
  switch (type) {
    case "operations":
      return [
        {
          id: "op-kpi-1",
          type: "kpi",
          title: "Total Orders",
          position: { x: 0, y: 0, w: 3, h: 2 },
          data: { value: 12847, previousValue: 11203, format: "number" },
        },
        {
          id: "op-kpi-2",
          type: "kpi",
          title: "Revenue MTD",
          position: { x: 3, y: 0, w: 3, h: 2 },
          data: { value: 2340000, previousValue: 2100000, format: "currency" },
        },
        {
          id: "op-kpi-3",
          type: "kpi",
          title: "Active Users",
          position: { x: 6, y: 0, w: 3, h: 2 },
          data: { value: 3421, previousValue: 3150, format: "number" },
        },
        {
          id: "op-kpi-4",
          type: "kpi",
          title: "Uptime",
          position: { x: 9, y: 0, w: 3, h: 2 },
          data: { value: 99.97, format: "percent" },
        },
        {
          id: "op-line-1",
          type: "line",
          title: "Orders Trend",
          position: { x: 0, y: 2, w: 6, h: 4 },
          data: {
            series: [{ name: "value" }],
            points: generateTimeSeries(30, 420, 30),
            xKey: "date",
          },
        },
        {
          id: "op-bar-1",
          type: "bar",
          title: "Top Products",
          position: { x: 6, y: 2, w: 6, h: 4 },
          data: {
            series: [{ name: "revenue" }],
            points: [
              { product: "Engine Parts", revenue: 45000 },
              { product: "Hydraulics", revenue: 38000 },
              { product: "Filters", revenue: 32000 },
              { product: "Electronics", revenue: 28000 },
              { product: "Tires", revenue: 22000 },
            ],
            xKey: "product",
          },
        },
        {
          id: "op-table-1",
          type: "table",
          title: "Recent Orders",
          position: { x: 0, y: 6, w: 8, h: 4 },
          data: {
            columns: [
              { key: "id", label: "Order ID" },
              { key: "customer", label: "Customer" },
              { key: "product", label: "Product" },
              { key: "amount", label: "Amount", align: "right" as const },
              { key: "status", label: "Status" },
            ],
            rows: [
              {
                id: "ORD-7841",
                customer: "Farm Co.",
                product: "Tractor Parts",
                amount: "$12,500",
                status: "Shipped",
              },
              {
                id: "ORD-7840",
                customer: "BuildMax",
                product: "Hydraulic Kit",
                amount: "$8,200",
                status: "Processing",
              },
              {
                id: "ORD-7839",
                customer: "AgriTech",
                product: "Sensor Pack",
                amount: "$3,400",
                status: "Delivered",
              },
              {
                id: "ORD-7838",
                customer: "FleetOps",
                product: "Brake System",
                amount: "$6,800",
                status: "Shipped",
              },
              {
                id: "ORD-7837",
                customer: "MineralEx",
                product: "Engine Filter",
                amount: "$1,200",
                status: "Processing",
              },
            ],
          },
        },
        {
          id: "op-status-1",
          type: "status-grid",
          title: "System Status",
          position: { x: 8, y: 6, w: 4, h: 4 },
          data: {
            items: [
              { id: "api", label: "API", status: "normal", value: "42ms" },
              { id: "db", label: "Database", status: "normal", value: "12ms" },
              { id: "cache", label: "Cache", status: "normal", value: "2ms" },
              {
                id: "queue",
                label: "Queue",
                status: "warning",
                value: "340 pending",
              },
              {
                id: "storage",
                label: "Storage",
                status: "normal",
                value: "68% used",
              },
              { id: "cdn", label: "CDN", status: "normal", value: "99.9%" },
            ],
          },
        },
      ];

    case "sales":
      return [
        {
          id: "sl-kpi-1",
          type: "kpi",
          title: "Monthly Revenue",
          position: { x: 0, y: 0, w: 3, h: 2 },
          data: { value: 1850000, previousValue: 1620000, format: "currency" },
        },
        {
          id: "sl-kpi-2",
          type: "kpi",
          title: "Pipeline Value",
          position: { x: 3, y: 0, w: 3, h: 2 },
          data: { value: 4200000, format: "currency" },
        },
        {
          id: "sl-kpi-3",
          type: "kpi",
          title: "Win Rate",
          position: { x: 6, y: 0, w: 3, h: 2 },
          data: { value: 34.2, previousValue: 31.8, format: "percent" },
        },
        {
          id: "sl-kpi-4",
          type: "kpi",
          title: "Avg Deal Size",
          position: { x: 9, y: 0, w: 3, h: 2 },
          data: { value: 68000, previousValue: 62000, format: "currency" },
        },
        {
          id: "sl-area-1",
          type: "area",
          title: "Revenue Trend",
          position: { x: 0, y: 2, w: 6, h: 4 },
          data: {
            series: [{ name: "value", color: "#2563eb" }],
            points: generateTimeSeries(30, 62000, 8000),
            xKey: "date",
          },
        },
        {
          id: "sl-funnel-1",
          type: "funnel",
          title: "Sales Pipeline",
          position: { x: 6, y: 2, w: 6, h: 4 },
          data: {
            stages: [
              { name: "Leads", value: 1240 },
              { name: "Qualified", value: 620 },
              { name: "Proposal", value: 310 },
              { name: "Negotiation", value: 155 },
              { name: "Closed Won", value: 78 },
            ],
          },
        },
        {
          id: "sl-bar-1",
          type: "bar",
          title: "Revenue by Region",
          position: { x: 0, y: 6, w: 6, h: 4 },
          data: {
            series: [{ name: "revenue" }],
            points: [
              { region: "North America", revenue: 720000 },
              { region: "Europe", revenue: 540000 },
              { region: "Asia Pacific", revenue: 380000 },
              { region: "Latin America", revenue: 210000 },
            ],
            xKey: "region",
          },
        },
        {
          id: "sl-pie-1",
          type: "pie",
          title: "Revenue by Product",
          position: { x: 6, y: 6, w: 6, h: 4 },
          data: {
            slices: [
              { name: "Equipment", value: 45 },
              { name: "Parts", value: 25 },
              { name: "Services", value: 18 },
              { name: "Software", value: 12 },
            ],
          },
        },
      ];

    case "team":
      return [
        {
          id: "tm-kpi-1",
          type: "kpi",
          title: "Tasks Completed",
          position: { x: 0, y: 0, w: 3, h: 2 },
          data: { value: 342, previousValue: 298, format: "number" },
        },
        {
          id: "tm-kpi-2",
          type: "kpi",
          title: "Avg Quality Score",
          position: { x: 3, y: 0, w: 3, h: 2 },
          data: { value: 92.4, previousValue: 90.1, format: "percent" },
        },
        {
          id: "tm-kpi-3",
          type: "kpi",
          title: "Avg Response Time",
          position: { x: 6, y: 0, w: 3, h: 2 },
          data: { value: 2.3, suffix: "h", format: "number" },
        },
        {
          id: "tm-kpi-4",
          type: "kpi",
          title: "Team Size",
          position: { x: 9, y: 0, w: 3, h: 2 },
          data: { value: 24, format: "number" },
        },
        {
          id: "tm-bar-1",
          type: "bar",
          title: "Tasks by Person",
          position: { x: 0, y: 2, w: 6, h: 4 },
          data: {
            series: [
              { name: "completed", color: "#2563eb" },
              { name: "target", color: "#e5e5e5" },
            ],
            points: [
              { name: "Alice", completed: 42, target: 40 },
              { name: "Bob", completed: 38, target: 40 },
              { name: "Carol", completed: 45, target: 40 },
              { name: "Dave", completed: 35, target: 40 },
              { name: "Eve", completed: 41, target: 40 },
            ],
            xKey: "name",
          },
        },
        {
          id: "tm-heatmap-1",
          type: "heatmap",
          title: "Activity Heatmap",
          position: { x: 6, y: 2, w: 6, h: 4 },
          data: {
            rows: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            cols: ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm"],
            values: [
              [3, 7, 8, 4, 2, 6, 8, 5],
              [5, 9, 7, 3, 4, 8, 9, 6],
              [4, 6, 9, 5, 3, 7, 8, 4],
              [6, 8, 7, 2, 5, 9, 7, 3],
              [3, 5, 6, 4, 2, 5, 4, 2],
            ],
          },
        },
        {
          id: "tm-table-1",
          type: "table",
          title: "Employee Metrics",
          position: { x: 0, y: 6, w: 8, h: 4 },
          data: {
            columns: [
              { key: "name", label: "Name" },
              { key: "dept", label: "Department" },
              { key: "tasks", label: "Tasks", align: "right" as const },
              { key: "quality", label: "Quality", align: "right" as const },
              { key: "response", label: "Resp. Time", align: "right" as const },
            ],
            rows: [
              {
                name: "Alice Johnson",
                dept: "Engineering",
                tasks: 42,
                quality: "95%",
                response: "1.8h",
              },
              {
                name: "Bob Smith",
                dept: "Engineering",
                tasks: 38,
                quality: "91%",
                response: "2.4h",
              },
              {
                name: "Carol Davis",
                dept: "Support",
                tasks: 45,
                quality: "94%",
                response: "1.2h",
              },
              {
                name: "Dave Wilson",
                dept: "Sales",
                tasks: 35,
                quality: "88%",
                response: "3.1h",
              },
              {
                name: "Eve Brown",
                dept: "Marketing",
                tasks: 41,
                quality: "93%",
                response: "2.0h",
              },
            ],
          },
        },
        {
          id: "tm-line-1",
          type: "line",
          title: "Productivity Trend",
          position: { x: 8, y: 6, w: 4, h: 4 },
          data: {
            series: [{ name: "value" }],
            points: generateTimeSeries(14, 85, 5),
            xKey: "date",
          },
        },
      ];

    case "iot":
      return [
        {
          id: "iot-gauge-1",
          type: "gauge",
          title: "Engine Temp",
          position: { x: 0, y: 0, w: 3, h: 3 },
          data: {
            value: 87.3,
            min: 0,
            max: 120,
            unit: "°C",
            thresholds: { warning: 90, critical: 105 },
          },
          isRealTime: true,
        },
        {
          id: "iot-gauge-2",
          type: "gauge",
          title: "Hydraulic Pressure",
          position: { x: 3, y: 0, w: 3, h: 3 },
          data: {
            value: 215,
            min: 0,
            max: 350,
            unit: "bar",
            thresholds: { warning: 280, critical: 320 },
          },
          isRealTime: true,
        },
        {
          id: "iot-gauge-3",
          type: "gauge",
          title: "Vibration",
          position: { x: 6, y: 0, w: 3, h: 3 },
          data: {
            value: 2.4,
            min: 0,
            max: 10,
            unit: "mm/s",
            thresholds: { warning: 5, critical: 8 },
          },
          isRealTime: true,
        },
        {
          id: "iot-kpi-1",
          type: "kpi",
          title: "Active Alerts",
          position: { x: 9, y: 0, w: 3, h: 3 },
          data: { value: 3, format: "number" },
          isRealTime: true,
        },
        {
          id: "iot-line-1",
          type: "line",
          title: "Sensor Trends (24h)",
          position: { x: 0, y: 3, w: 8, h: 4 },
          data: {
            series: [
              { name: "Temperature", color: "#dc2626" },
              { name: "Pressure", color: "#2563eb" },
              { name: "Vibration", color: "#16a34a" },
            ],
            points: Array.from({ length: 24 }, (_, i) => ({
              time: `${i}:00`,
              Temperature: 80 + Math.random() * 15,
              Pressure: 200 + Math.random() * 40,
              Vibration: 1.5 + Math.random() * 3,
            })),
            xKey: "time",
          },
          isRealTime: true,
        },
        {
          id: "iot-alert-1",
          type: "alert-feed",
          title: "Recent Alerts",
          position: { x: 8, y: 3, w: 4, h: 4 },
          data: {
            alerts: [
              {
                id: "a1",
                severity: "critical" as const,
                title: "High Temperature",
                message: "Tractor-007 engine temp exceeded 105°C",
                timestamp: "2 min ago",
                device: "Tractor-007",
              },
              {
                id: "a2",
                severity: "warning" as const,
                title: "Vibration Spike",
                message: "Excavator-003 vibration at 6.2mm/s",
                timestamp: "15 min ago",
                device: "Excavator-003",
              },
              {
                id: "a3",
                severity: "info" as const,
                title: "Maintenance Due",
                message: "Loader-012 approaching 500h service interval",
                timestamp: "1h ago",
                device: "Loader-012",
              },
            ],
          },
          isRealTime: true,
        },
        {
          id: "iot-map-1",
          type: "map",
          title: "Equipment Locations",
          position: { x: 0, y: 7, w: 6, h: 4 },
          data: {
            markers: [
              {
                id: "t1",
                lat: 41.88,
                lng: -93.09,
                label: "Tractor-001",
                status: "normal" as const,
              },
              {
                id: "t7",
                lat: 41.65,
                lng: -91.53,
                label: "Tractor-007",
                status: "critical" as const,
              },
              {
                id: "e3",
                lat: 42.03,
                lng: -93.47,
                label: "Excavator-003",
                status: "warning" as const,
              },
              {
                id: "l12",
                lat: 41.52,
                lng: -92.81,
                label: "Loader-012",
                status: "normal" as const,
              },
              {
                id: "c5",
                lat: 42.22,
                lng: -91.78,
                label: "Combine-005",
                status: "normal" as const,
              },
            ],
          },
        },
        {
          id: "iot-status-1",
          type: "status-grid",
          title: "Fleet Status",
          position: { x: 6, y: 7, w: 6, h: 4 },
          data: {
            items: [
              {
                id: "t001",
                label: "Tractor-001",
                status: "normal" as const,
                value: "87°C",
              },
              {
                id: "t002",
                label: "Tractor-002",
                status: "normal" as const,
                value: "82°C",
              },
              {
                id: "t007",
                label: "Tractor-007",
                status: "critical" as const,
                value: "107°C",
              },
              {
                id: "e001",
                label: "Excavator-001",
                status: "normal" as const,
                value: "210 bar",
              },
              {
                id: "e003",
                label: "Excavator-003",
                status: "warning" as const,
                value: "290 bar",
              },
              {
                id: "l012",
                label: "Loader-012",
                status: "normal" as const,
                value: "498h / 500h",
              },
              {
                id: "c005",
                label: "Combine-005",
                status: "offline" as const,
                value: "Parked",
              },
              {
                id: "d003",
                label: "Dozer-003",
                status: "normal" as const,
                value: "95°C",
              },
              {
                id: "t010",
                label: "Truck-010",
                status: "normal" as const,
                value: "55 km/h",
              },
            ],
          },
          isRealTime: true,
        },
      ];

    case "predictive":
      return [
        {
          id: "pr-kpi-1",
          type: "kpi",
          title: "Predicted Revenue",
          position: { x: 0, y: 0, w: 3, h: 2 },
          data: { value: 2650000, format: "currency" },
        },
        {
          id: "pr-kpi-2",
          type: "kpi",
          title: "Anomalies Detected",
          position: { x: 3, y: 0, w: 3, h: 2 },
          data: { value: 7, format: "number" },
        },
        {
          id: "pr-kpi-3",
          type: "kpi",
          title: "Forecast Accuracy",
          position: { x: 6, y: 0, w: 3, h: 2 },
          data: { value: 94.2, format: "percent" },
        },
        {
          id: "pr-kpi-4",
          type: "kpi",
          title: "Risk Score",
          position: { x: 9, y: 0, w: 3, h: 2 },
          data: { value: 23, suffix: "/100", format: "number" },
        },
        {
          id: "pr-line-1",
          type: "line",
          title: "Forecast vs Actual",
          position: { x: 0, y: 2, w: 8, h: 4 },
          data: {
            series: [
              { name: "Actual", color: "#2563eb" },
              { name: "Forecast", color: "#9333ea" },
            ],
            points: Array.from({ length: 30 }, (_, i) => {
              const base = 60000 + Math.sin(i / 5) * 10000;
              return {
                date: `Day ${i + 1}`,
                Actual:
                  i < 20
                    ? Math.round(base + (Math.random() - 0.5) * 5000)
                    : undefined,
                Forecast: Math.round(base),
              };
            }),
            xKey: "date",
          },
        },
        {
          id: "pr-alert-1",
          type: "alert-feed",
          title: "Anomaly Alerts",
          position: { x: 8, y: 2, w: 4, h: 4 },
          data: {
            alerts: [
              {
                id: "an1",
                severity: "warning" as const,
                title: "Unusual Pattern",
                message: "Revenue dip predicted for next week",
                timestamp: "Today",
              },
              {
                id: "an2",
                severity: "info" as const,
                title: "Seasonality Shift",
                message: "Demand pattern 12% above expected",
                timestamp: "Yesterday",
              },
              {
                id: "an3",
                severity: "critical" as const,
                title: "Equipment Failure Risk",
                message: "Excavator-003 bearing failure in ~48h",
                timestamp: "Yesterday",
              },
            ],
          },
        },
        {
          id: "pr-heatmap-1",
          type: "heatmap",
          title: "Anomaly Detection Matrix",
          position: { x: 0, y: 6, w: 6, h: 4 },
          data: {
            rows: ["Equipment", "Supply Chain", "Revenue", "Quality", "Safety"],
            cols: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: [
              [1, 0, 2, 0, 1, 0, 0],
              [0, 1, 0, 0, 0, 0, 0],
              [0, 0, 0, 3, 1, 0, 0],
              [0, 0, 1, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
            ],
            colorRange: ["#dbeafe", "#dc2626"] as [string, string],
          },
        },
        {
          id: "pr-bar-1",
          type: "bar",
          title: "Risk Factors",
          position: { x: 6, y: 6, w: 6, h: 4 },
          data: {
            series: [{ name: "score", color: "#dc2626" }],
            points: [
              { factor: "Equipment Age", score: 78 },
              { factor: "Demand Variance", score: 45 },
              { factor: "Supply Risk", score: 32 },
              { factor: "Weather", score: 28 },
              { factor: "Market Volatility", score: 15 },
            ],
            xKey: "factor",
          },
        },
      ];

    case "custom":
      return [
        {
          id: "cust-kpi-1",
          type: "kpi",
          title: "Custom Metric",
          position: { x: 0, y: 0, w: 6, h: 2 },
          data: { value: 0, format: "number" },
        },
      ];

    default:
      return [];
  }
}
