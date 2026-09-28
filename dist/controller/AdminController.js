"use strict";
// src/controller/AdminController.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const tsoa_1 = require("tsoa");
let AdminController = class AdminController extends tsoa_1.Controller {
    /**
     * Test endpoint for admin dashboard
     */
    async test() {
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
    async getPing() {
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
    async getStats() {
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
    async getContacts() {
        // This is a placeholder - you can implement actual contact fetching
        return {
            success: true,
            data: [],
        };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, tsoa_1.Get)("test"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "test", null);
__decorate([
    (0, tsoa_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPing", null);
__decorate([
    (0, tsoa_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, tsoa_1.Get)("contacts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getContacts", null);
exports.AdminController = AdminController = __decorate([
    (0, tsoa_1.Route)("api/admin"),
    (0, tsoa_1.Tags)("Admin")
], AdminController);
