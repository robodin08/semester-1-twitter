/**
 * Modernization by AI
 *
 * A wrapper for PwnedPasswords API by Troy Hunt (haveibeenpwned.com).
 * @module pwnedpasswords
 *
 * Official API: https://haveibeenpwned.com/API/v3#PwnedPasswords
 */

import crypto from "node:crypto";

const API_URL = "https://api.pwnedpasswords.com/range/";
const PREFIX_LENGTH = 5;
const API_TIMEOUT = 3000;

function sha1(password: string): string {
  return crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
}

async function fetchRange(prefix: string, options: { padding?: boolean } = {}): Promise<string> {
  const { padding = true } = options;
  const url = API_URL + prefix;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  const headers: HeadersInit = {
    Accept: "text/plain",
  };
  if (padding) headers["Add-Padding"] = "true";

  console.log(headers);

  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    if (res.status === 404) return "";

    if (!res.ok) {
      throw new Error(`PwnedPasswords API error: ${res.status}`);
    }
    return await res.text();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("PwnedPasswords API timeout");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function pwnedCount(password: string, options: { padding?: boolean } = {}): Promise<number> {
  if (typeof password !== "string" || !password.trim()) {
    throw new Error("Password must be a non-empty string.");
  }

  const hash = sha1(password);
  const prefix = hash.substring(0, PREFIX_LENGTH);
  const suffix = hash.substring(PREFIX_LENGTH);

  const response = await fetchRange(prefix, options);
  const found = response
    .split("\n")
    .map((line) => line.split(":"))
    .find(([hashSuffix]) => hashSuffix?.toUpperCase() === suffix);

  return found ? Number(found[1]) : 0;
}
