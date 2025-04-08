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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let ConversationsService = class ConversationsService {
    constructor() {
        this.conversations = [];
        this.messages = [];
        if (process.env.NODE_ENV === "development") {
            const conversationId = (0, uuid_1.v4)();
            this.conversations.push({
                id: conversationId,
                title: "Sample Conversation",
                lastUpdated: new Date().toISOString(),
            });
            this.messages.push({
                id: (0, uuid_1.v4)(),
                conversationId,
                role: "system",
                content: "This is a sample conversation for development purposes.",
                timestamp: Date.now(),
                createdAt: new Date().toISOString(),
            });
        }
    }
    async findAll() {
        return this.conversations;
    }
    async findOne(id) {
        const conversation = this.conversations.find((c) => c.id === id);
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation with ID ${id} not found. There are ${this.conversations.length} conversations available.`);
        }
        const messages = this.messages.filter((m) => m.conversationId === id);
        return {
            ...conversation,
            messages,
        };
    }
    async create(params) {
        const id = (0, uuid_1.v4)();
        const now = new Date();
        const newConversation = {
            id,
            title: params.title || "New Conversation",
            lastUpdated: now.toISOString(),
            messages: [],
        };
        this.conversations.push(newConversation);
        if (params.initialMessage) {
            const messageId = (0, uuid_1.v4)();
            const message = {
                id: messageId,
                conversationId: id,
                role: "user",
                content: params.initialMessage,
                timestamp: now.getTime(),
                createdAt: now.toISOString(),
            };
            this.messages.push(message);
            newConversation.messages = [message];
        }
        return newConversation;
    }
    async update(id, conversation) {
        const index = this.conversations.findIndex((c) => c.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Conversation with ID ${id} not found`);
        }
        const updated = {
            ...this.conversations[index],
            ...conversation,
            lastUpdated: new Date().toISOString(),
        };
        this.conversations[index] = updated;
        return updated;
    }
    async delete(id) {
        const index = this.conversations.findIndex((c) => c.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Conversation with ID ${id} not found`);
        }
        this.conversations.splice(index, 1);
        this.messages = this.messages.filter((m) => m.conversationId !== id);
    }
    async addMessage(conversationId, message) {
        try {
            await this.findOne(conversationId);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.conversations.push({
                    id: conversationId,
                    title: "Recovered Conversation",
                    lastUpdated: new Date().toISOString(),
                });
            }
            else {
                throw error;
            }
        }
        const now = new Date();
        const newMessage = {
            id: (0, uuid_1.v4)(),
            conversationId,
            ...message,
            timestamp: now.getTime(),
            createdAt: now.toISOString(),
        };
        this.messages.push(newMessage);
        await this.update(conversationId, { lastUpdated: now.toISOString() });
        return newMessage;
    }
    async getMessages(conversationId) {
        await this.findOne(conversationId);
        return this.messages.filter((m) => m.conversationId === conversationId);
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map