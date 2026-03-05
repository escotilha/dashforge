"use client";

import { use } from "react";
import { DashboardRenderer } from "@/components/dashboard/DashboardRenderer";
import { getDemoWidgets } from "@/lib/dashboard/templates";
import { DASHBOARD_TYPE_META, type DashboardType } from "@dashforge/shared";

export default function DashboardViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const type = id as DashboardType;
  const meta = DASHBOARD_TYPE_META[type];

  if (!meta) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Dashboard not found</p>
      </div>
    );
  }

  const widgets = getDemoWidgets(type);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta.description}
          </p>
        </div>
        {meta.plan === "paid" && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Pro
          </span>
        )}
      </div>
      <DashboardRenderer widgets={widgets} />
    </div>
  );
}
