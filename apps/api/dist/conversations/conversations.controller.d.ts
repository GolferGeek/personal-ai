import { Conversation, Message, CreateConversationParams, MessageRole } from "@personal-ai/models";
import { ConversationsService } from "./conversations.service";
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    findAll(): Promise<Conversation[]>;
    findOne(id: string): Promise<Conversation>;
    create(createConversationDto: CreateConversationParams): Promise<Conversation>;
    update(id: string, updateConversationDto: Partial<Conversation>): Promise<Conversation>;
    delete(id: string): Promise<void>;
    getMessages(id: string): Promise<Message[]>;
    addMessage(id: string, messageDto: {
        content: string;
        role: MessageRole;
    }): Promise<Message>;
}
