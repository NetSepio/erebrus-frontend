// Test-only shared durable-state model; production always uses PostgreSQL.
import type { ServerSession, SessionStore } from "./types";
export class TestStore implements SessionStore {
  rows = new Map<string, ServerSession>();
  private locks = new Map<string, Promise<unknown>>();
  locked<T>(id: string, work: Parameters<SessionStore["locked"]>[1]): Promise<T> {
    const pending = (this.locks.get(id) ?? Promise.resolve()).catch(() => {}).then(() => work({
      read: async () => structuredClone(this.rows.get(id) ?? null),
      write: async (session) => { this.rows.set(id, structuredClone(session)); },
    }));
    this.locks.set(id, pending);
    return pending as Promise<T>;
  }
}
