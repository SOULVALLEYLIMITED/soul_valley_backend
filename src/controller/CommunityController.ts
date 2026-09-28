// src/controller/CommunityController.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Path,
  Post,
  Response,
  Route,
  SuccessResponse,
  Tags,
  UploadedFile,
} from "tsoa";
import { CommunityService } from "../service/community_service";
import { requireAuth } from "../utils/auth";
import { uploadImageBuffer } from "../utils/cloudinary";
import {
  CommunityUpdateResponse,
  CommunityUpdatesListResponse,
  CreateCommunityUpdateRequest,
  SimpleResponse,
  UpdateCommunityUpdateRequest,
  UploadImageResponse,
} from "../types";

function serialize(u: {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): CommunityUpdateResponse {
  return {
    id: u.id,
    title: u.title,
    body: u.body,
    imageUrl: u.imageUrl,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

@Route("api/community")
@Tags("Community")
export class CommunityController extends Controller {
  /**
   * Public — list community updates for the site's community page, newest first.
   */
  @Get("updates")
  @SuccessResponse(200, "Updates retrieved successfully")
  public async list(): Promise<CommunityUpdatesListResponse> {
    const updates = await CommunityService.listUpdates();
    return { success: true, data: updates.map(serialize) };
  }

  /**
   * Create a community update (admin only).
   */
  @Post("updates")
  @SuccessResponse(200, "Update created successfully")
  @Response(401, "Unauthorized")
  @Response(400, "Missing required fields")
  public async create(
    @Body() body: CreateCommunityUpdateRequest,
    @Header("Authorization") authorization?: string
  ): Promise<{ success: boolean; data?: CommunityUpdateResponse; error?: string }> {
    const authError = requireAuth(authorization);
    if (authError) {
      this.setStatus(401);
      return { success: false, error: authError };
    }

    if (!body.title?.trim() || !body.body?.trim()) {
      this.setStatus(400);
      return { success: false, error: "title and body are required" };
    }

    const update = await CommunityService.createUpdate({
      title: body.title.trim(),
      body: body.body.trim(),
      imageUrl: body.imageUrl?.trim() || null,
    });

    return { success: true, data: serialize(update) };
  }

  /**
   * Edit a community update (admin only).
   */
  @Patch("updates/{id}")
  @SuccessResponse(200, "Update edited successfully")
  @Response(401, "Unauthorized")
  public async edit(
    @Path() id: string,
    @Body() body: UpdateCommunityUpdateRequest,
    @Header("Authorization") authorization?: string
  ): Promise<{ success: boolean; data?: CommunityUpdateResponse; error?: string }> {
    const authError = requireAuth(authorization);
    if (authError) {
      this.setStatus(401);
      return { success: false, error: authError };
    }

    const update = await CommunityService.updateUpdate(id, body);
    return { success: true, data: serialize(update) };
  }

  /**
   * Delete a community update (admin only).
   */
  @Delete("updates/{id}")
  @SuccessResponse(200, "Update deleted successfully")
  @Response(401, "Unauthorized")
  public async remove(
    @Path() id: string,
    @Header("Authorization") authorization?: string
  ): Promise<SimpleResponse> {
    const authError = requireAuth(authorization);
    if (authError) {
      this.setStatus(401);
      return { success: false, error: authError };
    }

    await CommunityService.deleteUpdate(id);
    return { success: true };
  }

  /**
   * Upload an image to Cloudinary (admin only). Returns the hosted URL to
   * use as a community update's imageUrl.
   */
  @Post("upload-image")
  @SuccessResponse(200, "Image uploaded successfully")
  @Response(401, "Unauthorized")
  @Response(400, "No file provided")
  public async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Header("Authorization") authorization?: string
  ): Promise<UploadImageResponse> {
    const authError = requireAuth(authorization);
    if (authError) {
      this.setStatus(401);
      return { success: false, error: authError };
    }

    if (!image) {
      this.setStatus(400);
      return { success: false, error: "No file provided" };
    }

    try {
      const url = await uploadImageBuffer(image.buffer);
      return { success: true, url };
    } catch (error: any) {
      this.setStatus(500);
      return { success: false, error: error.message || "Upload failed" };
    }
  }
}
