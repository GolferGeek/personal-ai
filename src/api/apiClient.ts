import { Conversation, Message, ParametersNeededState } from '../models/conversation';

// Response types
export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface MessageResponse extends ApiResponse {
  type: 'message';
  data: Message;
}

export interface ParametersNeededResponse extends ApiResponse {
  type: 'parameters_needed';
  data: ParametersNeededState;
}

export type Response = MessageResponse | ParametersNeededResponse;

// API client for conversation-related endpoints
const apiClient = {
  // Fetch all conversations
  async getConversations(): Promise<Conversation[]> {
    const response = await fetch('/api/conversations');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Fetch a single conversation with its messages
  async getConversation(id: string): Promise<Conversation> {
    const response = await fetch(`/api/conversations/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Fetch messages for a conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`/api/conversations/${conversationId}/messages`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Send a new message
  async sendMessage(conversationId: string, content: string): Promise<Response> {
    const message: Partial<Message> = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Send parameters to an agent
  async sendParameters(
    conversationId: string, 
    agentId: string, 
    parameters: Record<string, any>
  ): Promise<Response> {
    const response = await fetch(`/api/conversations/${conversationId}/agent-parameters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agentId, parameters })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send parameters: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Create a new conversation
  async createConversation(title?: string): Promise<Conversation> {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title || 'New Conversation' })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create conversation: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Delete a conversation
  async deleteConversation(id: string): Promise<ApiResponse> {
    const response = await fetch(`/api/conversations/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete conversation: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Send a direct request to the orchestrator
  async sendOrchestratorRequest(
    query: string, 
    conversationId?: string
  ): Promise<Response> {
    const response = await fetch('/api/orchestrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        conversationId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to process request: ${response.statusText}`);
    }
    
    return response.json();
  }
};

export default apiClient; 