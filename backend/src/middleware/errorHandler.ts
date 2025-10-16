import type { NextFunction, Response, Request } from "express";

import HttpError from "../utils/HttpError";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new HttpError("Page not found", 404));
}

export function errorHandler(
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err.message || "Internal server error.";
  console.error(err);

  res.status(status).json({
    success: false,
    status,
    message: message,
  });
}
