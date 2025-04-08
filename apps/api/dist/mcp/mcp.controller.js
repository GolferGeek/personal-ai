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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var McpController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpController = void 0;
const common_1 = require("@nestjs/common");
const mcp_service_1 = require("./mcp.service");
class McpApiRequestDto {
}
class McpMessageDto {
}
let McpController = McpController_1 = class McpController {
    constructor(mcpService) {
        this.mcpService = mcpService;
        this.logger = new common_1.Logger(McpController_1.name);
        this.connections = new Map();
    }
    async handleApiRequest(request) {
        this.logger.log(`Received MCP API request: ${request.task_id}`);
        if (!request.task_id) {
            throw new common_1.BadRequestException("Missing task_id in request");
        }
        try {
            const result = await this.mcpService.processTask(request.task_id, request.params || {});
            return result;
        }
        catch (error) {
            this.logger.error("Error processing MCP API request");
            throw new common_1.InternalServerErrorException("Failed to process MCP request");
        }
    }
    async handleSseConnection(req, res) {
        try {
            const sessionId = this.generateSessionId();
            this.logger.log(`New SSE connection established: ${sessionId}`);
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.setHeader("X-Accel-Buffering", "no");
            res.write(`data: ${JSON.stringify({ sessionId })}\n\n`);
            this.connections.set(sessionId, res);
            req.on("close", () => {
                this.logger.log(`SSE connection closed: ${sessionId}`);
                this.connections.delete(sessionId);
            });
        }
        catch (error) {
            this.logger.error("Error setting up SSE connection:", error);
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Failed to establish SSE connection",
            });
        }
    }
    async handleMessage(messageDto) {
        try {
            const { sessionId, message } = messageDto;
            this.logger.log(`Received message for session ${sessionId}`);
            if (!this.connections.has(sessionId)) {
                throw new common_1.HttpException(`Session ${sessionId} not found`, common_1.HttpStatus.NOT_FOUND);
            }
            return { success: true };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error("Error handling MCP message");
            throw new common_1.HttpException("Failed to handle message", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
};
exports.McpController = McpController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [McpApiRequestDto]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "handleApiRequest", null);
__decorate([
    (0, common_1.Get)("sse"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "handleSseConnection", null);
__decorate([
    (0, common_1.Post)("messages"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [McpMessageDto]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "handleMessage", null);
exports.McpController = McpController = McpController_1 = __decorate([
    (0, common_1.Controller)("api/mcp"),
    __metadata("design:paramtypes", [mcp_service_1.McpService])
], McpController);
//# sourceMappingURL=mcp.controller.js.map