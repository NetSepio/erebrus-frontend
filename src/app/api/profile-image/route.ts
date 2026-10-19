import { NextRequest, NextResponse } from "next/server";
import { checkCsrf, sessionFailure, sessionId, sessions, setSessionCookie } from "@/lib/server/session/http";
import { SessionError } from "@/lib/server/session/types";
import { MAX_PROFILE_IMAGE_BYTES } from "@/lib/ipfs";

// IPFS node HTTP API (Kubo). Local daemon for now; point at a hosted node later.
const IPFS_API_URL = process.env.IPFS_API_URL ?? "http://127.0.0.1:5001";

export const runtime = "nodejs";

/** The profile write remains gateway-authorized; the upload itself also needs
 * a live server session and the same CSRF checks as other mutations. */
export async function POST(req: NextRequest) {
  try { return await upload(req); } catch (error) { return sessionFailure(error); }
}
async function upload(req: NextRequest) {
  checkCsrf(req);
  const id = sessionId(req);
  if (!id) throw new SessionError("NOT_SIGNED_IN", 401);
  await sessions.access(id);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Attach an image as the `file` field" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 415 });
  }
  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image must be smaller than 5MB" }, { status: 413 });
  }

  const ipfsForm = new FormData();
  ipfsForm.append("file", file, file.name || "profile-image");

  let res: Response;
  try {
    res = await fetch(`${IPFS_API_URL}/api/v0/add?cid-version=1&pin=true`, {
      method: "POST",
      body: ipfsForm,
    });
  } catch {
    return NextResponse.json(
      { error: "IPFS node is unreachable — is the daemon running?" },
      { status: 502 }
    );
  }
  if (!res.ok) {
    return NextResponse.json({ error: `IPFS add failed (${res.status})` }, { status: 502 });
  }

  const payload = (await res.json()) as { Hash?: string };
  if (!payload.Hash) {
    return NextResponse.json({ error: "IPFS add returned no hash" }, { status: 502 });
  }

  const response = NextResponse.json({ cid: payload.Hash });
  setSessionCookie(response, id, await sessions.read(id));
  return response;
}
