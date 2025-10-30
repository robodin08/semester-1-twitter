import { rateLimit, type RateLimitRequestHandler, type Options } from "express-rate-limit";

import RequestError from "@utils/RequestError";
import type { UserRequest } from "./authMiddleware.ts";
import type { NextFunction, Response } from "express";

function defaultKeyGenerator(req: UserRequest, authenticated = false): string {
  if (authenticated && req.user?.id) return `user:${req.user.id}`;
  return `ip:${req.ip || "unknown"}`;
}

function defaultHandler(req: UserRequest, res: Response, next: NextFunction, options: Options): void {
  const retryAfter = Math.ceil(options.windowMs / 1000);
  res.setHeader("Retry-After", retryAfter);
  throw new RequestError("RATE_LIMIT_EXCEEDED");
}

export default function createLimiter(
  limit: number,
  windowMs = 60 * 1000,
  authenticated = false,
): RateLimitRequestHandler {
  const limiter = rateLimit({
    limit,
    windowMs,

    keyGenerator: (req) => defaultKeyGenerator(req, authenticated),
    handler: defaultHandler,

    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
  });

  return limiter;
}
