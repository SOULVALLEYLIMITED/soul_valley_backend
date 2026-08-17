/**
 * Error type that carries an HTTP status code, so the global error handler
 * can respond with the right status instead of defaulting to 500.
 */
export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
