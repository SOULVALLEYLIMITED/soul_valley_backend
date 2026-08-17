import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret";

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const token = request.headers["authorization"]?.split(" ")[1]; // Expects "Bearer <token>"

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new ApiError(401, "No token provided"));
        return;
      }

      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          reject(new ApiError(401, "Invalid or expired token"));
        } else {
          // Check scopes/permissions here if needed
          resolve(decoded);
        }
      });
    });
  }

  return Promise.reject(new ApiError(401, "Unsupported security scheme"));
}