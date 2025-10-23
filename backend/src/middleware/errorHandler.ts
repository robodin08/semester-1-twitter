import type { NextFunction, Response, Request } from "express";

import RequestError from "@RequestError";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new RequestError("PAGE_NOT_FOUND"));
}

export function errorHandler(err: RequestError, req: Request, res: Response, next: NextFunction) {
  if (!(err instanceof RequestError)) {
    err = new RequestError("INTERNAL_SERVER_ERROR");
  }

  const { status, description, message, type } = err;

  res.status(status).json({
    success: false,
    status,
    description,
    message,
    type,
  });
}
