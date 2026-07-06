"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchGraph,
  fetchNote,
  saveNote,
  type VaultGraphData,
  type GraphNode,
} from "@/lib/os/cockpit";

// react-force-graph touches window/canvas — load client-only.
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

const TYPE_COLOR: Record<string, string> = {
  reference: "#c084fc",
  niche: "#a78bfa",
  tool: "#22d3ee",
  design: "#f472b6",
  seo: "#facc15",
  dev: "#34d399",
  marketing: "#fb923c",
  legal: "#f87171",
  tax: "#fbbf24",
  decision: "#818cf8",
  lesson: "#2dd4bf",
  template: "#60a5fa",
  workflow: "#4ade80",
  "agent-config": "#f59e0b",
  project: "#a3a3a3",
};

export default function VaultGraph() {
  const [data, setData] = useState<VaultGraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 640, h: 460 });

  const load = useCallback(async () => {
    try {
      setData(await fetchGraph());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new ResizeObserver(() => {
      const el = wrapRef.current;
      if (el) setDims({ w: el.clientWidth, h: 460 });
    });
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  const openNote = useCallback(async (node: GraphNode) => {
    setSelected(node);
    setDirty(false);
    try {
      const { content } = await fetchNote(node.path);
      setNoteContent(content);
    } catch (e) {
      setNoteContent(`# Could not load note\n${e instanceof Error ? e.message : e}`);
    }
  }, []);

  async function persist() {
    if (!selected) return;
    setSaving(true);
    try {
      await saveNote(selected.path, noteContent);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  const graphData = useMemo(
    () => ({
      nodes: (data?.nodes ?? []).map((n) => ({ ...n })),
      links: (data?.links ?? []).map((l) => ({ ...l })),
    }),
    [data]
  );

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 text-center text-text-muted text-sm">
        Graph needs the local OS server. Run{" "}
        <code className="font-mono bg-bg px-1.5 py-0.5 rounded text-xs">
          npm run os:serve
        </code>{" "}
        in agent-os, then{" "}
        <button onClick={load} className="text-primary underline">
          retry
        </button>
        .
        <div className="mt-1 text-text-dim text-[11px] font-mono">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-4">
      {/* Graph canvas */}
      <div
        ref={wrapRef}
        className="relative bg-[#0e0e11] border border-border rounded-2xl overflow-hidden"
        style={{ height: 460 }}
      >
        {data && (
          <ForceGraph2D
            graphData={graphData}
            width={dims.w}
            height={dims.h}
            backgroundColor="#0e0e11"
            nodeRelSize={4}
            linkColor={() => "rgba(255,255,255,0.12)"}
            linkWidth={1}
            nodeVal={(n: object) => 1 + ((n as GraphNode).neighbors || 0)}
            nodeLabel={(n: object) => (n as GraphNode).label}
            onNodeClick={(n: object) => openNote(n as GraphNode)}
            nodeCanvasObject={(node: object, ctx: CanvasRenderingContext2D, scale: number) => {
              const n = node as GraphNode & { x: number; y: number };
              const r = 3 + Math.min((n.neighbors || 0) * 0.8, 6);
              ctx.beginPath();
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
              ctx.fillStyle = TYPE_COLOR[n.type] ?? "#9ca3af";
              ctx.fill();
              if (selected?.id === n.id) {
                ctx.strokeStyle = "#ff6a3d";
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
              if (scale > 1.6) {
                ctx.font = `${10 / scale}px ui-monospace, monospace`;
                ctx.fillStyle = "rgba(228,228,231,0.7)";
                ctx.fillText(n.label.slice(0, 24), n.x + r + 1, n.y + 3);
              }
            }}
          />
        )}
        <div className="absolute bottom-2 left-3 font-mono text-[10px] text-text-dim">
          {data?.nodes.length ?? 0} notes · {data?.links.length ?? 0} links ·
          click a node to edit
        </div>
      </div>

      {/* Editor panel */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col h-[460px]">
        {!selected ? (
          <div className="flex-1 grid place-items-center text-text-muted text-sm text-center px-4">
            Select a node to view and edit the note.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-text-dim truncate">
                  {selected.path}
                </p>
                <h3 className="font-display font-semibold text-sm text-text-primary truncate">
                  {selected.label}
                </h3>
              </div>
              <span
                className="shrink-0 font-mono text-[10px] px-2 py-0.5 rounded"
                style={{
                  background: (TYPE_COLOR[selected.type] ?? "#9ca3af") + "22",
                  color: TYPE_COLOR[selected.type] ?? "#9ca3af",
                }}
              >
                {selected.type}
              </span>
            </div>
            <textarea
              value={noteContent}
              onChange={(e) => {
                setNoteContent(e.target.value);
                setDirty(true);
              }}
              spellCheck={false}
              className="flex-1 w-full resize-none rounded-lg bg-bg border border-border p-3 font-mono text-[12px] text-text-primary leading-relaxed focus:outline-none focus:border-primary/40"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={persist}
                disabled={!dirty || saving}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving…" : dirty ? "Save note" : "Saved"}
              </button>
              <span className="text-text-dim text-[11px]">
                writes the vault file — run{" "}
                <code className="font-mono">npm run sync</code> to re-index
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
