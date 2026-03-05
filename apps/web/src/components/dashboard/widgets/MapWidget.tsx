"use client";

interface MapWidgetProps {
  data: {
    markers: {
      id: string;
      lat: number;
      lng: number;
      label: string;
      status?: "normal" | "warning" | "critical";
    }[];
    center?: { lat: number; lng: number };
    zoom?: number;
  };
}

const STATUS_COLORS = {
  normal: "#16a34a",
  warning: "#f59e0b",
  critical: "#dc2626",
};

export default function MapWidget({ data }: MapWidgetProps) {
  const { markers, center, zoom = 5 } = data;
  const mapCenter =
    center ??
    (markers[0]
      ? { lat: markers[0].lat, lng: markers[0].lng }
      : { lat: 39.8, lng: -98.5 });

  // Static map placeholder — Leaflet adds 40KB+ and requires window.
  // For MVP, render a styled marker list with coordinates.
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Center: {mapCenter.lat.toFixed(1)}, {mapCenter.lng.toFixed(1)}
        </span>
        <span>Zoom: {zoom}x</span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid gap-1.5">
          {markers.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: STATUS_COLORS[m.status ?? "normal"],
                }}
              />
              <span className="flex-1 truncate font-medium">{m.label}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {m.lat.toFixed(2)}, {m.lng.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
