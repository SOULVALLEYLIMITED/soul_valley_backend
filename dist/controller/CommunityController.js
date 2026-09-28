"use strict";
// src/controller/CommunityController.ts
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
exports.CommunityController = void 0;
const tsoa_1 = require("tsoa");
const community_service_1 = require("../service/community_service");
const auth_1 = require("../utils/auth");
const cloudinary_1 = require("../utils/cloudinary");
function serialize(u) {
    return {
        id: u.id,
        title: u.title,
        body: u.body,
        imageUrl: u.imageUrl,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
    };
}
let CommunityController = class CommunityController extends tsoa_1.Controller {
    /**
     * Public — list community updates for the site's community page, newest first.
     */
    async list() {
        const updates = await community_service_1.CommunityService.listUpdates();
        return { success: true, data: updates.map(serialize) };
    }
    /**
     * Create a community update (admin only).
     */
    async create(body, authorization) {
        const authError = (0, auth_1.requireAuth)(authorization);
        if (authError) {
            this.setStatus(401);
            return { success: false, error: authError };
        }
        if (!body.title?.trim() || !body.body?.trim()) {
            this.setStatus(400);
            return { success: false, error: "title and body are required" };
        }
        const update = await community_service_1.CommunityService.createUpdate({
            title: body.title.trim(),
            body: body.body.trim(),
            imageUrl: body.imageUrl?.trim() || null,
        });
        return { success: true, data: serialize(update) };
    }
    /**
     * Edit a community update (admin only).
     */
    async edit(id, body, authorization) {
        const authError = (0, auth_1.requireAuth)(authorization);
        if (authError) {
            this.setStatus(401);
            return { success: false, error: authError };
        }
        const update = await community_service_1.CommunityService.updateUpdate(id, body);
        return { success: true, data: serialize(update) };
    }
    /**
     * Delete a community update (admin only).
     */
    async remove(id, authorization) {
        const authError = (0, auth_1.requireAuth)(authorization);
        if (authError) {
            this.setStatus(401);
            return { success: false, error: authError };
        }
        await community_service_1.CommunityService.deleteUpdate(id);
        return { success: true };
    }
    /**
     * Upload an image to Cloudinary (admin only). Returns the hosted URL to
     * use as a community update's imageUrl.
     */
    async uploadImage(image, authorization) {
        const authError = (0, auth_1.requireAuth)(authorization);
        if (authError) {
            this.setStatus(401);
            return { success: false, error: authError };
        }
        if (!image) {
            this.setStatus(400);
            return { success: false, error: "No file provided" };
        }
        try {
            const url = await (0, cloudinary_1.uploadImageBuffer)(image.buffer);
            return { success: true, url };
        }
        catch (error) {
            this.setStatus(500);
            return { success: false, error: error.message || "Upload failed" };
        }
    }
};
exports.CommunityController = CommunityController;
__decorate([
    (0, tsoa_1.Get)("updates"),
    (0, tsoa_1.SuccessResponse)(200, "Updates retrieved successfully"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "list", null);
__decorate([
    (0, tsoa_1.Post)("updates"),
    (0, tsoa_1.SuccessResponse)(200, "Update created successfully"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(400, "Missing required fields"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "create", null);
__decorate([
    (0, tsoa_1.Patch)("updates/{id}"),
    (0, tsoa_1.SuccessResponse)(200, "Update edited successfully"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Header)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "edit", null);
__decorate([
    (0, tsoa_1.Delete)("updates/{id}"),
    (0, tsoa_1.SuccessResponse)(200, "Update deleted successfully"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Header)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "remove", null);
__decorate([
    (0, tsoa_1.Post)("upload-image"),
    (0, tsoa_1.SuccessResponse)(200, "Image uploaded successfully"),
    (0, tsoa_1.Response)(401, "Unauthorized"),
    (0, tsoa_1.Response)(400, "No file provided"),
    __param(0, (0, tsoa_1.UploadedFile)()),
    __param(1, (0, tsoa_1.Header)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "uploadImage", null);
exports.CommunityController = CommunityController = __decorate([
    (0, tsoa_1.Route)("api/community"),
    (0, tsoa_1.Tags)("Community")
], CommunityController);
