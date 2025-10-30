import { type Request, type Response, type NextFunction } from "express";

import config from "@config";

import RequestError from "@utils/RequestError";

export default function devOnly(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "";
  const allowedIps = ["127.0.0.1", "::1"];

  if (!config.isDevelopment || !allowedIps.includes(ip)) {
    throw new RequestError("DEV_ONLY_ACCESS");
  }

  next();
}
