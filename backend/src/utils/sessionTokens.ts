import jwt, { type JwtPayload, type SignOptions, type VerifyOptions } from "jsonwebtoken";
import crypto from "node:crypto";
import ms from "ms";

import { sessionRepository } from "../database/datasource.ts";
import HttpError from "./HttpError";
import config from "../config.ts";

const ACCESS_SECRET = config.session.jwtSecret;
const REFRESH_SECRET = config.session.jwtRefreshSecret;

const ACCESS_TTL = config.session.accessTokenTTL;
const REFRESH_TTL = config.session.refreshTokenTTL;

const ISSUER = "twitter-mini";

interface TokenPayload extends JwtPayload {
  id: number;
}

function generateToken(payload: TokenPayload, secret: string, options?: SignOptions): string {
  return jwt.sign(payload, secret, { issuer: ISSUER, ...options });
}

function hashString(string: string) {
  return crypto.createHash("sha256").update(string).digest("hex");
}

function verifyToken(token: string, secret: string, options?: VerifyOptions): TokenPayload {
  try {
    const decoded = jwt.verify(token, secret, {
      issuer: ISSUER,
      ...options,
    }) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyAccessToken(accessToken: string): TokenPayload {
  return verifyToken(accessToken, ACCESS_SECRET);
}

export async function generateTokens(userId: number): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const accessToken = generateToken({ id: userId }, ACCESS_SECRET, {
    expiresIn: ACCESS_TTL,
  });

  const refreshToken = generateToken({ id: userId }, REFRESH_SECRET, {
    expiresIn: REFRESH_TTL,
  });

  const hashedToken = hashString(refreshToken);

  await sessionRepository.save({
    refreshToken: hashedToken,
    user: { id: userId },
    lastRefreshed: new Date(),
  });

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const payload = verifyToken(refreshToken, REFRESH_SECRET);
  if (!payload) throw new HttpError("Invalid refresh token.", 401);

  const hashedToken = hashString(refreshToken);

  const token = await sessionRepository.findOne({
    where: {
      refreshToken: hashedToken,
      user: { id: payload.id },
      revoked: false,
    },
    select: {
      id: true,
      lastRefreshed: true,
      createdAt: true,
    },
  });

  if (!token) throw new HttpError("Invalid or revoked refresh token.", 401);

  const createdAtTime = token.createdAt.getTime();
  const refreshTTLms = ms(REFRESH_TTL);
  const expireAt = createdAtTime + refreshTTLms;

  if (Date.now() > expireAt) {
    token.revoked = true;
    token.revokedAt = new Date();
    await sessionRepository.save(token);
    throw new HttpError("Refresh token is expired.", 401);
  }

  const lastRefreshedTime = token.lastRefreshed.getTime();
  const earliestNextRefresh = Date.now() - ms(ACCESS_TTL);

  if (lastRefreshedTime > earliestNextRefresh) {
    throw new HttpError("Cannot generate a new token until the old one is expired.", 429);
  }

  token.lastRefreshed = new Date();
  await sessionRepository.save(token);

  const accessToken = generateToken({ id: payload.id }, ACCESS_SECRET, {
    expiresIn: ACCESS_TTL,
  });

  return accessToken;
}

export async function revokeRefreshToken(userId: number, refreshToken: string) {
  const payload = verifyToken(refreshToken, REFRESH_SECRET);
  if (!payload || userId !== payload.id) {
    throw new HttpError("Invalid refresh token.", 401);
  }

  const hashedToken = hashString(refreshToken);

  const token = await sessionRepository.findOne({
    where: {
      refreshToken: hashedToken,
      user: { id: payload.id },
      revoked: false,
    },
    select: { id: true, createdAt: true },
  });

  if (!token) return;

  const expireAt = token.createdAt.getTime() + ms(REFRESH_TTL);
  if (Date.now() > expireAt) return;

  token.revoked = true;
  token.revokedAt = new Date();
  await sessionRepository.save(token);
}
