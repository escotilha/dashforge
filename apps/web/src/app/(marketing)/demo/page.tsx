"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardRenderer } from "@/components/dashboard/DashboardRenderer";
import { getDemoWidgets } from "@/lib/dashboard/templates";
import { DASHBOARD_TYPE_META, type DashboardType } from "@dashforge/shared";
import { cn } from "@/lib/utils";

const DEMO_CLIENTS = [
  { name: "John Deere", type: "iot" as const, industry: "Agriculture" },
  { name: "Volvo", type: "operations" as const, industry: "Trucking" },
  { name: "Caterpillar", type: "iot" as const, industry: "Construction" },
  { name: "Siemens", type: "predictive" as const, industry: "Manufacturing" },
  { name: "ABB", type: "sales" as const, industry: "Energy" },
];

export default function DemoPage() {
  const [selectedClient, setSelectedClient] = useState(DEMO_CLIENTS[0]);
  const [selectedType, setSelectedType] = useState<DashboardType>(
    selectedClient.type,
  );

  const widgets = getDemoWidgets(selectedType);
  const dashboardTypes = Object.entries(DASHBOARD_TYPE_META);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            DashForge
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
              Live Demo
            </span>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Live Dashboard Demo</h1>
          <p className="mt-2 text-muted-foreground">
            See how enterprise clients use DashForge for real-time data
            visualization
          </p>
        </div>

        {/* Client selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {DEMO_CLIENTS.map((client) => (
            <button
              key={client.name}
              onClick={() => {
                setSelectedClient(client);
                setSelectedType(client.type);
              }}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                selectedClient.name === client.name
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted",
              )}
            >
              <div>{client.name}</div>
              <div className="text-xs text-muted-foreground">
                {client.industry}
              </div>
            </button>
          ))}
        </div>

        {/* Dashboard type tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
          {dashboardTypes.map(([type, meta]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as DashboardType)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                selectedType === type
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {meta.label}
              {meta.plan === "paid" && (
                <span className="ml-1 text-xs text-primary">Pro</span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        <div className="rounded-lg border border-border bg-card p-6">
          <DashboardRenderer widgets={widgets} />
        </div>
      </div>
    </div>
  );
}
