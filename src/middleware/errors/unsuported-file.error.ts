export class UnsupportedMediaTypeError extends Error {
  public status: number;

  constructor(message?: string) {
    super(message || "Unsupported Media Type");
    this.name = "UnsupportedMediaTypeError";
    this.status = 415;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnsupportedMediaTypeError);
    }
  }
}
