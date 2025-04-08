import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:3001';

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
    const { params } = context;
    const id = params.id;
    
    const body = await req.json();
    const headers = getForwardedHeaders(req);
    
    // Log the request for debugging
    console.log(`POST request to /api/conversations/${id}/agent-parameters`, { 
      body, 
      headers: Object.fromEntries(Object.entries(headers))
    });
    
    // Forward to orchestrator endpoint since this is a custom endpoint
    const response = await fetch(`${BACKEND_URL}/api/orchestrate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...body,
        conversationId: id
      }),
    });
    
    if (!response.ok) {
      console.error(`Error response from agent-parameters endpoint: ${response.status} ${response.statusText}`);
      
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
    console.error('Error proxying to agent-parameters endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 