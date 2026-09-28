// service/contact_service.ts
import { prisma } from "../db/prisma";
import { Contact, ContactSource, ContactStatus, Prisma } from "@prisma/client";

export interface CreateContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: ContactSource;
  discoveryDetails?: Prisma.InputJsonValue | null;
}

export class ContactService {
  static async createContact(input: CreateContactInput): Promise<Contact> {
    return prisma.contact.create({
      data: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        source: input.source ?? ContactSource.contact_form,
        discoveryDetails: input.discoveryDetails ?? undefined,
      },
    });
  }

  static async listContacts(): Promise<Contact[]> {
    return prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async updateStatus(id: string, status: ContactStatus): Promise<Contact> {
    return prisma.contact.update({ where: { id }, data: { status } });
  }

  static async deleteContact(id: string): Promise<void> {
    await prisma.contact.delete({ where: { id } });
  }
}