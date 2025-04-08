import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, MessageRole } from './models';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);
  
  // In-memory storage for conversations and messages
  // In a production system, these would be persisted in a database
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();

  /**
   * Create a new conversation for a user
   */
  createConversation(userId: string, title: string = 'New Conversation'): Conversation {
    const conversationId = uuidv4();
    const conversation: Conversation = {
      id: conversationId,
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.conversations.set(conversationId, conversation);
    this.messages.set(conversationId, []);
    this.logger.log(`Created conversation ${conversationId} for user ${userId}`);
    
    return conversation;
  }

  /**
   * Get a conversation by ID
   */
  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  /**
   * Update a conversation's title
   */
  updateConversationTitle(conversationId: string, title: string): Conversation | undefined {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return undefined;

    conversation.title = title;
    conversation.updatedAt = new Date();
    this.conversations.set(conversationId, conversation);
    
    return conversation;
  }

  /**
   * List all conversations for a user
   */
  listConversationsForUser(userId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Delete a conversation and all its messages
   */
  deleteConversation(conversationId: string): boolean {
    const conversationExists = this.conversations.has(conversationId);
    if (!conversationExists) return false;

    this.conversations.delete(conversationId);
    this.messages.delete(conversationId);
    
    return true;
  }

  /**
   * Add a message to a conversation
   */
  addMessage(
    conversationId: string,
    content: string,
    role: MessageRole
  ): Message | undefined {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return undefined;

    const messageId = uuidv4();
    const message: Message = {
      id: messageId,
      conversationId,
      content,
      role,
      createdAt: new Date(),
    };
    
    const conversationMessages = this.messages.get(conversationId) || [];
    conversationMessages.push(message);
    this.messages.set(conversationId, conversationMessages);

    // Update the conversation's updatedAt timestamp
    conversation.updatedAt = new Date();
    this.conversations.set(conversationId, conversation);
    
    return message;
  }

  /**
   * Get all messages for a conversation
   */
  getMessagesForConversation(conversationId: string): Message[] {
    return this.messages.get(conversationId) || [];
  }

  /**
   * Search conversations by title for a user
   */
  searchConversations(userId: string, query: string): Conversation[] {
    if (!query) return this.listConversationsForUser(userId);
    
    const normalizedQuery = query.toLowerCase();
    return this.listConversationsForUser(userId)
      .filter(conv => conv.title.toLowerCase().includes(normalizedQuery));
  }
} 