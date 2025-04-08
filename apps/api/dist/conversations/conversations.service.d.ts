import { Conversation, Message, CreateConversationParams } from "@personal-ai/models";
export declare class ConversationsService {
    private conversations;
    private messages;
    constructor();
    findAll(): Promise<Conversation[]>;
    findOne(id: string): Promise<Conversation>;
    create(params: CreateConversationParams): Promise<Conversation>;
    update(id: string, conversation: Partial<Conversation>): Promise<Conversation>;
    delete(id: string): Promise<void>;
    addMessage(conversationId: string, message: Omit<Message, "id" | "conversationId" | "timestamp" | "createdAt">): Promise<Message>;
    getMessages(conversationId: string): Promise<Message[]>;
}
