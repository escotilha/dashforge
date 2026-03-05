"use client";

import { cn } from "@/lib/utils";

interface AlertFeedProps {
  data: {
    alerts: {
      id: string;
      severity: "info" | "warning" | "critical" | "emergency";
      title: string;
      message: string;
      timestamp: string;
      device?: string;
    }[];
  };
}

const SEVERITY_STYLES = {
  info: "border-l-blue-500",
  warning: "border-l-yellow-500",
  critical: "border-l-red-500",
  emergency: "border-l-red-700 bg-red-500/5",
};

export default function AlertFeed({ data }: AlertFeedProps) {
  return (
    <div className="flex h-full flex-col gap-2 overflow-auto">
      {data.alerts.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          No active alerts
        </div>
      ) : (
        data.alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "rounded border border-border border-l-4 p-3",
              SEVERITY_STYLES[alert.severity],
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide">
                {alert.severity}
              </span>
              <span className="text-xs text-muted-foreground">
                {alert.timestamp}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium">{alert.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {alert.message}
            </p>
            {alert.device && (
              <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-xs">
                {alert.device}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}
