"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
// service/contact_service.ts
const prisma_1 = require("../db/prisma");
const client_1 = require("@prisma/client");
class ContactService {
    static async createContact(input) {
        return prisma_1.prisma.contact.create({
            data: {
                name: input.name,
                email: input.email,
                subject: input.subject,
                message: input.message,
                source: input.source ?? client_1.ContactSource.contact_form,
                discoveryDetails: input.discoveryDetails ?? undefined,
            },
        });
    }
    static async listContacts() {
        return prisma_1.prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
    }
    static async updateStatus(id, status) {
        return prisma_1.prisma.contact.update({ where: { id }, data: { status } });
    }
    static async deleteContact(id) {
        await prisma_1.prisma.contact.delete({ where: { id } });
    }
}
exports.ContactService = ContactService;
