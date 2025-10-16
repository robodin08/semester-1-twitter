import type { NextFunction, Request, RequestHandler, Response } from "express";

import HttpError from "../utils/HttpError";
import { verifyAccessToken } from "../utils/sessionTokens";
import { User, userRepository } from "../database/datasource";
import type { FindOneOptions } from "typeorm";

export interface UserRequest extends Request {
  user: User;
}

export default function isLoggedIn(options?: FindOneOptions<User>): RequestHandler {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new HttpError("Unauthorized: missing authorization header", 401);

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new HttpError("Invalid authorization header format", 400);
    }

    const accessToken = parts[1];
    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new HttpError("Access token expired or invalid", 401);

    if (options) {
      const user = await userRepository.findOne({
        ...options,
        where: { ...(options.where || {}), id: payload.id },
        select: { ...(options.select || {}), id: true },
      });

      if (!user) throw new HttpError("Unauthorized: user not found", 401);

      req.user = user;
    } else {
      const exists = await userRepository.exists({ where: { id: payload.id } });
      if (!exists) throw new HttpError("Unauthorized: user not found", 401);

      req.user = { id: payload.id } as User;
    }

    next();
  };
}

// export default async function isLoggedIn(
//   req: UserRequest,
//   res: Response,
//   next: NextFunction,
// ) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) throw new HttpError("Unauthorized", 401);

//   const [bearer, token] = authHeader.split(" ");
//   if (bearer !== "Bearer") throw new HttpError("Invalid header");

//   const userId = verifyAccessToken(token);
//   if (userId === null)
//     throw new HttpError("Refresh token expired or invalid.", 401);

//   req.userId = userId;

//   next();
// }
