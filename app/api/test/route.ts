import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:3001';

export async function GET() {
  try {
    // Test the connection to the backend
    const response = await fetch(`${BACKEND_URL}/api/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const backendStatus = response.ok 
      ? `Backend accessible on ${BACKEND_URL} (status ${response.status})` 
      : `Backend returned error: ${response.status} ${response.statusText}`;
    
    let backendData = null;
    try {
      if (response.ok) {
        backendData = await response.json();
      }
    } catch (e) {
      console.error('Error parsing backend response:', e);
    }
    
    // Return diagnostic information
    return NextResponse.json({
      nextjs: {
        status: 'ok',
        url: process.env.VERCEL_URL || 'http://localhost:3000'
      },
      backend: {
        status: response.ok ? 'ok' : 'error',
        statusCode: response.status,
        statusText: response.statusText,
        url: BACKEND_URL,
        data: backendData
      },
      env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '(not set)',
      }
    });
  } catch (error: any) {
    console.error('Test endpoint error:', error);
    
    return NextResponse.json({
      nextjs: {
        status: 'ok',
        url: process.env.VERCEL_URL || 'http://localhost:3000'
      },
      backend: {
        status: 'connection_error',
        error: error.message || 'Unknown error',
        url: BACKEND_URL
      },
      env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '(not set)',
      }
    }, { status: 500 });
  }
} 