/**
 * Shared models used across the application
 */

export interface Conversation {
  id: string;
  title: string;
  lastUpdated: number;
  messages?: Message[];
}

export interface Message {
  id: string;
  content: string;
  role: string;
  timestamp: number;
  conversationId: string;
}

export interface ConversationParameters {
  id: string;
  conversationId: string;
  parameters: Record<string, string>;
}

// Export conversation models
export * from './conversation';

// This file will re-export all models from the package 