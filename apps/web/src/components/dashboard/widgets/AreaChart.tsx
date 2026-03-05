"use client";

import {
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AreaChartProps {
  data: {
    series: { name: string; color?: string }[];
    points: Record<string, unknown>[];
    xKey: string;
  };
}

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#9333ea"];

export default function AreaChartWidget({ data }: AreaChartProps) {
  const { series, points, xKey } = data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsArea data={points}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12 }}
          stroke="var(--color-muted-foreground)"
        />
        <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.375rem",
            fontSize: 12,
          }}
        />
        {series.map((s, i) => (
          <Area
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stroke={s.color ?? COLORS[i % COLORS.length]}
            fill={s.color ?? COLORS[i % COLORS.length]}
            fillOpacity={0.1}
            strokeWidth={2}
          />
        ))}
      </RechartsArea>
    </ResponsiveContainer>
  );
}
