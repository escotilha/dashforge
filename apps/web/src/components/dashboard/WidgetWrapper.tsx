"use client";

import { Suspense } from "react";
import { cn } from "@/lib/utils";

interface WidgetWrapperProps {
  title: string;
  isRealTime?: boolean;
  lastUpdated?: Date;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}

export function WidgetWrapper({
  title,
  isRealTime,
  lastUpdated,
  error,
  children,
  className,
}: WidgetWrapperProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          {isRealTime && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Live
            </span>
          )}
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(lastUpdated)}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        {error ? (
          <div className="flex h-full items-center justify-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            }
          >
            {children}
          </Suspense>
        )}
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}
