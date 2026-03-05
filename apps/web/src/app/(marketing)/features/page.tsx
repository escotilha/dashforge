import Link from "next/link";

const FEATURES = [
  {
    title: "6 Dashboard Types",
    description:
      "Operations, Sales, Team Performance, IoT Monitor, Predictive Analytics, and Custom Executive dashboards out of the box.",
  },
  {
    title: "Real-Time Data Streaming",
    description:
      "WebSocket-powered live updates for IoT dashboards. Gauges move, charts scroll, and alerts stream in real-time.",
  },
  {
    title: "Multi-Tenant Architecture",
    description:
      "Complete data isolation with row-level security. Each tenant connects their own databases securely.",
  },
  {
    title: "12 Widget Types",
    description:
      "KPI cards, line charts, bar charts, area charts, pie charts, gauges, heatmaps, funnels, tables, status grids, alert feeds, and maps.",
  },
  {
    title: "Enterprise-Grade Security",
    description:
      "AES-256-GCM encrypted credentials, database-verified authorization, rate limiting, and audit logging.",
  },
  {
    title: "Connect Any Database",
    description:
      "PostgreSQL, MySQL, ClickHouse — connect your databases and visualize your data where it lives.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            DashForge
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start Free
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-center text-4xl font-bold">
          Everything you need for enterprise dashboards
        </h1>
        <p className="mt-4 text-center text-lg text-muted-foreground">
          Built for industrial and manufacturing companies that need real-time
          data visibility
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border p-6"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/demo"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            See Live Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
