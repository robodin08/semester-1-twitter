import { STATUS_CODES } from "node:http";
import errorDefinitions from "@/errorDefinitions";

export type ErrorDefinitions = typeof errorDefinitions;
export type ErrorType = keyof ErrorDefinitions;
export type ErrorDefinition = ErrorDefinitions[ErrorType];

type ExtractPlaceholders<S extends string> = S extends `${string}{${infer K}}${infer Rest}`
  ? K | ExtractPlaceholders<Rest>
  : never;

type PlaceholdersForError<T extends ErrorType> = {
  [K in ExtractPlaceholders<ErrorDefinitions[T]["message"]>]?: string | number;
};

type ErrorOptions<T extends ErrorType> = {
  message?: string;
  status?: number;
  placeholders?: PlaceholdersForError<T>;
};

class RequestError<T extends ErrorType = "INTERNAL_SERVER_ERROR"> extends Error {
  status: number;
  type: T;
  description: string;

  constructor(type: T = "INTERNAL_SERVER_ERROR" as T, options?: ErrorOptions<T>) {
    const { message: defaultMessage, status: defaultStatus } = errorDefinitions[type];

    let message: string = options?.message ?? defaultMessage;
    if (options?.placeholders) {
      for (const [key, value] of Object.entries(options.placeholders)) {
        const regex = new RegExp(`\\{${key}\\}`, "g");
        message = message.replace(regex, String(value));
      }
    }

    super(message);
    this.name = "RequestError";

    this.type = type;
    this.status = options?.status ?? defaultStatus;
    this.description = STATUS_CODES[this.status] ?? "Unknown Error";

    Object.setPrototypeOf(this, new.target.prototype); // Fix prototype chain
  }
}

export default RequestError;
