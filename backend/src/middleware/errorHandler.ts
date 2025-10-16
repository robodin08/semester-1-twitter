import type { NextFunction, Response, Request } from "express";

import HttpError from "../utils/HttpError";
import { ZodError } from "zod";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new HttpError("Page not found", 404));
}

export function errorHandler(
  err: ZodError | HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    res.status(500).json({
      success: false,
      status: 500,
      message: `${err.issues[0].path}: ${err.issues[0].message}`,
    });
  } else if (err instanceof HttpError) {
    res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message,
    });
  }
}
