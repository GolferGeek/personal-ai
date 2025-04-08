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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orchestration_service_1 = require("./orchestration.service");
let OrchestrationController = class OrchestrationController {
    constructor(orchestrationService) {
        this.orchestrationService = orchestrationService;
    }
    async generateResponse(conversationId, body) {
        return this.orchestrationService.generateResponse(conversationId, body.message);
    }
    async getAgentsSummary() {
        return this.orchestrationService.getAgentsSummary();
    }
};
exports.OrchestrationController = OrchestrationController;
__decorate([
    (0, common_1.Post)('conversations/:id/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a response from the AI' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID' }),
    (0, swagger_1.ApiBody)({ type: Object, description: 'User message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The generated AI response' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrchestrationController.prototype, "generateResponse", null);
__decorate([
    (0, common_1.Get)('agents/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a summary of available agents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Summary of available agents' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrchestrationController.prototype, "getAgentsSummary", null);
exports.OrchestrationController = OrchestrationController = __decorate([
    (0, swagger_1.ApiTags)('orchestration'),
    (0, common_1.Controller)('orchestration'),
    __metadata("design:paramtypes", [orchestration_service_1.OrchestrationService])
], OrchestrationController);
//# sourceMappingURL=orchestration.controller.js.map