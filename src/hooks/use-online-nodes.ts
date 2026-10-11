"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNodes } from "@/lib/gateway/client";
import type { GatewayNode } from "@/lib/gateway/types";

/** Matches gateway node WS heartbeat interval. */
export const NODE_POLL_INTERVAL_MS = 30_000;

export type OnlineNodesSnapshot = {
  nodes: GatewayNode[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

/** Polls online nodes every 30s and uses the gateway RTT as a latency fallback. */
export function useOnlineNodesPoller(): OnlineNodesSnapshot {
  const [nodes, setNodes] = useState<GatewayNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const request = useRef<AbortController | null>(null);
  const pending = useRef<Promise<void> | null>(null);

  const load = useCallback((): Promise<void> => {
    if (pending.current) return pending.current;
    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const task = (async () => {
      try {
        const start = performance.now();
        const list = await fetchNodes({ status: "online" }, controller.signal);
        const gatewayLatency = performance.now() - start;
        if (!mounted.current || request.current !== controller) return;
        setNodes(list.map((node) => ({ ...node, latency_ms: gatewayLatency })));
        setError(null);
      } catch {
        if (mounted.current && request.current === controller) {
          setError("Could not refresh node availability. Any displayed nodes are from the last successful update.");
        }
      } finally {
        clearTimeout(timeout);
        if (request.current === controller) {
          pending.current = null;
          if (mounted.current) setLoading(false);
        }
      }
    })();
    pending.current = task;
    return task;
  }, []);

  useEffect(() => {
    mounted.current = true;
    const refreshVisible = () => {
      if (navigator.onLine === false) {
        setError("You are offline. Node availability will refresh when your connection returns.");
        setLoading(false);
        return;
      }
      if (document.visibilityState !== "hidden") void load();
    };
    refreshVisible();
    const id = window.setInterval(refreshVisible, NODE_POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", refreshVisible);
    window.addEventListener("online", refreshVisible);
    return () => {
      mounted.current = false;
      request.current?.abort();
      request.current = null;
      pending.current = null;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", refreshVisible);
      window.removeEventListener("online", refreshVisible);
    };
  }, [load]);

  return { nodes, loading, error, refresh: load };
}
