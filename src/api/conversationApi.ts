import { MessageRole } from '../shared/models';
import { getUserId, handleResponse } from './utils';

// Types to match our backend models
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  createdAt: Date;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Conversation API methods
export const conversationApi = {
  // Get all conversations for current user
  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
    });
    return handleResponse(response);
  },

  // Get a specific conversation with its messages
  async getConversation(conversationId: string): Promise<{ conversation: Conversation; messages: Message[] }> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
    });
    return handleResponse(response);
  },

  // Create a new conversation
  async createConversation(title: string = 'New Conversation'): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
      body: JSON.stringify({ title }),
    });
    return handleResponse(response);
  },

  // Update a conversation's title
  async updateConversationTitle(conversationId: string, title: string): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
      body: JSON.stringify({ title }),
    });
    return handleResponse(response);
  },

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
    });
    return handleResponse(response);
  },

  // Add a message to a conversation
  async addMessage(conversationId: string, content: string, role: MessageRole = 'user'): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
      body: JSON.stringify({ content, role }),
    });
    return handleResponse(response);
  },

  // Get messages for a conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
    });
    return handleResponse(response);
  },
}; 