import {
  Conversation,
  Message,
  CreateConversationParams,
  MessageRole,
} from "@personal-ai/models";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * API client for the backend services
 */
export class ApiClient {
  /**
   * Fetch all conversations
   */
  static async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }
    return response.json();
  }

  /**
   * Fetch a single conversation by ID
   */
  static async getConversation(id: string): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch conversation with ID ${id}`);
    }
    return response.json();
  }

  /**
   * Create a new conversation
   */
  static async createConversation(
    params: CreateConversationParams
  ): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }
    return response.json();
  }

  /**
   * Update a conversation
   */
  static async updateConversation(
    id: string,
    data: Partial<Conversation>
  ): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update conversation with ID ${id}`);
    }
    return response.json();
  }

  /**
   * Delete a conversation
   */
  static async deleteConversation(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete conversation with ID ${id}`);
    }
  }

  /**
   * Get messages for a conversation
   */
  static async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/messages`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch messages for conversation with ID ${conversationId}`
      );
    }
    return response.json();
  }

  /**
   * Add a message to a conversation
   */
  static async addMessage(
    conversationId: string,
    content: string,
    role: MessageRole
  ): Promise<Message> {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, role }),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to add message to conversation with ID ${conversationId}`
      );
    }
    return response.json();
  }

  /**
   * Generate a response using the AI
   */
  static async generateResponse(
    conversationId: string,
    message: string
  ): Promise<Message> {
    const response = await fetch(
      `${API_BASE_URL}/orchestration/conversations/${conversationId}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to generate response for conversation with ID ${conversationId}`
      );
    }
    return response.json();
  }

  /**
   * Get a summary of available agents
   */
  static async getAgentsSummary(): Promise<{
    count: number;
    agents: Array<{ id: string; name: string }>;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/orchestration/agents/summary`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch agents summary");
    }
    return response.json();
  }
}
