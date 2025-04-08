import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getForwardedHeaders, logRequestDetails, logErrorResponse } from '../../../utils';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the entire params object
    const params = await context.params;
    const id = params.id;
    
    const headers = getForwardedHeaders(req);
    const path = `/api/conversations/${id}/messages`;
    const backendUrl = getBackendUrl();
    
    // Log the request for debugging
    console.log(`GET request to ${path}`);
    
    const response = await fetch(`${backendUrl}${path}`, {
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
    const path = `/api/conversations/${id}/messages`;
    const backendUrl = getBackendUrl();
    
    // First check if the conversation exists
    console.log(`Verifying conversation exists: ${id}`);
    const checkResponse = await fetch(`${backendUrl}/api/conversations/${id}`, {
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
    
    // Get the request body
    const body = await req.json();
    logRequestDetails('POST', path, body, headers);
    
    // Send the message
    const response = await fetch(`${backendUrl}${path}`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      await logErrorResponse(response, path);
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