# Persistent web login sessions

The webapp is a Next.js 16 Node deployment (`output: standalone`). Static hosting
cannot run this integration. Deploy the Node server plus a durable PostgreSQL
database before rolling out the client changes.

## Hosting requirements

1. Provision PostgreSQL with durable disks, backups, TLS for remote connections,
   and a private network. Run `scripts/session-store.sql` once with a migration
   role. Give the app role SELECT, INSERT and UPDATE on `erebrus_web_sessions`.
   Run the SQL file's expiry cleanup with a maintenance role periodically.
2. Configure **runtime** environment values on every Node instance:
   - `SESSION_DATABASE_URL`: direct PostgreSQL or a **session-pooling** endpoint.
     PgBouncer transaction/statement pooling is unsupported because the lock
     belongs to a dedicated connection, spanning several autocommit writes.
   - `SESSION_ENCRYPTION_KEY`: one shared base64-encoded 32-byte random key
     (`openssl rand -base64 32`). Preserve across deployments/restarts. Losing or
     replacing it makes existing sessions unreadable. Key rotation needs an
     explicit decrypt/re-encrypt migration; do not rotate independently per worker.
   - `APP_ORIGIN`: canonical public HTTPS origin, e.g. `https://erebrus.io`.
     Redirect alternate hosts to this origin. Do not use request-controlled
     forwarded headers to choose the trusted origin.
   - `GATEWAY_URL`: optional server gateway base; the public gateway setting is
     the fallback. Gateway credentials are never environment/client config.
3. Both deployment compose files now load a host-side `.env.session`. Create it
   with permissions 600 **before** deploying; it is not copied by CI. Do not put
   these private runtime values into PROD_ENV_FILE/DEV_ENV_FILE (those are copied
   into image build layers). `.dockerignore` excludes `.env.session` variants.
4. Terminate HTTPS at the reverse proxy. The `__Host-erebrus_session` cookie is
   always Secure, HttpOnly, Path=/, SameSite=Lax, with Expires derived from
   returned gateway refresh expiry. Use HTTPS locally too (Chromium's localhost
   secure-cookie exception is sufficient for the test suite). Never disable
   Secure to support a non-local HTTP deployment.
5. Allow writable private temporary disk for upload replay; size it for concurrent
   Drop uploads. `BFF_MAX_BODY_BYTES` defaults to 1 GiB per request. Bodies are
   spooled with directory mode 700/file mode 600, then deleted in a finally block.
   A worker crash can leave a spool directory; clean `erebrus-body-*` directories
   at boot/with an age-based maintenance task when no worker is using them.
   Ingress upload limits, Node request duration and platform temporary disk must
   accommodate the same files. Spooling means upload progress measures browser
   to BFF transfer; gateway forwarding starts once the spool is complete.
6. Keep the DB available while requests are active. The per-instance pool has
   at most 10 connections. Session lock acquisition is bounded at 15 seconds;
   busy requests get 503/Retry-After: 1. Refresh HTTP calls time out at 20 seconds.
   Do not log request/response bodies, Cookie/Set-Cookie, Authorization, or session
   row payloads in proxies, APM or analytics. The application emits only safe
   error codes, not credential-bearing exception objects.

There is deliberately no in-memory or browser-storage credential fallback.
Database records use SHA-256 cookie-identifier keys and AES-256-GCM encryption
with the cookie identifier as authenticated associated data. A cookie contains
only 32 random bytes encoded as hex, never gateway credentials.

## Request lifecycle

Wallet challenge/signature, email code, Google and Apple login continue through
`/api/gateway`. Successful login responses are captured by the server and replaced
with an allowlisted identity/expiry response. `/api/session` restores this identity
on load, browser restart, focus and reconnect, independently of wallet connection.
The old fixed 12-hour client timer and wallet-disconnection cookie cleanup are gone.
Normal gateway/Drop clients use same-origin cookies, including XHR uploads. Profile
image uploads also verify the server session. Public discovery requests can opt
out of session refresh. The independent Drop Kubo WebUI capability flow is unchanged.

All mutations, including login, legacy migration and logout, require an exact
Origin match and `X-Erebrus-CSRF: 1`. This non-simple header, absent CORS permission,
blocks third-party forms/fetches; Sec-Fetch-Site also rejects cross-site reads.
GET routes have no state-changing application actions except session maintenance.
Never add permissive CORS to these routes.

