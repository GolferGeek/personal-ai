import { POST } from './route';
import { getForwardedHeaders } from '@personal-ai/utils';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Define a type for the mock response
interface MockResponse extends Partial<Response> {
  json: jest.Mock;
  ok: boolean;
  status?: number;
  statusText?: string;
}

// Mock the fetch function
global.fetch = jest.fn() as jest.Mock;

// Mock the utils
jest.mock('@personal-ai/utils', () => ({
  getForwardedHeaders: jest.fn().mockReturnValue({})
}));

describe('Messages Synchronous API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should handle POST request and return assistant response', async () => {
    // Mock successful backend response
    const mockJsonFn = jest.fn().mockResolvedValue({
      userMessage: { id: 'user-msg-1', content: 'test message', role: 'user' },
      assistantMessage: { id: 'assistant-msg-1', content: 'test response', role: 'assistant' }
    });
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: mockJsonFn
    } as MockResponse);
    
    // Create test request
    const request = new Request('http://localhost:3000/api/conversations/123/messages/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-user'
      },
      body: JSON.stringify({
        content: 'test message',
        role: 'user'
      })
    });
    
    // Create test context
    const context = {
      params: Promise.resolve({ id: '123' })
    };
    
    // Call the POST handler
    const response = await POST(request, context as any);
    
    // Verify response
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    
    const responseData = await response.json();
    expect(responseData).toEqual({
      userMessage: { id: 'user-msg-1', content: 'test message', role: 'user' },
      assistantMessage: { id: 'assistant-msg-1', content: 'test response', role: 'assistant' }
    });
    
    // Verify fetch was called correctly
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/conversations/123/messages/sync',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.any(String)
      })
    );
    
    // Verify utility was called
    expect(getForwardedHeaders).toHaveBeenCalled();
  });
  
  it('should handle backend error responses', async () => {
    // Mock error backend response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as MockResponse);
    
    // Create test request
    const request = new Request('http://localhost:3000/api/conversations/123/messages/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: 'test message',
        role: 'user'
      })
    });
    
    // Create test context
    const context = {
      params: Promise.resolve({ id: '123' })
    };
    
    // Call the POST handler
    const response = await POST(request, context as any);
    
    // Verify response
    expect(response).toBeDefined();
    expect(response.status).toBe(500);
    
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: 'Failed to process message',
      status: 500
    });
  });
  
  it('should handle exceptions during processing', async () => {
    // Mock fetch to throw an error
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    // Create test request
    const request = new Request('http://localhost:3000/api/conversations/123/messages/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: 'test message',
        role: 'user'
      })
    });
    
    // Create test context
    const context = {
      params: Promise.resolve({ id: '123' })
    };
    
    // Call the POST handler
    const response = await POST(request, context as any);
    
    // Verify response
    expect(response).toBeDefined();
    expect(response.status).toBe(500);
    
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: 'Failed to process message',
      details: 'Network error'
    });
  });
}); 