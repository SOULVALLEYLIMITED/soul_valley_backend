"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
/** Returns an error message if the request isn't authorized as admin, or null if it's fine. */
function requireAuth(authHeader) {
    if (!JWT_SECRET)
        return "Server auth is not configured";
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token)
        return "Missing authorization token";
    try {
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return null;
    }
    catch {
        return "Invalid or expired token";
    }
}
