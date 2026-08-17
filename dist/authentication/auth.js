"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
const jwt = __importStar(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret";
function expressAuthentication(request, securityName, scopes) {
    if (securityName === "jwt") {
        const token = request.headers["authorization"]?.split(" ")[1]; // Expects "Bearer <token>"
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new ApiError_1.ApiError(401, "No token provided"));
                return;
            }
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(new ApiError_1.ApiError(401, "Invalid or expired token"));
                }
                else {
                    // Check scopes/permissions here if needed
                    resolve(decoded);
                }
            });
        });
    }
    return Promise.reject(new ApiError_1.ApiError(401, "Unsupported security scheme"));
}
