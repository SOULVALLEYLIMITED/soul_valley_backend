import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./generated/routes";
import { ApiError } from "./utils/ApiError";

export const app = express();

// CORS — allow the website + dashboard to call the API.
// Set CORS_ORIGINS in the environment as a comma-separated list of allowed
// origins (e.g. "https://soulvalley.tech,https://www.soulvalley.tech").
// If unset, all origins are allowed (convenient for local development).
const corsOrigins = process.env.CORS_ORIGINS?.split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
  })
);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Swagger UI documentation
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("./generated/swagger.json"))
  );
});

// Register tsoa generated routes
RegisterRoutes(app);

// Global Error Handler for tsoa validation or generic errors
app.use(function errorHandler(
  err: any,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  // tsoa request-body / query validation errors
  if (err instanceof ValidateError) {
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
    if (Array.isArray((err as any).errors)) {
      console.error(
        "Nested errors:",
        (err as any).errors.map((e: any) => e?.message || e)
      );
    }
    if ((err as any).cause) {
      console.error("Cause:", (err as any).cause);
    }

    return res.status(500).json({
      message: "Internal Server Error",
      details: err.message,
      code: (err as any).code,
      name: err.name,
      cause: (err as any).cause?.message || (err as any).cause,
      nested: Array.isArray((err as any).errors)
        ? (err as any).errors.map((e: any) => e?.message || String(e))
        : undefined,
    });
  }

  return next();
});