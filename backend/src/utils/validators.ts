import validator from "validator";
import zxcvbn from "zxcvbn";
import fs from "node:fs/promises";

import pwnedCount from "./pwnedPasswords";
import HttpError from "./HttpError";

// https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains_strict_mx.txt
const DISPOSABLE_FILE = "src/data/domains.txt";
let disposableSet: Set<string> | null = null;

export type IdentifierType = "email" | "username";

async function loadDisposableDomains(): Promise<void> {
  if (disposableSet) return;

  const text = await fs.readFile(DISPOSABLE_FILE, "utf-8");
  disposableSet = new Set(
    text
      .split(/\r?\n/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function validateUsername(username: string): string {
  const trimmed = username.trim();

  if (!validator.isLength(trimmed, { min: 3, max: 20 })) {
    throw new HttpError("Username must be between 3 and 20 characters.", 400);
  }

  if (validator.matches(trimmed, /^_|_$/)) {
    throw new HttpError("Username cannot start or end with underscore.", 400);
  }

  if (validator.matches(trimmed, /__/)) {
    throw new HttpError("Username cannot contain consecutive underscores.", 400);
  }

  if (!validator.matches(trimmed, /^[a-z0-9_]+$/)) {
    throw new HttpError(
      "Username can only contain lowercase letters (a-z), numbers (0-9), and underscores (_).",
      400,
    );
  }

  return trimmed;
}

export async function validatePassword(password: string): Promise<string> {
  const trimmed = password.trim();

  if (!validator.isLength(trimmed, { min: 8, max: 72 }))
    throw new HttpError("Password must be between 8 and 72 characters.", 400);

  if (!validator.matches(trimmed, /[A-Z]/))
    throw new HttpError("Password must contain at least one uppercase letter (A-Z).", 400);

  if (!validator.matches(trimmed, /[a-z]/))
    throw new HttpError("Password must contain at least one lowercase letter (a-z).", 400);

  if (!validator.matches(trimmed, /[0-9]/))
    throw new HttpError("Password must contain at least one number (0-9).", 400);

  if (!validator.matches(trimmed, /[!@#$%^&*]/))
    throw new HttpError("Password must contain at least one special character (!@#$%^&*).", 400);

  if (zxcvbn(trimmed).score < 2)
    throw new HttpError(`Password must have a zxcvbn score of at least 2`, 400);

  try {
    const isCommon = await pwnedCount(trimmed, { padding: true });
    if (isCommon > 0)
      throw new HttpError("This password is too common. Please choose a stronger one.", 400);
  } catch {
    // ignore pwned check errors
  }

  return trimmed;
}

export async function validateEmail(email: string): Promise<string> {
  const normalized = validator.normalizeEmail(email);
  if (!normalized) throw new HttpError("Invalid email syntax.", 400);

  const [local, domainRaw] = normalized.split("@");
  if (!local || !domainRaw) throw new HttpError("Invalid email.", 400);

  if (local.includes("+")) throw new HttpError("Plus (+) in email local part is not allowed.", 400);

  const domain = domainRaw.toLowerCase();

  await loadDisposableDomains();
  if (disposableSet?.has(domain)) throw new HttpError("Email is marked as disposable.", 400);

  return normalized;
}

export async function validateCreateUserInput(options: {
  username: string;
  password: string;
  email: string;
}): Promise<{ username: string; password: string; email: string }> {
  if (!options) throw new HttpError("Body is required.", 400);

  const { username, password, email } = options;

  if (!username) throw new HttpError("Username is required.", 400);
  if (!email) throw new HttpError("Email is required.", 400);
  if (!password) throw new HttpError("Password is required.", 400);

  const validUsername = validateUsername(username);
  const validPassword = await validatePassword(password);
  const validEmail = await validateEmail(email);

  return {
    username: validUsername,
    password: validPassword,
    email: validEmail,
  };
}

export async function validateLoginUserInput(options: {
  password: string;
  identifier: string;
}): Promise<{ type: IdentifierType; identifier: string; password: string }> {
  const { identifier, password } = options;
  if (!identifier) throw new HttpError("Username or email is required.", 400);
  if (!password) throw new HttpError("Password is required.", 400);

  const type = validator.isEmail(identifier) ? "email" : "username";

  return { type, identifier: identifier.trim(), password: password.trim() };
}
