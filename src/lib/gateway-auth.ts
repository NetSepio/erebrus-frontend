import axios from "axios";
import { acceptWebSession } from "@/lib/web-session";

import { BrowserProvider, type Eip1193Provider } from "ethers";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import { storedReferralCode, clearReferralCode } from "@/lib/referral";

// A non-simple custom header is validated with Origin by the same-origin BFF.
const authHttp = axios.create({ headers: { "X-Erebrus-CSRF": "1" } });
function desktopHeaders(desktop = false) { return desktop ? { "X-Erebrus-Desktop-Auth": "1" } : {}; }

/** Browser → `/api/gateway/*` proxy. Server → gateway from `.env`. */
function authBase(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/gateway/`;
  }
  const raw = process.env.NEXT_PUBLIC_GATEWAY_URL?.trim() ?? "https://gateway.erebrus.io/";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

function authUrl(): string {
  const base = authBase();
  return typeof window !== "undefined" ? `${base}auth` : `${base}api/v2/auth`;
}

export type AuthChallenge = {
  challengeId: string;
  message: string;
};

export type AuthSession = {
  /** Only populated by the explicit /auth native-app handoff. */
  token: string;
  userId: string;
  role: string;
  walletAddress: string;
};

function parseChallengeResponse(body: unknown): AuthChallenge {
  const record = (body ?? {}) as Record<string, unknown>;
  const challengeId = (record.flow_id ?? "").toString();
  const message = (record.message ?? "").toString();
  if (!challengeId || !message) {
    throw new Error("Gateway did not return a login challenge");
  }
  return { challengeId, message };
}

function buildCompleteBody(
  challengeId: string,
  signature: string,
  publicKey: string
): Record<string, string> {
  const body: Record<string, string> = {
    flow_id: challengeId,
    signature,
    public_key: publicKey,
  };
  // Referral attribution: the gateway binds the code once, on first signup.
  const ref = storedReferralCode();
  if (ref) body.ref = ref;
  return body;
}

async function fetchAuthChallenge(
  walletAddress: string,
  chain: "sol" | "evm" = "sol"
): Promise<AuthChallenge> {
  const { data } = await authHttp.get(authUrl(), {
    params: { wallet_address: walletAddress, chain },
  });
  return parseChallengeResponse(data);
}

async function completeAuth(
  challengeId: string,
  signature: string,
  publicKey: string,
  desktop = false
): Promise<AuthSession> {
  const { data } = await authHttp.post(
    authUrl(),
    buildCompleteBody(challengeId, signature, publicKey),
    { headers: desktopHeaders(desktop) }
  );

  const session = { ...parseSession(data, desktop), walletAddress: publicKey };
  if (!desktop) await clearReferralCodeWhenBound();
  return session;
}

/** Browser → `/api/gateway/<path>`; server → `<gateway>/api/v2/<path>`. */
function gatewayAuthUrl(path: string): string {
  const base = authBase();
  return typeof window !== "undefined" ? `${base}${path}` : `${base}api/v2/${path}`;
}

// Keep an unconfirmed invite in local storage. In particular, an invalid code
// must remain visible/retryable instead of disappearing after a successful
// login whose authentication was otherwise unrelated to referral binding.
async function clearReferralCodeWhenBound(): Promise<void> {
  if (!storedReferralCode()) return;
  try {
    const { data } = await authHttp.get(gatewayAuthUrl("referrals/me"), {
      headers: { "X-Erebrus-CSRF": "1" },
    });
    if (data?.referral_bound === true) clearReferralCode();
  } catch {
    // Authentication remains successful; retry referral confirmation later.
  }
}

function parseSession(data: unknown, desktop = false): AuthSession {
  const d = (data ?? {}) as Record<string, unknown>;
  const token = (d.token ?? "").toString();
  const userId = (d.user_id ?? "").toString();
  const role = (d.role ?? "user").toString();
  if (!userId) {
    throw new Error("Gateway did not return a session");
  }
  if (!desktop) acceptWebSession({ authenticated: true, user_id: userId, role,
    wallet_address: String(d.wallet_address ?? ""), method: String(d.method ?? "wallet"), expires_at: Number(d.expires_at) });
  return { token, userId, role, walletAddress: String(d.wallet_address ?? "") };
}

// ── Passwordless / OIDC login (wallet-optional accounts) ─────────────────────

/** Sends a one-time login code to the email. */
export async function emailLoginStart(email: string): Promise<void> {
  await authHttp.post(gatewayAuthUrl("auth/email/login/start"), { email });
}

/** Verifies the code and returns a session for the resolved/created account. */
export async function emailLoginVerify(email: string, code: string, desktop = false): Promise<AuthSession> {
  const ref = storedReferralCode();
  const { data } = await authHttp.post(gatewayAuthUrl("auth/email/login/verify"), {
    email,
    code,
    ...(ref ? { ref } : {}),
  }, { headers: desktopHeaders(desktop) });
  const session = parseSession(data, desktop);
  if (!desktop) await clearReferralCodeWhenBound();
  return session;
}

export type AuthMethods = {
  wallet: boolean;
  email: boolean;
  google: boolean;
  apple: boolean;
};

/** Reports which login methods the gateway has configured. */
export async function fetchAuthMethods(): Promise<AuthMethods> {
  const { data } = await authHttp.get(gatewayAuthUrl("auth/methods"));
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    wallet: d.wallet !== false,
    email: d.email === true,
    google: d.google === true,
    apple: d.apple === true,
  };
}

/** Exchanges a Google ID token for a session. */
export async function googleLogin(idToken: string, desktop = false): Promise<AuthSession> {
  const ref = storedReferralCode();
  const { data } = await authHttp.post(gatewayAuthUrl("auth/google"), {
    id_token: idToken,
    ...(ref ? { ref } : {}),
  }, { headers: desktopHeaders(desktop) });
  const session = parseSession(data, desktop);
  if (!desktop) await clearReferralCodeWhenBound();
  return session;
}

/** Exchanges an Apple ID token for a session. */
export async function appleLogin(
  idToken: string,
  nonce?: string,
  authorizationCode?: string,
  desktop = false
): Promise<AuthSession> {
  const ref = storedReferralCode();
  const body: Record<string, string> = { id_token: idToken };
  if (nonce) body.nonce = nonce;
  if (authorizationCode) body.authorization_code = authorizationCode;
  if (ref) body.ref = ref;
  const { data } = await authHttp.post(gatewayAuthUrl("auth/apple"), body, { headers: desktopHeaders(desktop) });
  const session = parseSession(data, desktop);
  if (!desktop) await clearReferralCodeWhenBound();
  return session;
}

function signatureBytesToHex(signature: ArrayLike<number>): string {
  return Array.from(signature)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function authenticateSolana(
  walletAddress: string,
  walletProvider: Provider,
  desktop = false
): Promise<AuthSession> {
  const { challengeId, message } = await fetchAuthChallenge(walletAddress, "sol");
  const encodedMessage = new TextEncoder().encode(message);
  const signature = await walletProvider.signMessage(encodedMessage);
  return completeAuth(challengeId, signatureBytesToHex(signature), walletAddress, desktop);
}

// ── Wallet linking (attach a wallet to the signed-in account) ────────────────
// Same challenge+sign as login, but POST /account/wallet using the BFF
// session cookie: the wallet attaches to the existing (email / social) account
// instead of logging in as a separate wallet account.

export type LinkedWallet = { walletAddress: string; chain: string };

async function completeWalletLink(
  challengeId: string,
  signature: string,
  publicKey: string
): Promise<LinkedWallet> {
  try {
    const { data } = await authHttp.post(
      gatewayAuthUrl("account/wallet"),
      { flow_id: challengeId, signature, public_key: publicKey },
      { headers: { "X-Erebrus-CSRF": "1" } }
    );
    return {
      walletAddress: (data?.wallet_address ?? "").toString(),
      chain: (data?.chain ?? "").toString(),
    };
  } catch (err) {
    // Surface the gateway's message (e.g. "wallet already linked to another account").
    if (axios.isAxiosError(err)) {
      const msg = (err.response?.data as { error?: string } | undefined)?.error;
      throw new Error(msg || "Failed to link wallet");
    }
    throw err;
  }
}

export async function linkWalletSolana(
  walletAddress: string,
  walletProvider: Provider
): Promise<LinkedWallet> {
  const { challengeId, message } = await fetchAuthChallenge(walletAddress, "sol");
  const encodedMessage = new TextEncoder().encode(message);
  const signature = await walletProvider.signMessage(encodedMessage);
  return completeWalletLink(
    challengeId,
    signatureBytesToHex(signature),
    walletAddress
  );
}

export async function linkWalletEvm(
  walletAddress: string,
  walletProvider: Eip1193Provider
): Promise<LinkedWallet> {
  const { challengeId, message } = await fetchAuthChallenge(walletAddress, "evm");
  const provider = new BrowserProvider(walletProvider);
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();
  if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new Error("Connected wallet address does not match the signer");
  }
  let signature = await signer.signMessage(message);
  if (signature.startsWith("0x")) signature = signature.slice(2);
  return completeWalletLink(challengeId, signature, walletAddress);
}

export async function authenticateEvm(
  walletAddress: string,
  walletProvider: Eip1193Provider,
  desktop = false
): Promise<AuthSession> {
  const { challengeId, message } = await fetchAuthChallenge(walletAddress, "evm");
  const provider = new BrowserProvider(walletProvider);
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();

  if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new Error("Connected wallet address does not match the signer");
  }

  let signature = await signer.signMessage(message);
  if (signature.startsWith("0x")) signature = signature.slice(2);

  return completeAuth(challengeId, signature, walletAddress, desktop);
}

/** Default desktop client deep-link callbacks. Expand as new clients are approved. */
export const DEFAULT_DESKTOP_AUTH_REDIRECT_URIS = [
  "erebrusai://auth",
  "erebrusdrop://auth",
  "erebrusvpn://auth",
];

/**
 * Allowed desktop app redirect URIs for /auth.
 * Override with NEXT_PUBLIC_ALLOWED_DESKTOP_AUTH_REDIRECT_URIS as a comma-separated list.
 */
export function getAllowedDesktopAuthRedirectUris(): string[] {
  const raw =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_ALLOWED_DESKTOP_AUTH_REDIRECT_URIS?.trim()
      : "";
  if (!raw) return DEFAULT_DESKTOP_AUTH_REDIRECT_URIS;
  return raw.split(",").map((u) => u.trim()).filter(Boolean);
}

/** Query params returned to the requesting app after a successful wallet sign-in. */
export const AUTH_CALLBACK_FIELDS = [
  {
    key: "token",
    label: "Session token",
    description:
      "A short-lived PASETO token your app uses to call the Erebrus gateway on your behalf.",
    sensitive: true,
  },
  {
    key: "user_id",
    label: "Account ID",
    description: "Your Erebrus user identifier tied to this wallet.",
    sensitive: false,
  },
  {
    key: "wallet",
    label: "Wallet address",
    description: "The public address of the wallet you connected and signed with.",
    sensitive: false,
  },
  {
    key: "role",
    label: "Account role",
    description: "Gateway role for this session (typically user).",
    sensitive: false,
  },
  {
    key: "state",
    label: "State nonce",
    description:
      "The same state value your app sent — used to match this response to the original request.",
    sensitive: false,
  },
] as const;

export function buildAuthCallbackUrl(
  redirectUri: string,
  params: Record<string, string>
): string {
  const uri = new URL(redirectUri);
  for (const [key, value] of Object.entries(params)) {
    uri.searchParams.set(key, value);
  }
  return uri.toString();
}
