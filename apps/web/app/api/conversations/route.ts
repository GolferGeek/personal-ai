import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getForwardedHeaders, logRequestDetails, logErrorResponse } from '../utils';

export async function GET(req: NextRequest) {
  try {
    const headers = getForwardedHeaders(req);
    const path = '/api/conversations';
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
    const path = '/api/conversations';
    const backendUrl = getBackendUrl();
    
    // Log the request details for debugging
    logRequestDetails('POST', path, body, headers);
    
    const response = await fetch(`${backendUrl}${path}`, {
      method: 'POST',
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