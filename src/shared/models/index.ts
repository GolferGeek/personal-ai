// Message role type to match backend
export type MessageRole = 'user' | 'system' | 'assistant';

// User identity model
export interface UserIdentity {
  id: string;
  createdAt: Date;
  preferences?: Record<string, any>;
}

// Conversation model
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message model
export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  createdAt: Date;
} 