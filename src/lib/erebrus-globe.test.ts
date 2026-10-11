import { afterEach, describe, expect, it, vi } from "vitest";
import { createNodeGlobe } from "./erebrus-globe";

function setup(reduced = false) {
  const media = Object.assign(new EventTarget(), { matches: reduced });
  const doc = Object.assign(new EventTarget(), { visibilityState: "visible" });
  const win = Object.assign(new EventTarget(), { devicePixelRatio: 1, matchMedia: () => media });
  const frames = new Map<number, FrameRequestCallback>();
  let nextId = 0;
  vi.stubGlobal("document", doc);
  vi.stubGlobal("window", win);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++nextId, callback); return nextId; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  const ctx = {
    clearRect: vi.fn(), createRadialGradient: () => ({ addColorStop: vi.fn() }),
    beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(),
  };
  const canvas = Object.assign(new EventTarget(), {
    width: 400, height: 400, style: {}, getContext: () => ctx,
    getBoundingClientRect: () => ({ width: 400, height: 400, left: 0, top: 0 }),
  });
  const frame = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(0));
  };
  return { media, doc, canvas, frames, frame };
}

afterEach(() => vi.unstubAllGlobals());

describe("globe animation lifecycle", () => {
  it("stops drawing in a hidden tab and resumes when visible", () => {
    const { doc, canvas, frames, frame } = setup();
    const globe = createNodeGlobe(canvas as unknown as HTMLCanvasElement, { nodes: [] });
    expect(frames.size).toBe(1);
    doc.visibilityState = "hidden";
    doc.dispatchEvent(new Event("visibilitychange"));
    frame();
    expect(frames.size).toBe(0);
    doc.visibilityState = "visible";
    doc.dispatchEvent(new Event("visibilitychange"));
    frame();
    expect(frames.size).toBe(1);
    globe.destroy();
    expect(frames.size).toBe(0);
    doc.dispatchEvent(new Event("visibilitychange"));
    expect(frames.size).toBe(0);
  });

  it("renders reduced-motion views without a continuous animation loop", () => {
    const { canvas, frames, frame, media } = setup(true);
    const globe = createNodeGlobe(canvas as unknown as HTMLCanvasElement, { nodes: [] });
    expect(frames.size).toBe(0);
    globe.setNodes([]);
    frame();
    expect(frames.size).toBe(0);
    media.matches = false;
    media.dispatchEvent(new Event("change"));
    frame();
    expect(frames.size).toBe(1);
    globe.destroy();
  });
});
