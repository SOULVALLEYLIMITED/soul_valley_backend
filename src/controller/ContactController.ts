import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Patch,
  Post,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import { prisma } from "../db/prisma";
import { ApiError } from "../utils/ApiError";

export interface ContactCreateRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactStatusUpdateRequest {
  /** One of: new | read | replied */
  status: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

@Route("contacts")
@Tags("Contacts")
export class ContactController extends Controller {
  /**
   * Public endpoint used by the website contact form.
   * Stores a new contact message.
   */
  @Post("/")
  @SuccessResponse(201, "Created")
  public async createContact(
    @Body() body: ContactCreateRequest
  ): Promise<Contact> {
    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!name || !email || !subject || !message) {
      throw new ApiError(400, "All fields (name, email, subject, message) are required.");
    }

    const created = await prisma.contact.create({
      data: { name, email, subject, message },
    });

    this.setStatus(201);
    return this.serialize(created);
  }

  /**
   * List all contact messages, newest first. Requires admin auth.
   */
  @Get("/")
  @Security("jwt")
  public async listContacts(): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return contacts.map((c) => this.serialize(c));
  }

  /**
   * Update the status of a contact (new | read | replied). Requires admin auth.
   */
  @Patch("{id}")
  @Security("jwt")
  public async updateStatus(
    @Path() id: string,
    @Body() body: ContactStatusUpdateRequest
  ): Promise<Contact> {
    const allowed = ["new", "read", "replied"];
    if (!allowed.includes(body.status)) {
      throw new ApiError(400, "status must be one of: new, read, replied");
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: { status: body.status },
    });
    return this.serialize(updated);
  }

  /**
   * Delete a contact message. Requires admin auth.
   */
  @Delete("{id}")
  @Security("jwt")
  public async deleteContact(@Path() id: string): Promise<{ success: boolean }> {
    await prisma.contact.delete({ where: { id } });
    return { success: true };
  }

  private serialize(c: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
  }): Contact {
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      subject: c.subject,
      message: c.message,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
    };
  }
}
