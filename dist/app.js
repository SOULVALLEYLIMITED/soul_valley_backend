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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const tsoa_1 = require("tsoa");
const routes_1 = require("./generated/routes");
exports.app = (0, express_1.default)();
// CORS — allow the website + dashboard to call the API.
// Set CORS_ORIGINS in the environment as a comma-separated list of allowed
// origins (e.g. "https://soulvalley.tech,https://www.soulvalley.tech").
// If unset, all origins are allowed (convenient for local development).
const corsOrigins = process.env.CORS_ORIGINS?.split(",")
    .map((o) => o.trim())
    .filter(Boolean);
exports.app.use((0, cors_1.default)({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
}));
// Middleware to parse JSON bodies
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// Serve Swagger UI documentation
exports.app.use("/docs", swagger_ui_express_1.default.serve, async (_req, res) => {
    return res.send(swagger_ui_express_1.default.generateHTML(await Promise.resolve().then(() => __importStar(require("./generated/swagger.json")))));
});
// Register tsoa generated routes
(0, routes_1.RegisterRoutes)(exports.app);
// Global Error Handler for tsoa validation or generic errors
exports.app.use(function errorHandler(err, req, res, next) {
    // tsoa request-body / query validation errors
    if (err instanceof tsoa_1.ValidateError) {
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    // Errors that explicitly carry an HTTP status (ApiError, auth failures, etc.)
    if (err && typeof err.status === "number") {
        return res.status(err.status).json({
            message: err.message || "Request failed",
        });
    }
    if (err instanceof Error) {
        // Log the full error server-side — Prisma driver-adapter errors (e.g.
        // Node's AggregateError from a failed multi-address connection attempt)
        // often have an empty top-level .message, so the client-facing
        // "details" can look blank even though the real cause is available here.
        console.error("Unhandled error:", err);
        if (Array.isArray(err.errors)) {
            console.error("Nested errors:", err.errors.map((e) => e?.message || e));
        }
        if (err.cause) {
            console.error("Cause:", err.cause);
        }
        return res.status(500).json({
            message: "Internal Server Error",
            details: err.message,
            code: err.code,
            name: err.name,
            cause: err.cause?.message || err.cause,
            nested: Array.isArray(err.errors)
                ? err.errors.map((e) => e?.message || String(e))
                : undefined,
        });
    }
    return next();
});
