"use client";

interface FunnelChartProps {
  data: {
    stages: { name: string; value: number; color?: string }[];
  };
}

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

export default function FunnelChart({ data }: FunnelChartProps) {
  const { stages } = data;
  const maxValue = stages[0]?.value ?? 1;

  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {stages.map((stage, i) => {
        const widthPct = (stage.value / maxValue) * 100;
        const convRate =
          i > 0 ? ((stage.value / stages[i - 1].value) * 100).toFixed(1) : null;

        return (
          <div key={stage.name} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-right text-xs text-muted-foreground">
              {stage.name}
            </div>
            <div className="flex-1">
              <div
                className="flex h-8 items-center justify-center rounded text-xs font-medium text-white transition-all"
                style={{
                  width: `${Math.max(widthPct, 10)}%`,
                  backgroundColor: stage.color ?? COLORS[i % COLORS.length],
                }}
              >
                {stage.value.toLocaleString()}
              </div>
            </div>
            <div className="w-14 shrink-0 text-xs text-muted-foreground">
              {convRate ? `${convRate}%` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
