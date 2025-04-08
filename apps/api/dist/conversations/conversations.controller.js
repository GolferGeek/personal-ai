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
exports.ConversationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const conversations_service_1 = require("./conversations.service");
let ConversationsController = class ConversationsController {
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    async findAll() {
        return this.conversationsService.findAll();
    }
    async findOne(id) {
        return this.conversationsService.findOne(id);
    }
    async create(createConversationDto) {
        return this.conversationsService.create(createConversationDto);
    }
    async update(id, updateConversationDto) {
        return this.conversationsService.update(id, updateConversationDto);
    }
    async delete(id) {
        return this.conversationsService.delete(id);
    }
    async getMessages(id) {
        return this.conversationsService.getMessages(id);
    }
    async addMessage(id, messageDto) {
        return this.conversationsService.addMessage(id, messageDto);
    }
};
exports.ConversationsController = ConversationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all conversations" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "List of all conversations" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a conversation by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Conversation ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "The conversation" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Conversation not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new conversation" }),
    (0, swagger_1.ApiBody)({ type: Object, description: "Conversation creation parameters" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "The created conversation" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a conversation" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Conversation ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "The updated conversation" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Conversation not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "Delete a conversation" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Conversation ID" }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: "Conversation successfully deleted",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Conversation not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(":id/messages"),
    (0, swagger_1.ApiOperation)({ summary: "Get all messages for a conversation" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Conversation ID" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of messages for the conversation",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Conversation not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(":id/messages"),
    (0, swagger_1.ApiOperation)({ summary: "Add a message to a conversation" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Conversation ID" }),
    (0, swagger_1.ApiBody)({ type: Object, description: "Message content" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "The created message" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Conversation not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "addMessage", null);
exports.ConversationsController = ConversationsController = __decorate([
    (0, swagger_1.ApiTags)("conversations"),
    (0, common_1.Controller)("conversations"),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], ConversationsController);
//# sourceMappingURL=conversations.controller.js.map