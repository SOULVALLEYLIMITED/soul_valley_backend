"use strict";
// src/service/ai_service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
class AIService {
    /**
     * Get AI response from Groq (non-streaming)
     */
    static async getAIResponse(messages, systemPrompt = "You are a helpful AI assistant.", model = "llama-3.1-70b-versatile", temperature = 0.7, maxTokens = 1024) {
        try {
            if (!this.API_KEY) {
                throw new Error("GROQ_API_KEY is not set in environment variables");
            }
            // Build messages array with system prompt
            const apiMessages = [
                { role: "system", content: systemPrompt },
                ...messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
            ];
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.API_KEY}`,
                },
                body: JSON.stringify({
                    model: model,
                    messages: apiMessages,
                    temperature: temperature,
                    max_tokens: maxTokens,
                    top_p: 0.9,
                    stream: false,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
                text: data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.",
                model: data.model || model,
                usage: data.usage
                    ? {
                        promptTokens: data.usage.prompt_tokens,
                        completionTokens: data.usage.completion_tokens,
                        totalTokens: data.usage.total_tokens,
                    }
                    : undefined,
            };
        }
        catch (error) {
            console.error("Error calling Groq API:", error);
            throw error;
        }
    }
    /**
     * Get AI response from Groq with streaming
     */
    static async getAIResponseStream(messages, onChunk, onComplete, systemPrompt = "You are a helpful AI assistant.", model = "llama-3.1-70b-versatile", temperature = 0.7, maxTokens = 1024) {
        try {
            if (!this.API_KEY) {
                throw new Error("GROQ_API_KEY is not set in environment variables");
            }
            const apiMessages = [
                { role: "system", content: systemPrompt },
                ...messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
            ];
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.API_KEY}`,
                },
                body: JSON.stringify({
                    model: model,
                    messages: apiMessages,
                    temperature: temperature,
                    max_tokens: maxTokens,
                    top_p: 0.9,
                    stream: true,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) {
                throw new Error("Failed to get response stream");
            }
            let fullText = "";
            let buffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") {
                            onComplete(fullText);
                            continue;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                fullText += content;
                                onChunk(content);
                            }
                        }
                        catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
            if (fullText) {
                onComplete(fullText);
            }
        }
        catch (error) {
            console.error("Error streaming Groq API:", error);
            throw error;
        }
    }
    /**
     * Run a dedicated extraction pass over the full conversation transcript,
     * using Groq's JSON mode with a data-extraction-only system prompt (never
     * the Souly persona). This is the source of truth for whether/when to
     * submit a discovery report — see constants/system_prompt.ts for why this
     * can't just be parsed out of Souly's visible reply.
     */
    static async extractDiscoveryData(messages, extractionPrompt, model = "openai/gpt-oss-120b") {
        if (!this.API_KEY) {
            throw new Error("GROQ_API_KEY is not set in environment variables");
        }
        const transcript = messages
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n");
        const response = await fetch(this.API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.API_KEY}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: extractionPrompt },
                    { role: "user", content: transcript },
                ],
                temperature: 0,
                max_tokens: 1024,
                response_format: { type: "json_object" },
                stream: false,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content;
        if (!raw)
            return null;
        try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    /**
     * Get available models
     */
    static getAvailableModels() {
        return [
            {
                id: "llama-3.1-70b-versatile",
                name: "Llama 3.1 70B",
                description: "Latest Llama model - best quality and reasoning",
            },
            {
                id: "llama3-70b-8192",
                name: "Llama 3 70B",
                description: "High-quality responses with deep reasoning",
            },
            {
                id: "llama3-8b-8192",
                name: "Llama 3 8B",
                description: "Lightweight and fast for efficient tasks",
            },
            {
                id: "gemma2-9b-it",
                name: "Gemma 2 9B",
                description: "Google's efficient instruction-tuned model",
            },
        ];
    }
    /**
     * Health check - verify API key is valid
     */
    static async healthCheck() {
        try {
            if (!this.API_KEY) {
                return {
                    status: "error",
                    message: "GROQ_API_KEY is not set",
                };
            }
            // Quick test with a simple prompt
            await this.getAIResponse([{ role: "user", content: "Hello" }], "You are a test assistant. Just say 'ok'.");
            return {
                status: "healthy",
                message: "API key is valid and service is working",
            };
        }
        catch (error) {
            return {
                status: "error",
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
exports.AIService = AIService;
AIService.API_URL = "https://api.groq.com/openai/v1/chat/completions";
AIService.API_KEY = process.env.GROQ_API_KEY || "";
