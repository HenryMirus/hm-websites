import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export function isWebhookAuthorized(request: NextRequest): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;

  const authBuf = Buffer.from(auth);
  const expectedBuf = Buffer.from(expected);
  if (authBuf.length !== expectedBuf.length) return false;

  return timingSafeEqual(authBuf, expectedBuf);
}
