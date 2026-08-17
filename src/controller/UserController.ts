import { Body, Controller, Get, Post, Route, Tags } from "tsoa";
import * as jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret";

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Route("auth")
@Tags("Auth")
export class UserController extends Controller {
  @Get("/")
  public async GetStatus(): Promise<string> {
    return "Ok";
  }

  /**
   * Admin login for the dashboard. Exchanges the admin password for a JWT.
   */
  @Post("login")
  public async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new ApiError(500, "ADMIN_PASSWORD is not configured on the server.");
    }

    if (!body.password || body.password !== adminPassword) {
      throw new ApiError(401, "Invalid password");
    }

    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    return { token };
  }
}
