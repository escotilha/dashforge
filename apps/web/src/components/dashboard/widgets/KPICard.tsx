"use client";

import { cn } from "@/lib/utils";

interface KPICardProps {
  data: {
    value: number;
    previousValue?: number;
    format?: "number" | "currency" | "percent";
    prefix?: string;
    suffix?: string;
  };
}

export default function KPICard({ data }: KPICardProps) {
  const { value, previousValue, format = "number", prefix, suffix } = data;

  const formatted = formatValue(value, format);
  const change = previousValue
    ? ((value - previousValue) / previousValue) * 100
    : null;

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="text-3xl font-bold">
        {prefix}
        {formatted}
        {suffix}
      </div>
      {change !== null && (
        <div
          className={cn(
            "mt-1 text-sm font-medium",
            change >= 0 ? "text-green-500" : "text-red-500",
          )}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}% vs previous
        </div>
      )}
    </div>
  );
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case "percent":
      return `${value.toFixed(1)}%`;
    default:
      return new Intl.NumberFormat("en-US").format(value);
  }
}
