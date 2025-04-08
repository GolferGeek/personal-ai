import { NextRequest, NextResponse } from 'next/server';

// Fixed backend URL - we know it's running on port 3001
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

export async function GET(req: NextRequest) {
  try {
    const headers = getForwardedHeaders(req);
    const response = await fetch(`${BACKEND_URL}/api/conversations`, {
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
    console.error('Error proxying to conversations endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headers = getForwardedHeaders(req);
    
    // Log the request details for debugging
    console.log('POST /api/conversations - Request:', {
      body,
      headers: Object.fromEntries(
        Object.entries(headers).map(([k, v]) => [k, typeof v === 'function' ? '[Function]' : v])
      ),
      url: `${BACKEND_URL}/api/conversations`
    });
    
    const response = await fetch(`${BACKEND_URL}/api/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      // Log the error response
      console.error('POST /api/conversations - Error response:', {
        status: response.status,
        statusText: response.statusText
      });
      
      // Try to get error details
      try {
        const errorText = await response.text();
        console.error('Error details:', errorText);
      } catch (e) {
        console.error('Could not get error text');
      }
      
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('POST /api/conversations - Success response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to conversations endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 