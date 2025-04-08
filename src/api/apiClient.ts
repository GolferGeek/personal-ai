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

/**
 * Debug utility for logging API responses
 */
function debugApiResponse(source: string, response: any) {
  console.group(`🔍 API Response Debug (${source})`);
  console.log('Response type:', response?.type);
  console.log('Response structure:', response);
  
  if (response?.data && typeof response.data === 'object') {
    console.log('Message data:', response.data);
    console.log('Message content:', response.data.content);
    console.log('Message role:', response.data.role);
  }
  
  console.groupEnd();
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
    
    console.log('Sending message to API sync endpoint:', {
      url: `/api/conversations/${conversationId}/messages/sync`,
      payload: messagePayload
    });
    
    // Get headers with user ID
    const headers = getHeaders();
    console.log('Using headers for message:', headers);
    
    try {
      // Use the sync endpoint that waits for the assistant's response
      const response = await fetch(`/api/conversations/${conversationId}/messages/sync`, {
        method: 'POST',
        headers,
        body: JSON.stringify(messagePayload)
      });
      
      if (!response.ok) {
        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText
        });
        
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API complete response (including assistant):', data);
      
      // The backend returns both the user message and the assistant message
      // We want to return the assistant message as our response
      if (data && data.assistantMessage) {
        return {
          type: 'message',
          success: true,
          data: data.assistantMessage
        };
      }
      
      // Fall back to standard response format if assistantMessage is not present
      return this.convertToResponseFormat(data);
    } catch (error) {
      console.error('Error sending message with sync endpoint:', error);
      
      // Fall back to the old endpoint if the sync one fails
      console.log('Falling back to standard message endpoint...');
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify(messagePayload)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.convertToResponseFormat(data);
    }
  },
  
  // Helper method to convert backend message to frontend response format
  convertToResponseFormat(data: any): Response {
    // If data already matches our Response format, return as is
    if (data && (data.type === 'message' || data.type === 'parameters_needed')) {
      return data;
    }
    
    // If it's a message from the backend (conversation controller)
    if (data && data.id && data.content && data.role) {
      return {
        type: 'message',
        success: true,
        data: {
          id: data.id,
          content: data.content,
          role: data.role,
          timestamp: data.timestamp || Date.now()
        }
      };
    }
    
    // Default case - unknown format
    console.warn('Unknown response format:', data);
    return {
      type: 'message',
      success: true,
      data: data
    };
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
  },
  
  // Send a new message - try direct backend connection
  async sendMessageDirect(conversationId: string, content: string): Promise<Response> {
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
    
    console.log('Sending message DIRECTLY to backend:', {
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/conversations/${conversationId}/messages`,
      payload: messagePayload
    });
    
    // Get headers with user ID
    const headers = getHeaders();
    console.log('Using headers for direct message:', headers);
    
    // Try sending directly to the backend, bypassing Next.js API route
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${backendUrl}/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify(messagePayload)
      });
      
      if (!response.ok) {
        console.error('Direct backend error response:', {
          status: response.status,
          statusText: response.statusText
        });
        
        // Try to get error details
        try {
          const errorData = await response.json();
          console.error('Direct error details:', errorData);
        } catch (e) {
          console.error('Could not parse direct error response');
        }
        
        throw new Error(`Failed to send message directly: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Direct success response:', data);
      
      // Convert backend message format to frontend format if needed
      const responseData = this.convertToResponseFormat(data);
      debugApiResponse('sendMessageDirect', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Error sending message directly to backend:', error);
      throw error;
    }
  }
};

export default apiClient; 