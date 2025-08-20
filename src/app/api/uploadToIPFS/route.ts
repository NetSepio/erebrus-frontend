import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const incoming = await req.formData();
    const file = incoming.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Forward the file to Erebrus IPFS API
    const fd = new FormData();
    fd.append("file", file, (file as any).name || "upload");

    const upstream = await fetch("https://api.ipfs.erebrus.io/api/v0/add", {
      method: "POST",
      body: fd,
      // Do not set Content-Type manually
    });

    const contentType = upstream.headers.get("content-type") || "";
    const raw = await upstream.text();

    // Parse JSON or NDJSON
    let parsed: any = null;
    try {
      if (contentType.includes("application/json")) {
        parsed = JSON.parse(raw);
      } else {
        const lines = raw.trim().split(/\r?\n/);
        parsed = JSON.parse(lines[lines.length - 1]);
      }
    } catch {
      const m = raw.match(/\"Hash\"\s*:\s*\"([^\"]+)\"/);
      parsed = { Hash: m ? m[1] : "" };
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upload failed", status: upstream.status, detail: raw },
        { status: upstream.status }
      );
    }

    const hash =
      parsed?.Hash || parsed?.hash || (parsed?.Cid?.["/"] ?? parsed?.Cid) || "";
    if (!hash) {
      return NextResponse.json(
        { error: "CID not found in upstream response", raw: parsed },
        { status: 502 }
      );
    }

    return NextResponse.json({
      Hash: hash,
      Name: parsed?.Name,
      Size: parsed?.Size,
      Url: `https://ipfs.erebrus.io/ipfs/${hash}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected error", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
