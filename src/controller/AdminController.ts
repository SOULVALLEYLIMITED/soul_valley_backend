// src/controller/AdminController.ts

import { Controller, Get, Route, Tags } from "tsoa";
import {
  ChatResponse,
  ModelsResponse,
  HealthResponse,
  ContactResponse,
  SimpleResponse,
  ContactsListResponse, // ✅ Import from types
} from "../types";

@Route("api/admin")
@Tags("Admin")
export class AdminController extends Controller {
  /**
   * Test endpoint for admin dashboard
   */
  @Get("test")
  public async test(): Promise<ChatResponse> {
    return {
      success: true,
      message: "Admin test endpoint working",
      data: {
        response: "Admin dashboard is operational",
        model: "admin-test",
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      },
    };
  }

  /**
   * Get admin dashboard status
   */
  @Get("status")
  public async getPing(): Promise<{
    success: boolean;
    status: string;
    timestamp: string;
    environment: string;
  }> {
    return {
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };
  }

  /**
   * Get admin statistics summary
   */
  @Get("stats")
  public async getStats(): Promise<{
    success: boolean;
    data: {
      totalContacts: number;
      newContacts: number;
      readContacts: number;
      repliedContacts: number;
    };
  }> {
    return {
      success: true,
      data: {
        totalContacts: 0,
        newContacts: 0,
        readContacts: 0,
        repliedContacts: 0,
      },
    };
  }

  /**
   * Get contacts list (admin only)
   */
  @Get("contacts")
  public async getContacts(): Promise<ContactsListResponse> {
    // This is a placeholder - you can implement actual contact fetching
    return {
      success: true,
      data: [],
    };
  }
}