import type { NextFunction, Response } from "express";
import type { UserRequest } from "./authMiddleware.ts";
import { requestLogRepository } from "@datasource";

export default function requestLogger(req: UserRequest, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      await requestLogRepository.save({
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        errorType: res.locals.errorType ?? null,
        user: req.user ?? null,
        responseTime: Date.now() - start,
      });
    } catch (err) {
      console.error("Failed to log request:", err);
    }
  });

  next();
}
