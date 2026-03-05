"use client";

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PieChartProps {
  data: {
    slices: { name: string; value: number; color?: string }[];
  };
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#0891b2",
  "#dc2626",
];

export default function PieChartWidget({ data }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPie>
        <Pie
          data={data.slices}
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="70%"
          dataKey="value"
          nameKey="name"
          paddingAngle={2}
        >
          {data.slices.map((entry, i) => (
            <Cell
              key={entry.name}
              fill={entry.color ?? COLORS[i % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.375rem",
            fontSize: 12,
          }}
        />
        <Legend />
      </RechartsPie>
    </ResponsiveContainer>
  );
}
