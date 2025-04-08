/**
 * Message role type definition
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Message interface
 */
export interface Message {
  role: MessageRole;
  content: string;
  timestamp?: number;
}

/**
 * Conversation interface
 */
export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  createdAt: number;
  lastUpdated: number;
  model?: string;
}

/**
 * Conversation creation parameters
 */
export interface CreateConversationParams {
  title?: string;
  model?: string;
  initialMessage?: string;
}

/**
 * Agent parameter interface
 */
export interface AgentParameter {
  name: string;
  type: 'string' | 'boolean' | 'number';
  label: string;
  required?: boolean;
  default?: string | boolean | number;
  description?: string;
}

/**
 * Agent interface
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  parameters?: AgentParameter[];
} 