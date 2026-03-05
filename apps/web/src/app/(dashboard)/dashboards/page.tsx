import Link from "next/link";
import { DASHBOARD_TYPE_META } from "@dashforge/shared";

export default function DashboardsPage() {
  const dashboardTypes = Object.entries(DASHBOARD_TYPE_META);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your dashboards
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardTypes.map(([type, meta]) => (
          <Link
            key={type}
            href={`/dashboards/${type}`}
            className="group flex flex-col rounded-lg border border-border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{meta.label}</h3>
              {meta.plan === "paid" && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Pro
                </span>
              )}
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              {meta.description}
            </p>
            <span className="mt-4 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Open Dashboard
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
