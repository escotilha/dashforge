"use client";

import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineChartProps {
  data: {
    series: { name: string; color?: string }[];
    points: Record<string, unknown>[];
    xKey: string;
  };
}

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#9333ea", "#0891b2"];

export default function LineChartWidget({ data }: LineChartProps) {
  const { series, points, xKey } = data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLine data={points}>
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
          <Line
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stroke={s.color ?? COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLine>
    </ResponsiveContainer>
  );
}
