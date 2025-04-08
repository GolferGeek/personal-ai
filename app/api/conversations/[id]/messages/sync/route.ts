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
    console.log(`Verifying conversation exists for sync endpoint: ${id}`);
    const checkResponse = await fetch(`${BACKEND_URL}/api/conversations/${id}`, {
      headers
    });
    
    if (!checkResponse.ok) {
      console.error(`Conversation ${id} not found or not accessible`);
      return NextResponse.json(
        { error: 'Conversation not found or not accessible. Please create a new conversation.' },
        { status: 404 }
      );
    }
    
    console.log(`Conversation ${id} exists, proceeding with synchronous message`);
    
    // Get the request body
    const body = await req.json();
    
    // Ensure content is a string and not empty
    const messageContent = body.content ? String(body.content).trim() : '';
    
    // Create the message payload
    const messagePayload = {
      content: messageContent,
      role: 'user',
      sync: true // Add a flag to indicate this should be processed synchronously
    };
    
    console.log('Sync message payload being sent:', JSON.stringify(messagePayload));
    
    // Send the message to the synchronous endpoint
    const response = await fetch(`${BACKEND_URL}/api/conversations/${id}/messages/sync`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messagePayload)
    });
    
    if (!response.ok) {
      console.error(`Error response from sync messages endpoint: ${response.status} ${response.statusText}`);
      
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
    console.log('Success response from sync backend:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to sync messages endpoint:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 