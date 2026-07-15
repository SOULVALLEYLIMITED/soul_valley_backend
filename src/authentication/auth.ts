import { Request } from "express";
import * as jwt from "jsonwebtoken";

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
        reject(new Error("No token provided"));
      }
      
      jwt.verify(token!, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          // Check scopes/permissions here if needed
          resolve(decoded);
        }
      });
    });
  }
  
  return Promise.reject(new Error("Unsupported security scheme"));
}