"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { createNodeGlobe } from "@/lib/erebrus-globe";
import type { GatewayNode } from "@/lib/gateway/types";
import { toGlobeNodes } from "@/lib/globe-nodes";


export function NodeGlobe({
  nodes,
  selectedId,
  onSelect,
  onHover,
  className = "h-[470px]",
  radiusScale,
}: {
  nodes: GatewayNode[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  className?: string;
  radiusScale?: number;
}) {
  const [globeState, setGlobeState] = useState<"loading" | "ready" | "error">("loading");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ReturnType<typeof createNodeGlobe> | null>(null);
  const selectedRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);

  const globeNodes = useMemo(() => toGlobeNodes(nodes), [nodes]);
  const nodesRef = useRef(globeNodes);
  nodesRef.current = globeNodes;

  selectedRef.current = selectedId;
  onSelectRef.current = onSelect;
  onHoverRef.current = onHover;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let active = true;
    void Promise.all([import("@/lib/erebrus-globe"), import("@/data/land-dots.json")])
      .then(([{ createNodeGlobe }, { default: landDots }]) => {
        if (!active) return;
        controllerRef.current = createNodeGlobe(canvas, {
          nodes: nodesRef.current,
          getSelectedId: () => selectedRef.current,
          onSelect: (id) => onSelectRef.current?.(id),
          onHover: (id) => onHoverRef.current?.(id),
          landDots: landDots as Array<[number, number]>,
          radiusScale,
        });
        setGlobeState("ready");
      })
      .catch(() => { if (active) setGlobeState("error"); });

    return () => {
      active = false;
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init canvas once
  }, []);

  useEffect(() => {
    controllerRef.current?.setNodes(globeNodes);
  }, [globeNodes]);

  useEffect(() => {
    controllerRef.current?.setSelected(selectedId ?? "");
  }, [selectedId]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0B0B0E] ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 60% at 50% 45%, rgba(255,107,53,0.06), transparent 70%)",
      }}
    >
      <canvas ref={canvasRef} aria-label="Network globe. Use the node list to select a node with the keyboard." className="block h-full w-full" />
      {(globeState !== "ready" || globeNodes.length === 0) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <p role="status" className="rounded-xl border border-white/[0.08] bg-black/40 px-4 py-2 text-center font-mono text-[11px] text-[var(--text-2)] backdrop-blur-sm">
            {globeState === "loading" ? "Loading network globe…" : globeState === "error" ? "The globe is unavailable. You can still use the node list." : "Waiting for nodes to come online…"}
          </p>
        </div>
      )}
    </div>
  );
}