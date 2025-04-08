import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getForwardedHeaders, logRequestDetails, logErrorResponse } from '../utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headers = getForwardedHeaders(req);
    const path = '/api/orchestrate';
    const backendUrl = getBackendUrl();
    
    // Log request for debugging
    logRequestDetails('POST', path, body, headers);
    
    // Make sure we have all parameters needed for the orchestrator
    const payload = {
      ...body
    };
    
    // If this is an agent parameter request, add input and conversationId if not present
    if (body.agentId && body.parameters) {
      if (!payload.input) {
        payload.input = `Running ${body.agentId} agent with parameters`;
      }
    }
    
    const response = await fetch(`${backendUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      await logErrorResponse(response, path);
      return NextResponse.json(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Orchestrator success response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to orchestrator endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
} 