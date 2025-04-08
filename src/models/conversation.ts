export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  lastUpdated: number;
  messages: Message[];
}

export type ConversationRole = Message['role'];

export interface ParametersNeededState {
  agentId: string;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'boolean';
    description?: string;
    required: boolean;
    default?: any;
  }[];
} 