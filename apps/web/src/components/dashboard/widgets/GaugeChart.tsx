"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface GaugeChartProps {
  data: {
    value: number;
    min: number;
    max: number;
    unit: string;
    thresholds?: { warning: number; critical: number };
  };
}

export default function GaugeChart({ data }: GaugeChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { value, min, max, unit, thresholds } = data;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height * 1.6) / 2 - 10;
    const cx = width / 2;
    const cy = height * 0.75;

    const startAngle = -Math.PI * 0.75;
    const endAngle = Math.PI * 0.75;
    const scale = d3
      .scaleLinear()
      .domain([min, max])
      .range([startAngle, endAngle])
      .clamp(true);

    const arc = d3
      .arc<{ startAngle: number; endAngle: number }>()
      .innerRadius(radius * 0.7)
      .outerRadius(radius);

    // Background arc
    svg
      .append("path")
      .attr("d", arc({ startAngle, endAngle })!)
      .attr("transform", `translate(${cx},${cy})`)
      .attr("fill", "var(--color-muted)");

    // Color segments
    if (thresholds) {
      const segments = [
        { start: min, end: thresholds.warning, color: "#16a34a" },
        {
          start: thresholds.warning,
          end: thresholds.critical,
          color: "#f59e0b",
        },
        { start: thresholds.critical, end: max, color: "#dc2626" },
      ];

      segments.forEach((seg) => {
        svg
          .append("path")
          .attr(
            "d",
            arc({ startAngle: scale(seg.start), endAngle: scale(seg.end) })!,
          )
          .attr("transform", `translate(${cx},${cy})`)
          .attr("fill", seg.color)
          .attr("opacity", 0.3);
      });
    }

    // Value arc
    const valueColor = thresholds
      ? value >= thresholds.critical
        ? "#dc2626"
        : value >= thresholds.warning
          ? "#f59e0b"
          : "#16a34a"
      : "#2563eb";

    svg
      .append("path")
      .attr("d", arc({ startAngle, endAngle: scale(value) })!)
      .attr("transform", `translate(${cx},${cy})`)
      .attr("fill", valueColor);

    // Needle
    const needleAngle = scale(value);
    const needleLen = radius * 0.6;
    svg
      .append("line")
      .attr("x1", cx)
      .attr("y1", cy)
      .attr("x2", cx + needleLen * Math.cos(needleAngle - Math.PI / 2))
      .attr("y2", cy + needleLen * Math.sin(needleAngle - Math.PI / 2))
      .attr("stroke", "var(--color-foreground)")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");

    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", 4)
      .attr("fill", "var(--color-foreground)");

    // Value text
    svg
      .append("text")
      .attr("x", cx)
      .attr("y", cy - 15)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--color-foreground)")
      .attr("font-size", "1.5rem")
      .attr("font-weight", "bold")
      .text(`${value.toFixed(1)}`);

    svg
      .append("text")
      .attr("x", cx)
      .attr("y", cy + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--color-muted-foreground)")
      .attr("font-size", "0.75rem")
      .text(unit);
  }, [value, min, max, unit, thresholds]);

  return <svg ref={svgRef} className="h-full w-full" />;
}
