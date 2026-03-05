"use client";

import { Suspense } from "react";
import type { WidgetType } from "@dashforge/shared";
import { WidgetWrapper } from "./WidgetWrapper";
import { getWidgetComponent } from "./widgets";

export interface WidgetData {
  id: string;
  type: WidgetType;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  data: Record<string, unknown>;
  isRealTime?: boolean;
}

interface DashboardRendererProps {
  widgets: WidgetData[];
  columns?: number;
}

export function DashboardRenderer({
  widgets,
  columns = 12,
}: DashboardRendererProps) {
  const rowHeight = 80;
  const gap = 16;

  return (
    <div
      className="relative w-full"
      style={{
        minHeight: widgets.reduce(
          (max, w) =>
            Math.max(max, (w.position.y + w.position.h) * (rowHeight + gap)),
          0,
        ),
      }}
    >
      {widgets.map((widget) => {
        const Component = getWidgetComponent(widget.type);
        const left = `${(widget.position.x / columns) * 100}%`;
        const width = `calc(${(widget.position.w / columns) * 100}% - ${gap}px)`;
        const top = widget.position.y * (rowHeight + gap);
        const height =
          widget.position.h * rowHeight + (widget.position.h - 1) * gap;

        return (
          <div
            key={widget.id}
            className="absolute"
            style={{ left, width, top, height }}
          >
            <WidgetWrapper title={widget.title} isRealTime={widget.isRealTime}>
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                }
              >
                <Component data={widget.data} />
              </Suspense>
            </WidgetWrapper>
          </div>
        );
      })}
    </div>
  );
}
