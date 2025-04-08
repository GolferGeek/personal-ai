import { NextRequest } from 'next/server';

// The backend might be on a different port if 3001 is already in use
export async function getBackendUrl(): Promise<string> {
  // Try multiple ports, starting with the default
  const backendPorts = [3001, 3003, 3004, 3005];
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
  
  for (const port of backendPorts) {
    try {
      const response = await fetch(`${baseUrl}:${port}/api/agents`, {
        method: 'HEAD',
        // Short timeout to quickly move to the next port if this one doesn't respond
        signal: AbortSignal.timeout(500),
      });
      
      if (response.ok) {
        return `${baseUrl}:${port}`;
      }
    } catch (error) {
      // Continue to next port
      console.log(`Backend not available on port ${port}, trying next port...`);
    }
  }
  
  // Default fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

// Cache the backend URL once found
let cachedBackendUrl: string | null = null;

export async function getActiveBackendUrl(): Promise<string> {
  if (!cachedBackendUrl) {
    cachedBackendUrl = await getBackendUrl();
  }
  return cachedBackendUrl;
}

// Helper function to forward headers
export function getForwardedHeaders(req: NextRequest): HeadersInit {
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