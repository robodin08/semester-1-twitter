import type { FindOneOptions } from "typeorm";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type core from "express-serve-static-core";
import { z } from "zod";

import { verifyAccessToken } from "@utils/sessionTokens";
import { User, userRepository } from "@datasource";
import RequestError from "@RequestError";

export interface UserRequest<
  // Params = core.ParamsDictionary,
  // ResBody = any,
  ReqBody = any,
  // ReqQuery = core.Query,
  // Locals extends Record<string, any> = Record<string, any>,
> extends Request<core.ParamsDictionary, any, ReqBody, core.Query> {
  user?: User;
}

const headerSchema = z.object({
  authorization: z
    .string()
    .trim()
    .nonempty("Authorization header is required")
    .refine((val) => /^Bearer\s+[\w-]+\.[\w-]+\.[\w-]+$/.test(val), { error: "Invalid Bearer token format" })
    .transform((val) => val.split(" ")[1]),
});

function validateAuthHeader(authorization: any, next: NextFunction): string | void {
  try {
    const parsed = headerSchema.parse({ authorization });
    return parsed.authorization;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.issues.map((issue) => {
        const path = issue.path.length ? issue.path.join(".") : "input";
        return `${path}: ${issue.message}`;
      });

      next(new RequestError("INVALID_VALIDATION", { message: messages.join("; ") }));
    } else {
      next(err);
    }
  }
}

export default function isAuthenticated(options?: FindOneOptions<User>): RequestHandler {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    const accessToken = validateAuthHeader(req.headers.authorization, next);
    if (!accessToken) return;

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new RequestError("INVALID_ACCESS_TOKEN");

    if (options) {
      const user = await userRepository.findOne({
        ...options,
        where: { id: payload.id, ...(options.where || {}) },
        select: { id: true, ...(options.select || {}) },
      });

      if (!user) throw new RequestError("USER_NOT_FOUND");

      req.user = user;
    } else {
      const exists = await userRepository.exists({ where: { id: payload.id } });
      if (!exists) throw new RequestError("USER_NOT_FOUND");

      req.user = { id: payload.id } as User;
    }

    next();
  };
}
