/**
 * Mock data for testing the synchronous messages endpoint
 */

export interface MockMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
  conversationId: string;
}

export interface MockResponse {
  userMessage: MockMessage;
  assistantMessage: MockMessage;
}

/**
 * Generate a mock response for a user message
 * 
 * @param conversationId - The conversation ID
 * @param userContent - The content of the user message
 * @returns A mock response with user and assistant messages
 */
export function generateMockResponse(conversationId: string, userContent: string): MockResponse {
  const timestamp = Date.now();
  
  return {
    userMessage: {
      id: `user-${timestamp}`,
      content: userContent,
      role: 'user',
      timestamp: timestamp,
      conversationId
    },
    assistantMessage: {
      id: `assistant-${timestamp}`,
      content: `This is a mock response to: "${userContent}"`,
      role: 'assistant',
      timestamp: timestamp + 1000, // 1 second later
      conversationId
    }
  };
} 