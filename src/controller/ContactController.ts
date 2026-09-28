// src/controller/ContactController.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Path,
  Body,
  Route,
  Tags,
  Header,
  Response,
  SuccessResponse,
} from "tsoa";
import jwt from "jsonwebtoken";
import { ContactService } from "../service/contact_service";
import { ContactStatus } from "@prisma/client";
import { requireAuth } from "../utils/auth";
import {
  LoginRequest,
  LoginResponse,
  ContactResponse,
  UpdateContactStatusRequest,
  SimpleResponse,
  ContactsListResponse, // ✅ Import from types
} from "../types";

export interface CreateContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CreateContactResponse {
  success: boolean;
  data?: ContactResponse;
  error?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const TOKEN_EXPIRY = "12h";

@Route("api/contacts")
@Tags("Contacts")
export class ContactController extends Controller {
  /**
   * Public — submit the website's "Contact Us" form.
   */
  @Post()
  @SuccessResponse(201, "Contact created successfully")
  @Response(400, "Missing required fields")
  public async create(@Body() request: CreateContactRequest): Promise<CreateContactResponse> {
    const name = request.name?.trim();
    const email = request.email?.trim();
    const subject = request.subject?.trim();
    const message = request.message?.trim();

    if (!name || !email || !subject || !message) {
      this.setStatus(400);
      return { success: false, error: "name, email, subject, and message are required" };
    }

    const contact = await ContactService.createContact({ name, email, subject, message });

    this.setStatus(201);
    return {
      success: true,
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        source: contact.source,
        discoveryDetails: contact.discoveryDetails,
        createdAt: contact.createdAt.toISOString(),
        updatedAt: contact.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Admin login - get JWT token
   */
  @Post("login")
  @SuccessResponse(200, "Logged in successfully")
  @Response(401, "Incorrect password")
  @Response(500, "Server auth not configured")
  public async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    if (!ADMIN_PASSWORD || !JWT_SECRET) {
      this.setStatus(500);
      return { success: false, error: "Server auth is not configured" };
    }

    if (request.password !== ADMIN_PASSWORD) {
      this.setStatus(401);
      return { success: false, error: "Incorrect password" };
    }

    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    return { success: true, token };
  }

  /**
   * Get all contacts (admin only)
   */
  @Get()
  @SuccessResponse(200, "Contacts retrieved successfully")
  @Response(401, "Unauthorized")
  public async list(
    @Header("Authorization") authorization?: string
  ): Promise<ContactsListResponse> {
    const authError = requireAuth(authorization);
    if (authError) {
      this.setStatus(401);
      return { success: false, error: authError };
    }

    const contacts = await ContactService.listContacts();
    return {
      success: true,
      data: contacts.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        subject: c.subject,
        message: c.message,
        status: c.status,
        source: c.source,
        discoveryDetails: c.discoveryDetails,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    };
  }

  /**
   * Update contact status (admin only)
   */
  @Put("{id}/status")
  @SuccessResponse(200, "Status updated successfully")
  @Response(401, "Unauthorized")
  @Response(404, "Contact not found")
  public async updateStatus(
    @Path() id: string,
    @Body() request: UpdateContactStatusRequest,
    @Header("Authorization") authorization?: string
  ): Promise<SimpleResponse> {
    const authError = requireAuth(authorization);
    if (authError) {
      this.setStatus(401);
      return { success: false, error: authError };
    }

    await ContactService.updateStatus(id, request.status as ContactStatus);
    return { success: true };
  }

  /**
   * Delete a contact (admin only)
   */
  @Delete("{id}")
  @SuccessResponse(200, "Contact deleted successfully")
  @Response(401, "Unauthorized")
  @Response(404, "Contact not found")
  public async remove(
    @Path() id: string,
    @Header("Authorization") authorization?: string
  ): Promise<SimpleResponse> {
    const authError = requireAuth(authorization);
    if (authError) {
      this.setStatus(401);
      return { success: false, error: authError };
    }

    await ContactService.deleteContact(id);
    return { success: true };
  }
}