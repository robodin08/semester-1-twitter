import type { FindOneOptions } from "typeorm";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type core from "express-serve-static-core";

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

export default function isAuthenticated(options?: FindOneOptions<User>): RequestHandler {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new RequestError("MISSING_AUTH_HEADER");

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") throw new RequestError("INVALID_AUTH_FORMAT");

    const accessToken = parts[1];
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
