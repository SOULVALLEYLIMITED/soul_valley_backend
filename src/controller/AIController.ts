// src/controller/AIController.ts

import {
  Controller,
  Post,
  Body,
  Route,
  SuccessResponse,
  Response,
  Tags,
  Get,
  Request,
  Res,
  TsoaResponse,
} from "tsoa";
import { AIService, AIResponse } from "../service/ai_service";
import { AI_CONFIG } from "../constants/aiConfig";
import { SOULY_SYSTEM_PROMPT, DISCOVERY_EXTRACTION_PROMPT } from "../constants/system_prompt";
import { ContactService } from "../service/contact_service";
import { ContactSource } from "@prisma/client";
import {
  ChatMessage,
  ChatResponse,
  ModelsResponse,
  HealthResponse,
  SubmitDiscoveryRequest,
  SubmitDiscoveryResponse,
  DiscoveryExtractionResponse,
} from "../types";

// Request interfaces
interface ChatRequest {
  messages: ChatMessage[];
}

interface StreamRequest {
  messages: ChatMessage[];
}

interface ExtractRequest {
  messages: ChatMessage[];
}

function validateMessages(messages: ChatMessage[] | undefined): string | null {
  if (!messages?.length) return "messages is required and cannot be empty";
  const last = messages[messages.length - 1];
  if (last.role !== "user" || !last.content?.trim()) {
    return "Last message must be a non-empty user message";
  }
  return null;
}

@Route("api/ai")
@Tags("AI")
export class AIController extends Controller {
  /**
   * Get AI response from Groq (non-streaming)
   */
  @Post("chat")
  @SuccessResponse(200, "AI response generated successfully")
  @Response(400, "Bad request - missing or invalid messages")
  @Response(500, "Internal server error")
  public async chat(@Body() request: ChatRequest): Promise<ChatResponse> {
    try {
      const validationError = validateMessages(request.messages);
      if (validationError) {
        this.setStatus(400);
        return { success: false, message: validationError, error: validationError };
      }

      const response: AIResponse = await AIService.getAIResponse(
        request.messages,
        SOULY_SYSTEM_PROMPT,
        AI_CONFIG.model,
        AI_CONFIG.temperature,
        AI_CONFIG.maxTokens
      );

      this.setStatus(200);
      return {
        success: true,
        message: "AI response generated successfully",
        data: {
          response: response.text,
          model: response.model,
          usage: response.usage,
        },
      };
    } catch (error: any) {
      console.error("Error in AI chat endpoint:", error);
      this.setStatus(500);
      return {
        success: false,
        message: "Failed to generate AI response",
        error: error.message || "Internal server error",
      };
    }
  }

