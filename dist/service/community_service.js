"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityService = void 0;
// service/community_service.ts
const prisma_1 = require("../db/prisma");
class CommunityService {
    static async createUpdate(input) {
        return prisma_1.prisma.communityUpdate.create({
            data: {
                title: input.title,
                body: input.body,
                imageUrl: input.imageUrl ?? undefined,
            },
        });
    }
    static async listUpdates() {
        return prisma_1.prisma.communityUpdate.findMany({ orderBy: { createdAt: "desc" } });
    }
    static async updateUpdate(id, input) {
        return prisma_1.prisma.communityUpdate.update({
            where: { id },
            data: {
                title: input.title,
                body: input.body,
                imageUrl: input.imageUrl,
            },
        });
    }
    static async deleteUpdate(id) {
        await prisma_1.prisma.communityUpdate.delete({ where: { id } });
    }
}
exports.CommunityService = CommunityService;
