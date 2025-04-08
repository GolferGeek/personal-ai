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
    
    // Try a direct approach - construct a hardcoded message payload
    const directPayload = {
      content: "test direct message", // Hardcoded test message
      role: "user"
    };
    
    console.log('Trying with direct payload first:', directPayload);
    
    // Send test message with hardcoded content
    const testResponse = await fetch(`${BACKEND_URL}/api/conversations/${id}/messages`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(directPayload)
    });
    
    // If direct payload works, we know it's an issue with the content extraction
    if (testResponse.ok) {
      console.log('Direct payload worked! The issue is with content extraction.');
      const testData = await testResponse.json();
      console.log('Test response data:', testData);
      
      // Return success with the test message
      return NextResponse.json(testData);
    } else {
      console.log('Even direct payload failed. Detailed error:');
      try {
        const testErrorText = await testResponse.text();
        console.error('Test error details:', testErrorText);
      } catch (e) {
        console.error('Could not read test error details');
      }
    }
    
    // Try with the actual request data
    const jsonBody = JSON.parse(rawBody);
    console.log('Parsed JSON body:', jsonBody);
    
    // Ensure content is a string and not empty
    const messageContent = jsonBody.content ? String(jsonBody.content).trim() : '';
    console.log('Message content:', messageContent);
    console.log('Message content type:', typeof messageContent);
    console.log('Content empty?', messageContent === '');
    
    // Create a very simple payload - just plain text content
    const messagePayload = {
      content: messageContent,
      role: 'user'
    };
    
    console.log('Final message payload being sent:', JSON.stringify(messagePayload));
    
    // Send the actual message
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