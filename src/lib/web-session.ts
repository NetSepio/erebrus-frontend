"use client";

export interface WebSession {
  authenticated: boolean;
  user_id?: string;
  role?: string;
  wallet_address?: string;
  method?: string;
  expires_at?: number;
  needsMigration?: boolean;
}
interface Snapshot { session: WebSession | null; loading: boolean; error?: string }
let snapshot: Snapshot = { session: null, loading: true };
const serverSnapshot = snapshot;
const listeners = new Set<() => void>();
let bootstrap: Promise<void> | undefined;
let generation = 0;
let channel: BroadcastChannel | undefined;
const LOGOUT_PENDING = "erebrus_logout_pending";
let logoutIntent: "pending" | "complete" | undefined;
function pendingLogout(): "pending" | "complete" | undefined {
  try {
    const stored = localStorage.getItem(LOGOUT_PENDING);
    return stored === "complete" ? "complete" : stored === "pending" || stored === "1" ? "pending" : undefined;
  } catch { return logoutIntent; }
}
function markLogout(intent: "pending" | "complete" | undefined) {
  logoutIntent = intent;
  // This is a non-sensitive intent marker, never a credential or identity.
  try { if (intent) localStorage.setItem(LOGOUT_PENDING, intent); else localStorage.removeItem(LOGOUT_PENDING); } catch {}
}
export function subscribeSession(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function sessionSnapshot() { return snapshot; }
export function sessionServerSnapshot() { return serverSnapshot; }
function emit(next: Snapshot) { snapshot = next; listeners.forEach((listener) => listener()); }
function broadcast() { channel?.postMessage("changed"); }
export function acceptWebSession(session: WebSession) {
  generation++;
  markLogout(undefined);
  emit({ session, loading: false });
  broadcast();
}
export function csrfHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set("X-Erebrus-CSRF", "1");
  return headers;
}
export function observeSessionResponse(response: Response) {
  // Generic 401 and business errors do not sign users out.
  if (response.headers.get("x-erebrus-session-ended") === "1") {
    generation++;
    emit({ session: null, loading: false });
    broadcast();
  }
}
export async function restoreWebSession(force = false): Promise<void> {
  if (bootstrap && !force) return bootstrap;
  const started = generation;
  const pending = (async () => {
    try {
      if (pendingLogout()) {
        emit({ session: null, loading: false });
        if (pendingLogout() === "pending") await logoutWebSession();
        return;
      }
      let response = await fetch("/api/session", { cache: "no-store", credentials: "same-origin" });
      let data = await response.json();
      if (data.needsMigration) {
        response = await fetch("/api/session/upgrade", { method: "POST", headers: csrfHeaders(), credentials: "same-origin" });
        data = await response.json();
      }
      if (started !== generation) return;
      if (response.ok) emit({ session: data.authenticated ? data : null, loading: false });
      else if (["SESSION_REVOKED", "REFRESH_TOKEN_INVALID", "REFRESH_TOKEN_REUSED", "LEGACY_LOGIN_REQUIRED"].includes(data.code)) emit({ session: null, loading: false });
      else emit({ ...snapshot, loading: false, error: "Session service is temporarily unavailable" });
    } catch {
      if (started === generation) emit({ ...snapshot, loading: false, error: "Session service is temporarily unavailable" });
    }
  })();
  bootstrap = pending;
  try { await pending; } finally { if (bootstrap === pending) bootstrap = undefined; }
}
export function startSessionSync() {
  if (typeof BroadcastChannel !== "undefined" && !channel) {
    channel = new BroadcastChannel("erebrus-session");
    channel.onmessage = (event) => {
      generation++;
      if (event.data === "logout") { logoutIntent = "pending"; emit({ session: null, loading: false }); }
      else { logoutIntent = undefined; void restoreWebSession(true); }
    };
  }
  const resume = () => { if (document.visibilityState === "visible") void restoreWebSession(); };
  window.addEventListener("focus", resume);
  window.addEventListener("online", resume);
  document.addEventListener("visibilitychange", resume);
  void restoreWebSession();
  return () => { window.removeEventListener("focus", resume); window.removeEventListener("online", resume); document.removeEventListener("visibilitychange", resume); };
}
export async function logoutWebSession(): Promise<{ confirmed: boolean; localCleared: boolean }> {
  generation++;
  markLogout("pending");
  // Drop the visible identity immediately; ignore earlier restore responses.
  emit({ session: null, loading: false });
  channel?.postMessage("logout");
  try {
    const response = await fetch("/api/session/logout", { method: "POST", headers: csrfHeaders(), credentials: "same-origin" });
    const data = await response.json();
    if (response.ok && data.logged_out === true) markLogout("complete");
    return { confirmed: response.ok && data.remote_logout_confirmed === true, localCleared: response.ok && data.logged_out === true };
  } catch { return { confirmed: false, localCleared: false }; }
}
