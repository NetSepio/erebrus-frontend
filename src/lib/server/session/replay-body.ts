import { mkdtemp, chmod, rm } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { SessionError } from "./types";

/** Spool uploads to private temporary disk so a single expiry retry preserves
 * bytes without buffering large Drop files in RAM or teeing unread streams. */
export async function replayBody(request: Request) {
  if (!request.body) return { open: () => undefined, dispose: async () => {} };
  const directory = await mkdtemp(join(tmpdir(), "erebrus-body-"));
  await chmod(directory, 0o700);
  const file = join(directory, "body");
  let bytes = 0;
  const limit = Number(process.env.BFF_MAX_BODY_BYTES ?? 1073741824);
  try {
    await pipeline(Readable.fromWeb(request.body as Parameters<typeof Readable.fromWeb>[0]), new Transform({
      transform(chunk, _encoding, callback) {
        bytes += chunk.length;
        callback(bytes > limit ? new SessionError("REQUEST_BODY_TOO_LARGE", 413) : null, chunk);
      },
    }), createWriteStream(file, { mode: 0o600 }));
  } catch (error) { await rm(directory, { recursive: true, force: true }); throw error; }
  return { open: () => createReadStream(file) as unknown as BodyInit, dispose: () => rm(directory, { recursive: true, force: true }) };
}
