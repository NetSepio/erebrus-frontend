export interface Credentials {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
  sessionId: string;
  userId: string;
  role: string;
}
export interface ServerSession {
  credentials?: Credentials;
  walletAddress: string;
  method: string;
  state: "active" | "refreshing" | "uncertain" | "revoked" | "legacy-unrecoverable";
  expiresAt: number;
  retryAt?: number;
  remoteLogoutConfirmed?: boolean;
}
export interface LockedSession {
  read(): Promise<ServerSession | null>;
  write(session: ServerSession): Promise<void>;
}
export interface SessionStore {
  locked<T>(id: string, work: (session: LockedSession) => Promise<T>): Promise<T>;
}
export class SessionError extends Error {
  constructor(public code: string, public status = 503, public retryAfter?: string, public terminal = false) {
    super(code);
  }
}
