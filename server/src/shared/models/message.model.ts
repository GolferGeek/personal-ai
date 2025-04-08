export type MessageRole = 'user' | 'system' | 'assistant';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  createdAt: Date;
} 