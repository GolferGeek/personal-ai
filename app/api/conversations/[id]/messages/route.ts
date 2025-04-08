import { NextRequest, NextResponse } from 'next/server';

// Make sure we're using the correct URL
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to forward headers
function getForwardedHeaders(req: NextRequest): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Forward user ID if present
  const userId = req.headers.get('x-user-id');
  if (userId) {
    headers['x-user-id'] = userId;
  }
  
  return headers;
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the entire params object
    const params = await context.params;
    const id = params.id;
    
    const headers = getForwardedHeaders(req);
    
    // Log the request for debugging
    console.log(`GET request to /api/conversations/${id}/messages`);
    
    const response = await fetch(`${BACKEND_URL}/api/conversations/${id}/messages`, {
      headers,
    });
    
    if (!response.ok) {
      console.error(`Error response from messages endpoint: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to messages endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the entire params object
    const params = await context.params;
    const id = params.id;
    
    const headers = getForwardedHeaders(req);
    
    // First check if the conversation exists
    console.log(`Verifying conversation exists: ${id}`);
    const checkResponse = await fetch(`${BACKEND_URL}/api/conversations/${id}`, {
      headers
    });
    
    if (!checkResponse.ok) {
      console.error(`Conversation ${id} not found or not accessible`);
      
      // Try to get error details
      try {
        const errorText = await checkResponse.text();
        console.error('Conversation check error details:', errorText);
      } catch (e) {
        console.error('Could not read error details from conversation check');
      }
      
      return NextResponse.json(
        { error: 'Conversation not found or not accessible. Please create a new conversation.' },
        { status: 404 }
      );
    }
    
    console.log(`Conversation ${id} exists, proceeding with message`);
    
    // Get the raw body as text for debugging
    const rawBodyClone = req.clone();
    const rawBody = await rawBodyClone.text();
    console.log(`Raw request body to messages endpoint: ${rawBody}`);
    
    // Parse the JSON
    const body = await req.json();
    
    // Log the request details
    console.log('Message request body:', body);
    
    // Create a simple, clean payload
    const messagePayload = {
      content: String(body.content || '').trim(),
      role: 'user'
    };
    
    // Validate content
    if (!messagePayload.content) {
      console.error('Message content is empty or missing');
      return NextResponse.json(
        { error: 'Message content is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    
    console.log('Sending message payload to backend:', messagePayload);
    
    // Send the message to the backend
    const response = await fetch(`${BACKEND_URL}/api/conversations/${id}/messages`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messagePayload)
    });
    
    if (!response.ok) {
      console.error(`Error response from messages endpoint: ${response.status} ${response.statusText}`);
      
      // Try to get more error details
      try {
        const errorText = await response.text();
        console.error('Error details:', errorText);
      } catch (e) {
        console.error('Could not read error details');
      }
      
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Success response from backend:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to messages endpoint:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 