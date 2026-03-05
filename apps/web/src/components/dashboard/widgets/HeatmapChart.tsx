"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface HeatmapChartProps {
  data: {
    rows: string[];
    cols: string[];
    values: number[][];
    colorRange?: [string, string];
  };
}

export default function HeatmapChart({ data }: HeatmapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { rows, cols, values, colorRange = ["#dbeafe", "#1d4ed8"] } = data;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 5, right: 5, bottom: 30, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(cols).range([0, width]).padding(0.05);
    const y = d3.scaleBand().domain(rows).range([0, height]).padding(0.05);

    const flat = values.flat();
    const color = d3
      .scaleLinear<string>()
      .domain([d3.min(flat) ?? 0, d3.max(flat) ?? 1])
      .range(colorRange);

    rows.forEach((row, ri) => {
      cols.forEach((col, ci) => {
        g.append("rect")
          .attr("x", x(col)!)
          .attr("y", y(row)!)
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .attr("fill", color(values[ri][ci]))
          .attr("rx", 2);
      });
    });

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("fill", "var(--color-muted-foreground)");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("fill", "var(--color-muted-foreground)");

    g.selectAll(".domain, .tick line").attr("stroke", "var(--color-border)");
  }, [rows, cols, values, colorRange]);

  return <svg ref={svgRef} className="h-full w-full" />;
}
