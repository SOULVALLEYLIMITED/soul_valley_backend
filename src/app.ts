import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";

export const app = express();   

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
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
      details: err.message,
    });
  }
  
  return next();
});