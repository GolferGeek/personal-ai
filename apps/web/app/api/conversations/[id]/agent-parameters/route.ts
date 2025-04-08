import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getForwardedHeaders, logRequestDetails, logErrorResponse } from '../../../utils';

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
    const path = `/api/conversations/${id}/agent-parameters`;
    const backendUrl = getBackendUrl();
    
    // Log the request details for debugging
    logRequestDetails('POST', path, body, headers);
    
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
    console.log('Success response from agent-parameters endpoint:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to agent-parameters endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 