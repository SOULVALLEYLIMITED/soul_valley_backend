// service/community_service.ts
import { prisma } from "../db/prisma";
import { CommunityUpdate } from "@prisma/client";

export interface CreateCommunityUpdateInput {
  title: string;
  body: string;
  imageUrl?: string | null;
}

export interface UpdateCommunityUpdateInput {
  title?: string;
  body?: string;
  imageUrl?: string | null;
}

export class CommunityService {
  static async createUpdate(input: CreateCommunityUpdateInput): Promise<CommunityUpdate> {
    return prisma.communityUpdate.create({
      data: {
        title: input.title,
        body: input.body,
        imageUrl: input.imageUrl ?? undefined,
      },
    });
  }

  static async listUpdates(): Promise<CommunityUpdate[]> {
    return prisma.communityUpdate.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async updateUpdate(
    id: string,
    input: UpdateCommunityUpdateInput
  ): Promise<CommunityUpdate> {
    return prisma.communityUpdate.update({
      where: { id },
      data: {
        title: input.title,
        body: input.body,
        imageUrl: input.imageUrl,
      },
    });
  }

  static async deleteUpdate(id: string): Promise<void> {
    await prisma.communityUpdate.delete({ where: { id } });
  }
}
