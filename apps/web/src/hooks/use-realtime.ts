"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { create } from "zustand";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

interface SensorUpdate {
  deviceId: string;
  deviceName: string;
  metric: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  lat: number | null;
  lng: number | null;
  timestamp: string;
}

interface AlertUpdate {
  id: string;
  deviceId: string;
  severity: "info" | "warning" | "critical" | "emergency";
  title: string;
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: string;
}

interface RealtimeState {
  connected: boolean;
  sensors: Map<string, SensorUpdate>;
  alerts: AlertUpdate[];
  setConnected: (connected: boolean) => void;
  updateSensors: (readings: SensorUpdate[]) => void;
  addAlerts: (alerts: AlertUpdate[]) => void;
  clearAlerts: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  connected: false,
  sensors: new Map(),
  alerts: [],
  setConnected: (connected) => set({ connected }),
  updateSensors: (readings) =>
    set((state) => {
      const sensors = new Map(state.sensors);
      for (const r of readings) {
        sensors.set(`${r.deviceId}:${r.metric}`, r);
      }
      return { sensors };
    }),
  addAlerts: (newAlerts) =>
    set((state) => ({
      alerts: [...newAlerts, ...state.alerts].slice(0, 100),
    })),
  clearAlerts: () => set({ alerts: [] }),
}));

export function useRealtimeConnection(tenantId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const store = useRealtimeStore();

  useEffect(() => {
    if (!tenantId) return;

    const socket = io(WS_URL, {
      transports: ["websocket"],
      auth: { tenantId },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      store.setConnected(true);
    });

    socket.on("disconnect", () => {
      store.setConnected(false);
    });

    socket.on("sensor:update", (readings: SensorUpdate[]) => {
      store.updateSensors(readings);
    });

    socket.on("alerts:update", (alerts: AlertUpdate[]) => {
      store.addAlerts(alerts);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      store.setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const subscribeToDashboard = useCallback((dashboardId: string) => {
    socketRef.current?.emit("dashboard:subscribe", dashboardId);
    return () => {
      socketRef.current?.emit("dashboard:unsubscribe", dashboardId);
    };
  }, []);

  return { subscribeToDashboard };
}
