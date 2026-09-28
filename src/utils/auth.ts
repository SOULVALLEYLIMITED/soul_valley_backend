import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

/** Returns an error message if the request isn't authorized as admin, or null if it's fine. */
export function requireAuth(authHeader: string | undefined): string | null {
  if (!JWT_SECRET) return "Server auth is not configured";
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) return "Missing authorization token";
  try {
    jwt.verify(token, JWT_SECRET);
    return null;
  } catch {
    return "Invalid or expired token";
  }
}
