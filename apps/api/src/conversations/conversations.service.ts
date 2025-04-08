import { Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import {
  Conversation,
  Message,
  CreateConversationParams,
  MessageRole,
} from "@personal-ai/models";

@Injectable()
export class ConversationsService {
  private conversations: Conversation[] = [];
  private messages: Message[] = [];

  constructor() {
    // Initialize with a sample conversation for development
    if (process.env.NODE_ENV === "development") {
      const conversationId = uuidv4();
      this.conversations.push({
        id: conversationId,
        title: "Sample Conversation",
        lastUpdated: new Date().toISOString(),
      });

      this.messages.push({
        id: uuidv4(),
        conversationId,
        role: "system",
        content: "This is a sample conversation for development purposes.",
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
      });
    }
  }

  async findAll(): Promise<Conversation[]> {
    return this.conversations;
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = this.conversations.find((c) => c.id === id);
    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${id} not found. There are ${this.conversations.length} conversations available.`
      );
    }

    // Attach messages to the conversation
    const messages = this.messages.filter((m) => m.conversationId === id);
    return {
      ...conversation,
      messages,
    };
  }

  async create(params: CreateConversationParams): Promise<Conversation> {
    const id = uuidv4();
    const now = new Date();

    const newConversation: Conversation = {
      id,
      title: params.title || "New Conversation",
      lastUpdated: now.toISOString(),
      messages: [],
    };

    this.conversations.push(newConversation);

    // If an initial message is provided, create it
    if (params.initialMessage) {
      const messageId = uuidv4();
      const message: Message = {
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

  async update(
    id: string,
    conversation: Partial<Conversation>
  ): Promise<Conversation> {
    const index = this.conversations.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    const updated = {
      ...this.conversations[index],
      ...conversation,
      lastUpdated: new Date().toISOString(),
    };

    this.conversations[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const index = this.conversations.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    this.conversations.splice(index, 1);
    // Also delete all associated messages
    this.messages = this.messages.filter((m) => m.conversationId !== id);
  }

  async addMessage(
    conversationId: string,
    message: Omit<Message, "id" | "conversationId" | "timestamp" | "createdAt">
  ): Promise<Message> {
    // Check if conversation exists, and create a new one if it doesn't
    try {
      await this.findOne(conversationId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Conversation not found, create a new one with this ID
        this.conversations.push({
          id: conversationId,
          title: "Recovered Conversation",
          lastUpdated: new Date().toISOString(),
        });
      } else {
        throw error;
      }
    }

    const now = new Date();
    const newMessage: Message = {
      id: uuidv4(),
      conversationId,
      ...message,
      timestamp: now.getTime(),
      createdAt: now.toISOString(),
    };

    this.messages.push(newMessage);

    // Update the conversation's lastUpdated timestamp
    await this.update(conversationId, { lastUpdated: now.toISOString() });

    return newMessage;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    // Check if conversation exists but don't use the return value
    await this.findOne(conversationId);
    return this.messages.filter((m) => m.conversationId === conversationId);
  }
}
