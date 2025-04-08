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
    if (!conversationId) {
      console.error('Cannot send message: No conversation ID provided');
      throw new Error('No conversation ID provided');
    }
    
    // Validate content
    if (!content || content.trim() === '') {
      throw new Error('Message content cannot be empty');
    }
    
    // Create the message payload
    const messagePayload = {
      content: content.trim(),
      role: 'user'
    };
    
    console.log('Sending message to API:', {
      url: `/api/conversations/${conversationId}/messages`,
      payload: messagePayload
    });
    
    // Get headers with user ID
    const headers = getHeaders();
    console.log('Using headers for message:', headers);
    
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify(messagePayload)
    });
    
    if (!response.ok) {
      console.error('API error response:', {
        status: response.status,
        statusText: response.statusText
      });
      
      // Try to get error details
      try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        
        // If conversation not found, try to create a new one
        if (response.status === 404 && errorData.error && errorData.error.includes('Conversation not found')) {
          console.log('Conversation not found, creating new conversation...');
          const newConversation = await this.createConversation();
          
          // Try sending to the new conversation
          return this.sendMessage(newConversation.id, content);
        }
      } catch (e) {
        console.error('Could not parse error response');
      }
      
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API success response:', data);
    return data;
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
    const payload = { title: title || 'New Conversation' };
    
    console.log('Creating conversation with payload:', payload);
    
    // Ensure we have proper headers, especially user ID
    const headers = getHeaders();
    console.log('Using headers for conversation creation:', headers);
    
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error('Failed to create conversation:', {
        status: response.status,
        statusText: response.statusText
      });
      
      // Try to get the error details from the response
      try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
      } catch (e) {
        console.error('Could not parse error response');
      }
      
      throw new Error(`Failed to create conversation: ${response.statusText}`);
    }
    
    const conversation = await response.json();
    console.log('Successfully created conversation:', conversation);
    return conversation;
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