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

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the params
    const { params } = context;
    const id = await Promise.resolve(params.id);
    
    const headers = getForwardedHeaders(req);
    const response = await fetch(`${BACKEND_URL}/api/conversations/${id}`, {
      headers,
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to conversation endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the params
    const { params } = context;
    const id = await Promise.resolve(params.id);
    
    const headers = getForwardedHeaders(req);
    const response = await fetch(`${BACKEND_URL}/api/conversations/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to conversation endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the params
    const { params } = context;
    const id = await Promise.resolve(params.id);
    
    const body = await req.json();
    const headers = getForwardedHeaders(req);
    
    const response = await fetch(`${BACKEND_URL}/api/conversations/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to conversation endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 