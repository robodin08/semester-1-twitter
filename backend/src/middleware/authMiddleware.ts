import type { NextFunction, Request, RequestHandler, Response } from "express";

import RequestError from "../utils//RequestError";
import { verifyAccessToken } from "../utils/sessionTokens";
import { User, userRepository } from "../database/datasource";
import type { FindOneOptions } from "typeorm";

export interface UserRequest<
  // P = {},
  // ResBody = {},
  ReqBody = any,
  // ReqQuery = {}
> extends Request<{}, {}, ReqBody, {}> {
  user: User;
}

export default function isLoggedIn(options?: FindOneOptions<User>): RequestHandler {
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
        where: { ...(options.where || {}), id: payload.id },
        select: { ...(options.select || {}), id: true },
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
