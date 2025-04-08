import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getForwardedHeaders, logRequestDetails, logErrorResponse } from '../../utils';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly await the entire params object
    const params = await context.params;
    const id = params.id;
    
    const headers = getForwardedHeaders(req);
    const path = `/api/conversations/${id}`;
    const backendUrl = getBackendUrl();
    
    const response = await fetch(`${backendUrl}${path}`, {
      headers,
    });
    
    if (!response.ok) {
      await logErrorResponse(response, path);
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to conversation by ID endpoint:', error);
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
    // Properly await the entire params object
    const params = await context.params;
    const id = params.id;
    
    const body = await req.json();
    const headers = getForwardedHeaders(req);
    const path = `/api/conversations/${id}`;
    const backendUrl = getBackendUrl();
    
    // Log the request details for debugging
    logRequestDetails('PATCH', path, body, headers);
    
    const response = await fetch(`${backendUrl}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      await logErrorResponse(response, path);
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to conversation PATCH endpoint:', error);
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
    // Properly await the entire params object
    const params = await context.params;
    const id = params.id;
    
    const headers = getForwardedHeaders(req);
    const path = `/api/conversations/${id}`;
    const backendUrl = getBackendUrl();
    
    // Log the request details for debugging
    logRequestDetails('DELETE', path, {}, headers);
    
    const response = await fetch(`${backendUrl}${path}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      await logErrorResponse(response, path);
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error proxying to conversation DELETE endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 