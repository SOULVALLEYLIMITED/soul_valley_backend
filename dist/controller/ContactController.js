"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const tsoa_1 = require("tsoa");
const prisma_1 = require("../db/prisma");
const ApiError_1 = require("../utils/ApiError");
let ContactController = class ContactController extends tsoa_1.Controller {
    /**
     * Public endpoint used by the website contact form.
     * Stores a new contact message.
     */
    async createContact(body) {
        const name = body.name?.trim();
        const email = body.email?.trim();
        const subject = body.subject?.trim();
        const message = body.message?.trim();
        if (!name || !email || !subject || !message) {
            throw new ApiError_1.ApiError(400, "All fields (name, email, subject, message) are required.");
        }
        const created = await prisma_1.prisma.contact.create({
            data: { name, email, subject, message },
        });
        this.setStatus(201);
        return this.serialize(created);
    }
    /**
     * List all contact messages, newest first. Requires admin auth.
     */
    async listContacts() {
        const contacts = await prisma_1.prisma.contact.findMany({
            orderBy: { createdAt: "desc" },
        });
        return contacts.map((c) => this.serialize(c));
    }
    /**
     * Update the status of a contact (new | read | replied). Requires admin auth.
     */
    async updateStatus(id, body) {
        const allowed = ["new", "read", "replied"];
        if (!allowed.includes(body.status)) {
            throw new ApiError_1.ApiError(400, "status must be one of: new, read, replied");
        }
        const updated = await prisma_1.prisma.contact.update({
            where: { id },
            data: { status: body.status },
        });
        return this.serialize(updated);
    }
    /**
     * Delete a contact message. Requires admin auth.
     */
    async deleteContact(id) {
        await prisma_1.prisma.contact.delete({ where: { id } });
        return { success: true };
    }
    serialize(c) {
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
};
exports.ContactController = ContactController;
__decorate([
    (0, tsoa_1.Post)("/"),
    (0, tsoa_1.SuccessResponse)(201, "Created"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "createContact", null);
__decorate([
    (0, tsoa_1.Get)("/"),
    (0, tsoa_1.Security)("jwt"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "listContacts", null);
__decorate([
    (0, tsoa_1.Patch)("{id}"),
    (0, tsoa_1.Security)("jwt"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateStatus", null);
__decorate([
    (0, tsoa_1.Delete)("{id}"),
    (0, tsoa_1.Security)("jwt"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "deleteContact", null);
exports.ContactController = ContactController = __decorate([
    (0, tsoa_1.Route)("contacts"),
    (0, tsoa_1.Tags)("Contacts")
], ContactController);
