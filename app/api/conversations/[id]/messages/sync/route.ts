// Import the types and functions we need
// If next/server can't be found, we'll use fallback types
interface NextResponseType {
  json: (data: unknown, init?: ResponseInit) => Response;
}

let NextRequest: typeof Request;
let NextResponse: NextResponseType;

try {
  const server = require('next/server');
  NextRequest = server.NextRequest;
  NextResponse = server.NextResponse;
} catch (e) {
  // Fallback definitions if next/server can't be found
  NextRequest = Request;
  NextResponse = {
    json: (data: unknown, init?: ResponseInit) => new Response(JSON.stringify(data), {
      headers: { 'content-type': 'application/json' },
      ...init
    })
  };
}

import { getForwardedHeaders } from '@personal-ai/utils';
import { generateMockResponse } from './mock';

// Process.env variables for backend communication
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const USE_MOCK_API = process.env.MOCK_API === 'true';

/**
 * POST handler for the synchronous messages endpoint
 * 
 * This endpoint sends a message and waits for the assistant's response
 * before returning both messages to the client
 */
export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  console.log('[API] Synchronous message POST for conversation:', context.params.id);
  
  try {
    // Await the params to ensure we have the ID
    const params = await context.params;
    const { id: conversationId } = params;
    
    // Get request payload
    const payload = await request.json();
    
    // Create an object with the message content and conversation ID
    const messageData = {
      content: payload.content,
      role: payload.role || 'user',
      conversationId
    };
    
    console.log('[API] Sending message to backend:', messageData);
    
    // Use mock response if in test mode
    if (USE_MOCK_API) {
      console.log('[API] Using mock response for testing');
      const mockResponse = generateMockResponse(conversationId, messageData.content);
      return NextResponse.json(mockResponse);
    }
    
    // Get forwarded headers from the request
    const forwardedHeaders = getForwardedHeaders(request.headers);
    
    // Send to backend and wait for response
    const backendResponse = await fetch(`${BACKEND_URL}/api/conversations/${conversationId}/messages/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...forwardedHeaders
      },
      body: JSON.stringify(messageData)
    });
    
    if (!backendResponse.ok) {
      console.error('[API] Backend error:', backendResponse.status, backendResponse.statusText);
      return NextResponse.json(
        { error: 'Failed to process message', status: backendResponse.status },
        { status: backendResponse.status }
      );
    }
    
    // Get the response which should contain both the user message and assistant response
    const responseData = await backendResponse.json();
    console.log('[API] Successfully received assistant response');
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[API] Error in sync message processing:', error);
    return NextResponse.json(
      { error: 'Failed to process message', details: (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 