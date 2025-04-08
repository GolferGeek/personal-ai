import { NextRequest, NextResponse } from 'next/server';

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
    
    const body = await req.json();
    const headers = getForwardedHeaders(req);
    
    // Log the request for debugging
    console.log(`POST request to /api/conversations/${id}/messages`, { 
      body, 
      headers: Object.fromEntries(Object.entries(headers))
    });
    
    // Adjust the message format to match what the backend expects
    const messagePayload = {
      content: body.content,
      role: body.role || 'user'
    };
    
    console.log('Sending message payload:', messagePayload);
    
    const response = await fetch(`${BACKEND_URL}/api/conversations/${id}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify(messagePayload),
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to messages endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 