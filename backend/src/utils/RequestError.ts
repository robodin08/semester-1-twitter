import { STATUS_CODES } from "node:http";

import errorDefinitions, { type ErrorDefinition, type ErrorType } from "@/errorDefinitions";

class RequestError<T extends ErrorType = ErrorType> extends Error {
  status: number;
  type: T;
  description: string;

  constructor(type: T = "INTERNAL_SERVER_ERROR" as T, override?: Partial<ErrorDefinition<T>>) {
    const { message, status } = errorDefinitions[type];

    super(override?.message ?? message);
    this.name = "RequestError";

    this.type = type;
    this.status = override?.status ?? status;
    this.description = STATUS_CODES[this.status] ?? "Unknown Error";

    Object.setPrototypeOf(this, new.target.prototype); // Fix prototype chain
  }
}

export default RequestError;
