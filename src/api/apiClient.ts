import { Conversation, Message, ParametersNeededState } from '../models/conversation';
import { v4 as uuidv4 } from 'uuid';

// Get or create a user ID for the session
function getUserId(): string {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

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

// Helper function to add user ID to request headers
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-user-id': getUserId()
  };
}

// API client for conversation-related endpoints
const apiClient = {
  // Fetch all conversations
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch('/api/conversations', {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        // If no conversations exist (404), create a default one
        if (response.status === 404) {
          console.log('No conversations found, creating a default conversation');
          const defaultConversation = await this.createConversation('New Conversation');
          return [defaultConversation];
        }
        throw new Error(`Failed to fetch conversations: ${response.statusText}`);
      }
      
      const conversations = await response.json();
      // If no conversations returned, create a default one
      if (conversations && Array.isArray(conversations) && conversations.length === 0) {
        console.log('No conversations found, creating a default conversation');
        const defaultConversation = await this.createConversation('New Conversation');
        return [defaultConversation];
      }
      
      return conversations;
    } catch (error) {
      // If any error occurs, try to create a default conversation
      console.error('Error fetching conversations:', error);
      console.log('Creating a default conversation after error');
      try {
        const defaultConversation = await this.createConversation('New Conversation');
        return [defaultConversation];
      } catch (createError) {
        console.error('Error creating default conversation:', createError);
        throw error; // Re-throw the original error
      }
    }
  },
  
  // Fetch a single conversation with its messages
  async getConversation(id: string): Promise<Conversation> {
    const response = await fetch(`/api/conversations/${id}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Fetch messages for a conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      headers: getHeaders()
    });
    
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
      headers: getHeaders(),
      body: JSON.stringify({ content, role: 'user' })
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
      headers: getHeaders(),
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
      headers: getHeaders(),
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
      method: 'DELETE',
      headers: getHeaders()
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
      headers: getHeaders(),
      body: JSON.stringify({
        input: query,
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