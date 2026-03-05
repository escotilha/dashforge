"use client";

import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarChartProps {
  data: {
    series: { name: string; color?: string }[];
    points: Record<string, unknown>[];
    xKey: string;
  };
}

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#9333ea", "#0891b2"];

export default function BarChartWidget({ data }: BarChartProps) {
  const { series, points, xKey } = data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBar data={points}>
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
        {series.length > 1 && <Legend />}
        {series.map((s, i) => (
          <Bar
            key={s.name}
            dataKey={s.name}
            fill={s.color ?? COLORS[i % COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  );
}
