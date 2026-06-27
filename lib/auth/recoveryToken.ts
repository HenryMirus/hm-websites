import { createHmac, timingSafeEqual, randomBytes } from "crypto";

function secret(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  return key;
}

/**
 * Creates a signed, expiring recovery token tied to a specific user ID.
 * Format: `userId.nonce.exp.sig` (base64url-encoded)
 */
export function createRecoveryToken(userId: string): string {
  const nonce = randomBytes(16).toString("hex");
  const exp = Math.floor(Date.now() / 1000) + 15 * 60; // 15 min
  const payload = `${userId}.${nonce}.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

/**
 * Verifies the token and returns true only if:
 * - HMAC signature is valid
 * - Token has not expired
 * - Token is bound to the expected userId
 */
export function verifyRecoveryToken(token: string, expectedUserId: string): boolean {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    // Format: userId.nonce.exp.sig — userId may contain hyphens but not dots
    const dotIdx = [0, 0, 0];
    let count = 0;
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === "." && count < 3) {
        dotIdx[count++] = i;
      }
    }
    if (count !== 3) return false;

    const userId = raw.slice(0, dotIdx[0]);
    const exp = parseInt(raw.slice(dotIdx[1] + 1, dotIdx[2]), 10);
    const sig = raw.slice(dotIdx[2] + 1);
    const payload = raw.slice(0, dotIdx[2]);

    if (userId !== expectedUserId) return false;
    if (isNaN(exp) || Math.floor(Date.now() / 1000) > exp) return false;

    const expected = createHmac("sha256", secret()).update(payload).digest("hex");
    const aBuf = Buffer.from(sig, "hex");
    const bBuf = Buffer.from(expected, "hex");
    if (aBuf.length !== bBuf.length) return false;

    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}
