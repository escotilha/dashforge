"use client";

import { cn } from "@/lib/utils";

interface StatusGridProps {
  data: {
    items: {
      id: string;
      label: string;
      status: "normal" | "warning" | "critical" | "offline";
      value?: string;
    }[];
  };
}

const STATUS_STYLES = {
  normal: "border-green-500/30 bg-green-500/10 text-green-700",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700",
  critical: "border-red-500/30 bg-red-500/10 text-red-700",
  offline: "border-gray-500/30 bg-gray-500/10 text-gray-500",
};

const STATUS_DOT = {
  normal: "bg-green-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
  offline: "bg-gray-400",
};

export default function StatusGrid({ data }: StatusGridProps) {
  return (
    <div className="grid h-full auto-rows-min grid-cols-2 gap-2 overflow-auto sm:grid-cols-3">
      {data.items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex flex-col rounded-md border p-2.5",
            STATUS_STYLES[item.status],
          )}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={cn("h-2 w-2 rounded-full", STATUS_DOT[item.status])}
            />
            <span className="truncate text-xs font-medium">{item.label}</span>
          </div>
          {item.value && (
            <span className="mt-1 text-xs opacity-80">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