Before a protected call the server refreshes if access expires in <=60 seconds.
An ACCESS_TOKEN_EXPIRED 401 refreshes/retries exactly once, using the exact original
body and idempotency headers. A waiting request compares its rejected access token
with the durable replacement and reuses it. There is no JWT parsing: PASETO tokens
are opaque. Both server and cookie expiry move to the new refresh expiry.

A dedicated PostgreSQL connection holds an advisory lock during refresh, upgrade
or logout. The refresh-in-progress marker **commits before HTTP dispatch**. The
complete rotated credentials then commit atomically before releasing the lock.
A lost response, malformed success, 5xx, ambiguous business error, worker death, or
failed replacement write leaves an uncertain/in-progress session. Identity remains
restorable, but the potentially consumed refresh token is **never retried**. Access
can still be used while valid. After it expires, a new sign-in is needed because
the gateway provides no rotation recovery endpoint. A definitive 429 can be tried
again only after the returned Retry-After date/delay (60 seconds if absent).

Only REFRESH_TOKEN_INVALID, REFRESH_TOKEN_REUSED and SESSION_REVOKED clear auth on
upstream errors. Local refresh expiry/missing session also means SESSION_REVOKED.
Ordinary 401/403/business errors, 429, 5xx, network errors and store errors preserve
identity. `/api/session` reports metadata with a warning during refresh outages.
Terminal errors notify the browser clients via X-Erebrus-Session-Ended; tabs sync
identity changes via BroadcastChannel, containing no credentials.

Legacy cookie credentials are read **server-side** on the first restore and sent
once to `POST auth/session` under a deterministic migration lock. Successful
migration deletes old cookies. Modern-without-refresh (409), expired legacy access
(401), and ambiguous upgrade outcomes need a fresh login; the client cannot recover
missing refresh credentials. A durable attempt marker prevents loops across tabs.

Logout waits for refresh under the same lock, commits local revocation, then sends
the latest refresh token to the gateway. A revoked tombstone prevents delayed
responses/cookies from reactivating a login. The browser also invalidates outstanding
restores. It stores only a non-secret logout-intent marker in localStorage to prevent
an offline logout from silently becoming a restored session on reload/reconnect;
a new successful login clears that flag. If the BFF cannot be reached, its HttpOnly
cookie cannot be cleared client-side: the UI explicitly reports sign-out as
unconfirmed and retries on focus/reconnect. If local revocation succeeds but remote
revocation cannot be confirmed, the UI reports that distinction. Repeating logout
never incorrectly upgrades an unconfirmed remote result to confirmed.

## Desktop compatibility exception

At the user's explicit request, `/auth` retains the existing native-app access-token
handoff, token display/copy and callback URL contract. Those login requests opt in
with X-Erebrus-Desktop-Auth and return **only the access token** plus identity. They
never return refresh credentials or replace/revoke the existing web login. The
native refresh credential is held encrypted server-side until expiry; the current
native callback protocol has no refresh retrieval/exchange. Normal browser logins
never opt in. Moving native apps to persistent refresh requires a coordinated
native-client/gateway handoff protocol change; it is outside this web session change.

## Validation

- `pnpm test`: session state-machine, API boundary, replay, credential encryption,
  browser metadata races, and existing product tests.
- `pnpm type-check`, `pnpm lint`, `pnpm build`.
- `pnpm test:session-e2e`: starts a disposable **real PostgreSQL**, two separate
  Next.js Node workers and a deterministic local gateway fixture, then drives a
  persistent Chromium profile through restart, 25-hour return (backdated server
  metadata), concurrent tabs/workers, rotation/retry, outages, legacy upgrade,
  logout during refresh, CSRF, and the native access export. No production wallets
  or gateway credentials are used. Requires a non-root OS user, available ports
  15543–15546 and Chrome, or `PLAYWRIGHT_CHANNEL=chromium` after
  `pnpm exec playwright install chromium`. PostgreSQL's architecture-specific
  package postinstall must be permitted (listed in onlyBuiltDependencies).

The e2e harness deletes its temporary database and browser profile. Isolated Next
build caches `.next-session-e2e-*` are ignored and may be deleted after the run.