  /**
   * Extract structured discovery data from the full conversation so far.
   * This runs as its own Groq call (JSON mode, separate from Souly's
   * persona) so the frontend never has to parse fields out of Souly's
   * visible reply — which by design never contains the raw JSON report.
   * The `ready_for_submission` flag is the frontend's signal to call
   * /api/ai/submit; it only becomes true once the user has explicitly
   * confirmed a summary Souly presented back to them.
   */
  @Post("extract")
  @SuccessResponse(200, "Discovery data extracted successfully")
  @Response(400, "Bad request - missing or invalid messages")
  @Response(500, "Internal server error")
  public async extract(@Body() request: ExtractRequest): Promise<DiscoveryExtractionResponse> {
    try {
      if (!request.messages?.length) {
        this.setStatus(400);
        return { success: false, error: "messages is required and cannot be empty" };
      }

      const data = await AIService.extractDiscoveryData(
        request.messages,
        DISCOVERY_EXTRACTION_PROMPT,
        AI_CONFIG.model
      );

      if (!data) {
        this.setStatus(500);
        return { success: false, error: "Failed to extract discovery data" };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Error in AI extract endpoint:", error);
      this.setStatus(500);
      return { success: false, error: error.message || "Internal server error" };
    }
  }

  /**
   * Get AI response with streaming support (Server-Sent Events)
   */
  @Post("chat/stream")
  @SuccessResponse(200, "AI stream started")
  @Response(400, "Bad request - missing or invalid messages")
  @Response(500, "Internal server error")
  public async chatStream(
    @Body() request: StreamRequest,
    @Request() req: any,
    @Res() res: TsoaResponse<200 | 400 | 500, any>
  ): Promise<void> {
    try {
      const validationError = validateMessages(request.messages);
      if (validationError) {
        res(400, { success: false, message: validationError, error: validationError });
        return;
      }

      const response = res as any;
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache, no-transform");
      response.setHeader("Connection", "keep-alive");
      response.setHeader("X-Accel-Buffering", "no");
      response.write(`data: ${JSON.stringify({ type: "connected", message: "Stream connected" })}\n\n`);

      await AIService.getAIResponseStream(
        request.messages,
        (chunk: string) => {
          response.write(`data: ${JSON.stringify({ content: chunk, isComplete: false })}\n\n`);
        },
        (completeText: string) => {
          response.write(`data: ${JSON.stringify({ content: completeText, isComplete: true })}\n\n`);
          response.write(`data: [DONE]\n\n`);
          response.end();
        },
        SOULY_SYSTEM_PROMPT,
        AI_CONFIG.model,
        AI_CONFIG.temperature,
        AI_CONFIG.maxTokens
      );
    } catch (error: any) {
      console.error("Error in AI stream endpoint:", error);
      try {
        const response = res as any;
        response.write(`data: ${JSON.stringify({ error: error.message || "Streaming error occurred" })}\n\n`);
        response.end();
      } catch (e) {
        (res as any).end();
      }
    }
  }

  /**
   * Called once the frontend has a confirmed discovery report. Creates a
   * contact record with source=ai_chat so it shows up in the same dashboard
   * as regular contact-form submissions, tagged distinctly.
   */
// src/controller/AIController.ts - Update the submitDiscovery method

@Post("submit")
@SuccessResponse(200, "Discovery submitted successfully")
@Response(400, "Bad request - missing name or email")
@Response(422, "Unprocessable entity - invalid data format")
@Response(500, "Internal server error")
public async submitDiscovery(@Body() request: SubmitDiscoveryRequest): Promise<SubmitDiscoveryResponse> {
  try {
    console.log("📥 Received submit request:", request);
    
    // ✅ Validate required fields
    if (!request.contact_name?.trim()) {
      this.setStatus(400);
      return {
        success: false,
        message: "Name is required",
        error: "Missing contact_name field",
      };
    }
    
    if (!request.email?.trim()) {
      this.setStatus(400);
      return {
        success: false,
        message: "Email is required",
        error: "Missing email field",
      };
    }

    // ✅ Ensure arrays are properly handled
    const targetUsers = Array.isArray(request.target_users) ? request.target_users : [];
    const requirements = Array.isArray(request.requirements) ? request.requirements : [];
    const existingSystems = Array.isArray(request.existing_systems) ? request.existing_systems : [];
    const constraints = Array.isArray(request.constraints) ? request.constraints : [];
    const openQuestions = Array.isArray(request.open_questions) ? request.open_questions : [];

    const subject = request.organization?.trim()
      ? `Discovery request — ${request.organization.trim()}`
      : "New discovery request from Souly";

    const message = request.problem?.trim() || request.idea?.trim() || "No summary provided.";

    // ✅ Create contact with proper data
    const contact = await ContactService.createContact({
      name: request.contact_name.trim(),
      email: request.email.trim(),
      subject,
      message,
      source: ContactSource.ai_chat,
      discoveryDetails: {
        organization: request.organization || "",
        problem: request.problem || "",
        idea: request.idea || "",
        current_process: request.current_process || "",
        target_users: targetUsers,
        desired_outcome: request.desired_outcome || "",
        requirements: requirements,
        existing_systems: existingSystems,
        constraints: constraints,
        timeline: request.timeline || "",
        budget: request.budget || "",
        open_questions: openQuestions,
        additional_context: request.additional_context || "",
        discovery_status: "ready_for_human_review"
      },
    });

    console.log("✅ Contact created successfully:", contact.id);

    this.setStatus(200);
    return {
      success: true,
      message: "Discovery submitted successfully",
    };
  } catch (error: any) {
    console.error("❌ Error submitting discovery:", error);
    this.setStatus(500);
    return {
      success: false,
      message: "Failed to submit discovery",
      error: error.message || "Internal server error",
    };
  }
}
  /**
   * Get available AI models
   */
  @Get("models")
  @SuccessResponse(200, "Models retrieved successfully")
  public async getModels(): Promise<ModelsResponse> {
    return {
      success: true,
      data: { models: AIService.getAvailableModels() },
    };
  }

  /**
   * Health check endpoint
   */
  @Get("health")
  @SuccessResponse(200, "API is healthy")
  public async health(): Promise<HealthResponse> {
    const health = await AIService.healthCheck();
    return {
      success: health.status === "healthy",
      status: health.status,
      message: health.message,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Simple ping endpoint for quick testing
   */
  @Get("ping")
  @SuccessResponse(200, "Pong")
  public async ping(): Promise<{ pong: string; timestamp: string }> {
    return {
      pong: "AI service is running",
      timestamp: new Date().toISOString(),
    };
  }
}