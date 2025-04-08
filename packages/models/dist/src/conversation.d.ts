/**
 * Message role type definition
 */
export type MessageRole = 'user' | 'assistant' | 'system' | 'error';
/**
 * Message interface
 */
export interface Message {
    id?: string;
    role: MessageRole;
    content: string;
    timestamp?: number;
    conversationId?: string;
    createdAt?: Date | string;
}
/**
 * Conversation interface
 */
export interface Conversation {
    id: string;
    title: string;
    lastUpdated: string;
    messages?: Message[];
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
    description?: string;
    required?: boolean;
    default?: string | boolean | number;
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
/**
 * Parameters needed state
 */
export interface ParametersNeededState {
    agentId: string;
    parameters: AgentParameter[];
}
/**
 * User identity model
 */
export interface UserIdentity {
    id: string;
    createdAt: Date | string;
    preferences?: Record<string, any>;
}
/**
 * Conversation model interfaces
 */
export interface ConversationParameters {
    id: string;
    conversationId: string;
    parameters: Record<string, unknown>;
}
//# sourceMappingURL=conversation.d.ts.map