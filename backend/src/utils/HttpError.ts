class HttpError extends Error {
  status: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status ?? 500;
    this.name = "HttpError";
  }
}

export default HttpError;
