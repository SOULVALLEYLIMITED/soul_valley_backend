"use strict";
// src/controller/ContactController.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const tsoa_1 = require("tsoa");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const contact_service_1 = require("../service/contact_service");
const auth_1 = require("../utils/auth");
const JWT_SECRET = process.env.JWT_SECRET || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const TOKEN_EXPIRY = "12h";
let ContactController = class ContactController extends tsoa_1.Controller {
    /**
     * Public — submit the website's "Contact Us" form.
     */
    async create(request) {
        const name = request.name?.trim();
        const email = request.email?.trim();
        const subject = request.subject?.trim();
        const message = request.message?.trim();
        if (!name || !email || !subject || !message) {
            this.setStatus(400);
            return { success: false, error: "name, email, subject, and message are required" };
        }
        const contact = await contact_service_1.ContactService.createContact({ name, email, subject, message });
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
    async login(request) {
        if (!ADMIN_PASSWORD || !JWT_SECRET) {
            this.setStatus(500);
            return { success: false, error: "Server auth is not configured" };
        }
        if (request.password !== ADMIN_PASSWORD) {
            this.setStatus(401);
            return { success: false, error: "Incorrect password" };
        }
        const token = jsonwebtoken_1.default.sign({ role: "admin" }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
        return { success: true, token };
    }
    /**
     * Get all contacts (admin only)
     */
    async list(authorization) {
        const authError = (0, auth_1.requireAuth)(authorization);
        if (authError) {
            this.setStatus(401);
            return { success: false, error: authError };
        }
        const contacts = await contact_service_1.ContactService.listContacts();
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
    async updateStatus(id, request, authorization) {
        const authError = (0, auth_1.requireAuth)(authorization);
        if (authError) {
            this.setStatus(401);
            return { success: false, error: authError };
        }
        await contact_service_1.ContactService.updateStatus(id, request.status);
        return { success: true };
    }
    /**
     * Delete a contact (admin only)
     */
    async remove(id, authorization) {
        const authError = (0, auth_1.requireAuth)(authorization);
        if (authError) {
            this.setStatus(401);
            return { success: false, error: authError };
        }
        await contact_service_1.ContactService.deleteContact(id);
        return { success: true };
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, tsoa_1.Post)(),
    (0, tsoa_1.SuccessResponse)(201, "Contact created successfully"),
    (0, tsoa_1.Response)(400, "Missing required fields"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "create", null);
__decorate([
    (0, tsoa_1.Post)("login"),
    (0, tsoa_1.SuccessResponse)(200, "Logged in successfully"),
    (0, tsoa_1.Response)(401, "Incorrect password"),
    (0, tsoa_1.Response)(500, "Server auth not configured"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Get)(),
    (0, tsoa_1.SuccessResponse)(200, "Contacts retrieved successfully"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    __param(0, (0, tsoa_1.Header)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "list", null);
__decorate([
    (0, tsoa_1.Put)("{id}/status"),
    (0, tsoa_1.SuccessResponse)(200, "Status updated successfully"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(404, "Contact not found"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Header)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateStatus", null);
__decorate([
    (0, tsoa_1.Delete)("{id}"),
    (0, tsoa_1.SuccessResponse)(200, "Contact deleted successfully"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(404, "Contact not found"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Header)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "remove", null);
exports.ContactController = ContactController = __decorate([
    (0, tsoa_1.Route)("api/contacts"),
    (0, tsoa_1.Tags)("Contacts")
], ContactController);
