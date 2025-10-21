import { STATUS_CODES } from "node:http";
import config from "../config";

type ErrorType = keyof typeof config.errorMessages;

export function statusToDescription(status: number) {
  return STATUS_CODES[status] ?? "Unknown Error";
}

class RequestError extends Error {
  status: number;
  type: ErrorType;
  description: string;

  constructor(type: ErrorType = "INTERNAL_SERVER_ERROR", statusOverride?: number) {
    const { message, status } =
      config.errorMessages[type] || config.errorMessages.INTERNAL_SERVER_ERROR;
    super(message);
    this.name = "RequestError";

    this.type = type;
    this.status = statusOverride ?? status;
    this.description = statusToDescription(this.status);

    Object.setPrototypeOf(this, new.target.prototype); // Prototype chain
  }
}

export default RequestError;
