"use strict";
// src/controller/AIController.ts
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
exports.AIController = void 0;
const tsoa_1 = require("tsoa");
const ai_service_1 = require("../service/ai_service");
const aiConfig_1 = require("../constants/aiConfig");
const system_prompt_1 = require("../constants/system_prompt");
const contact_service_1 = require("../service/contact_service");
const client_1 = require("@prisma/client");
function validateMessages(messages) {
    if (!messages?.length)
        return "messages is required and cannot be empty";
    const last = messages[messages.length - 1];
    if (last.role !== "user" || !last.content?.trim()) {
        return "Last message must be a non-empty user message";
    }
    return null;
}
let AIController = class AIController extends tsoa_1.Controller {
    /**
     * Get AI response from Groq (non-streaming)
     */
    async chat(request) {
        try {
            const validationError = validateMessages(request.messages);
            if (validationError) {
                this.setStatus(400);
                return { success: false, message: validationError, error: validationError };
            }
            const response = await ai_service_1.AIService.getAIResponse(request.messages, system_prompt_1.SOULY_SYSTEM_PROMPT, aiConfig_1.AI_CONFIG.model, aiConfig_1.AI_CONFIG.temperature, aiConfig_1.AI_CONFIG.maxTokens);
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
        }
        catch (error) {
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
    async extract(request) {
        try {
            if (!request.messages?.length) {
                this.setStatus(400);
                return { success: false, error: "messages is required and cannot be empty" };
            }
            const data = await ai_service_1.AIService.extractDiscoveryData(request.messages, system_prompt_1.DISCOVERY_EXTRACTION_PROMPT, aiConfig_1.AI_CONFIG.model);
            if (!data) {
                this.setStatus(500);
                return { success: false, error: "Failed to extract discovery data" };
            }
            return { success: true, data };
        }
        catch (error) {
            console.error("Error in AI extract endpoint:", error);
            this.setStatus(500);
            return { success: false, error: error.message || "Internal server error" };
        }
    }
    /**
     * Get AI response with streaming support (Server-Sent Events)
     */
    async chatStream(request, req, res) {
        try {
            const validationError = validateMessages(request.messages);
            if (validationError) {
                res(400, { success: false, message: validationError, error: validationError });
                return;
            }
            const response = res;
            response.setHeader("Content-Type", "text/event-stream");
            response.setHeader("Cache-Control", "no-cache, no-transform");
            response.setHeader("Connection", "keep-alive");
            response.setHeader("X-Accel-Buffering", "no");
            response.write(`data: ${JSON.stringify({ type: "connected", message: "Stream connected" })}\n\n`);
            await ai_service_1.AIService.getAIResponseStream(request.messages, (chunk) => {
                response.write(`data: ${JSON.stringify({ content: chunk, isComplete: false })}\n\n`);
            }, (completeText) => {
                response.write(`data: ${JSON.stringify({ content: completeText, isComplete: true })}\n\n`);
                response.write(`data: [DONE]\n\n`);
                response.end();
            }, system_prompt_1.SOULY_SYSTEM_PROMPT, aiConfig_1.AI_CONFIG.model, aiConfig_1.AI_CONFIG.temperature, aiConfig_1.AI_CONFIG.maxTokens);
        }
        catch (error) {
            console.error("Error in AI stream endpoint:", error);
            try {
                const response = res;
                response.write(`data: ${JSON.stringify({ error: error.message || "Streaming error occurred" })}\n\n`);
                response.end();
            }
            catch (e) {
                res.end();
            }
        }
    }
    /**
     * Called once the frontend has a confirmed discovery report. Creates a
     * contact record with source=ai_chat so it shows up in the same dashboard
     * as regular contact-form submissions, tagged distinctly.
     */
    // src/controller/AIController.ts - Update the submitDiscovery method
    async submitDiscovery(request) {
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
            const contact = await contact_service_1.ContactService.createContact({
                name: request.contact_name.trim(),
                email: request.email.trim(),
                subject,
                message,
                source: client_1.ContactSource.ai_chat,
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
        }
        catch (error) {
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
    async getModels() {
        return {
            success: true,
            data: { models: ai_service_1.AIService.getAvailableModels() },
        };
    }
    /**
     * Health check endpoint
     */
    async health() {
        const health = await ai_service_1.AIService.healthCheck();
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
    async ping() {
        return {
            pong: "AI service is running",
            timestamp: new Date().toISOString(),
        };
    }
};
exports.AIController = AIController;
__decorate([
    (0, tsoa_1.Post)("chat"),
    (0, tsoa_1.SuccessResponse)(200, "AI response generated successfully"),
    (0, tsoa_1.Response)(400, "Bad request - missing or invalid messages"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "chat", null);
__decorate([
    (0, tsoa_1.Post)("extract"),
    (0, tsoa_1.SuccessResponse)(200, "Discovery data extracted successfully"),
    (0, tsoa_1.Response)(400, "Bad request - missing or invalid messages"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "extract", null);
__decorate([
    (0, tsoa_1.Post)("chat/stream"),
    (0, tsoa_1.SuccessResponse)(200, "AI stream started"),
    (0, tsoa_1.Response)(400, "Bad request - missing or invalid messages"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "chatStream", null);
__decorate([
    (0, tsoa_1.Post)("submit"),
    (0, tsoa_1.SuccessResponse)(200, "Discovery submitted successfully"),
    (0, tsoa_1.Response)(400, "Bad request - missing name or email"),
    (0, tsoa_1.Response)(422, "Unprocessable entity - invalid data format"),
    (0, tsoa_1.Response)(500, "Internal server error"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "submitDiscovery", null);
__decorate([
    (0, tsoa_1.Get)("models"),
    (0, tsoa_1.SuccessResponse)(200, "Models retrieved successfully"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIController.prototype, "getModels", null);
__decorate([
    (0, tsoa_1.Get)("health"),
    (0, tsoa_1.SuccessResponse)(200, "API is healthy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIController.prototype, "health", null);
__decorate([
    (0, tsoa_1.Get)("ping"),
    (0, tsoa_1.SuccessResponse)(200, "Pong"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIController.prototype, "ping", null);
exports.AIController = AIController = __decorate([
    (0, tsoa_1.Route)("api/ai"),
    (0, tsoa_1.Tags)("AI")
], AIController);
