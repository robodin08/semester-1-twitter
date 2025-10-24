import validator from "validator";
import zxcvbn from "zxcvbn";
import fs from "node:fs/promises";

import pwnedCount from "@utils/pwnedPasswords";
import RequestError from "@RequestError";

const DISPOSABLE_FILE = "src/data/domains.txt";
let disposableSet: Set<string> | null = null;

async function loadDisposableDomains(): Promise<void> {
  if (disposableSet) return;

  const text = await fs.readFile(DISPOSABLE_FILE, "utf-8");
  disposableSet = new Set(
    text
      .split(/\r?\n/)
      .slice(2)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function validateUsername(username: string) {
  const isValid =
    validator.isLength(username, { min: 3, max: 20 }) &&
    !validator.matches(username, /^_|_$/) &&
    !validator.matches(username, /__/) &&
    validator.matches(username, /^[a-z0-9_]+$/);

  if (!isValid) throw new RequestError("INVALID_USERNAME");
}

export async function validatePassword(password: string) {
  const isValid =
    validator.isLength(password, { min: 8, max: 72 }) &&
    validator.matches(password, /[A-Z]/) &&
    validator.matches(password, /[a-z]/) &&
    validator.matches(password, /[0-9]/) &&
    validator.matches(password, /[!@#$%^&*]/);

  if (!isValid)
    throw new RequestError("INVALID_PASSWORD", {
      placeholders: {
        reason: "It must include upper and lowercase letters, numbers, and special characters.",
      },
    });

  const score = zxcvbn(password).score;
  if (score < 2) throw new RequestError("WEAK_PASSWORD");

  try {
    const isCommon = await pwnedCount(password, { padding: true });
    if (isCommon > 0) throw new RequestError("UNSAFE_PASSWORD");
  } catch {
    // Ignore errors in pwned API
  }
}

export async function validateEmail(email: string) {
  const [local, domainRaw] = email.split("@");
  const domain = domainRaw?.toLowerCase();

  const isValid = validator.isEmail(email) && !local.includes("+");

  if (!isValid) throw new RequestError("INVALID_EMAIL");

  await loadDisposableDomains();
  if (disposableSet?.has(domain)) {
    throw new RequestError("UNSAFE_EMAIL");
  }
}
