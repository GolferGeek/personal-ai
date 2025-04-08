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
var OrchestrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationService = void 0;
const common_1 = require("@nestjs/common");
const conversations_service_1 = require("../conversations/conversations.service");
const agents_service_1 = require("../agents/agents.service");
const mcp_service_1 = require("../mcp/mcp.service");
let OrchestrationService = OrchestrationService_1 = class OrchestrationService {
    constructor(conversationsService, agentsService, mcpService) {
        this.conversationsService = conversationsService;
        this.agentsService = agentsService;
        this.mcpService = mcpService;
        this.logger = new common_1.Logger(OrchestrationService_1.name);
    }
    async generateResponse(conversationId, userMessage) {
        try {
            await this.conversationsService.addMessage(conversationId, {
                role: "user",
                content: userMessage,
            });
            try {
                if (userMessage.toLowerCase().trim().startsWith("reverse ")) {
                    const textToReverse = userMessage.substring("reverse ".length).trim();
                    const mcpResponse = await this.mcpService.processTask("reverse_text", {
                        text: textToReverse,
                    });
                    let responseContent = "";
                    if (mcpResponse.status === "success") {
                        this.logger.log(`Received reversed text from MCP: ${mcpResponse.data?.reversed}`);
                        responseContent = mcpResponse.data?.reversed;
                    }
                    else {
                        this.logger.warn(`MCP call failed: ${mcpResponse.error?.message}`);
                        responseContent = `Error: ${mcpResponse.error?.message}`;
                    }
                    const assistantMessage = await this.conversationsService.addMessage(conversationId, {
                        role: "assistant",
                        content: responseContent,
                    });
                    return assistantMessage;
                }
                else {
                    const assistantMessage = await this.conversationsService.addMessage(conversationId, {
                        role: "assistant",
                        content: `I understand you said: "${userMessage}". If you want me to reverse some text, please start your message with 'reverse' followed by the text you want reversed.`,
                    });
                    return assistantMessage;
                }
            }
            catch (mcpError) {
                this.logger.error(`MCP processing error: ${mcpError.message}`);
                const fallbackMessage = await this.conversationsService.addMessage(conversationId, {
                    role: "assistant",
                    content: `I received your message: "${userMessage}", but encountered an error while processing it through MCP. 
            
Error details: ${mcpError.message}`,
                });
                return fallbackMessage;
            }
        }
        catch (error) {
            this.logger.error(`Error generating response: ${error.message}`);
            try {
                return await this.conversationsService.addMessage(conversationId, {
                    role: "assistant",
                    content: `I apologize, but I was unable to process your message: "${userMessage}". Please try again later.`,
                });
            }
            catch (addMessageError) {
                this.logger.error(`Failed to add fallback message: ${addMessageError.message}`);
                return {
                    id: "error-fallback",
                    conversationId,
                    role: "assistant",
                    content: `I apologize, but I was unable to process your message. There was an error with the conversation system.`,
                    timestamp: Date.now(),
                    createdAt: new Date().toISOString(),
                };
            }
        }
    }
    async getAgentsSummary() {
        const agents = await this.agentsService.findAll();
        return {
            count: agents.length,
            agents: agents.map((agent) => ({
                id: agent.id,
                name: agent.name,
            })),
        };
    }
};
exports.OrchestrationService = OrchestrationService;
exports.OrchestrationService = OrchestrationService = OrchestrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService,
        agents_service_1.AgentsService,
        mcp_service_1.McpService])
], OrchestrationService);
//# sourceMappingURL=orchestration.service.js.map