"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Error type that carries an HTTP status code, so the global error handler
 * can respond with the right status instead of defaulting to 500.
 */
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}
exports.ApiError = ApiError;
