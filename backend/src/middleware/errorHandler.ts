import type { NextFunction, Response, Request } from "express";

import RequestError from "@RequestError";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new RequestError("PAGE_NOT_FOUND"));
}

export function errorHandler(
  err: RequestError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!(err instanceof RequestError)) {
    err = new RequestError("INTERNAL_SERVER_ERROR");
  }

  if (err instanceof RequestError) {
    res.status(err.status).json({
      success: false,
      status: err.status,
      description: err.description,
      message: err.message,
      type: err.type,
    });
  }
}
