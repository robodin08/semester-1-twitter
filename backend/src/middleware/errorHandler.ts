import type { NextFunction, Response, Request } from "express";
import { ZodError } from "zod";

import RequestError, { statusToDescription } from "../utils/RequestError";
import config from "../config";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new RequestError("PAGE_NOT_FOUND"));
}

export function errorHandler(
  err: ZodError | RequestError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "input";
      return `${path}: ${issue.message}`;
    });

    res.status(500).json({
      success: false,
      status: 400,
      description: statusToDescription(500),
      message: messages.join("; "),
      type: "VALIDATION_ERROR",
    });
  } else if (err instanceof RequestError) {
    res.status(err.status).json({
      success: false,
      status: err.status,
      description: err.description,
      message: err.message,
      type: err.type,
    });
  } else {
    const { message, status } = config.errorMessages.INTERNAL_SERVER_ERROR;
    res.status(500).json({
      success: false,
      status: status,
      description: statusToDescription(500),
      message: message,
      type: "INTERNAL_SERVER_ERROR",
    });
  }
}
