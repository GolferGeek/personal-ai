import { NextRequest } from 'next/server';

// Environment-aware backend URL
export const getBackendUrl = (): string => {
  // Default to localhost in development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

/**
 * Helper function to forward necessary headers to the backend
 */
export function getForwardedHeaders(req: NextRequest): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Forward user ID if present
  const userId = req.headers.get('x-user-id');
  if (userId) {
    headers['x-user-id'] = userId;
  }
  
  // Forward authorization if present
  const authorization = req.headers.get('authorization');
  if (authorization) {
    headers['authorization'] = authorization;
  }
  
  return headers;
}

/**
 * Log request details for debugging
 */
export function logRequestDetails(
  method: string, 
  path: string, 
  body: unknown, 
  headers: HeadersInit
): void {
  console.log(`${method} ${path} - Request:`, {
    body,
    headers: Object.fromEntries(
      Object.entries(headers).map(([k, v]) => [k, typeof v === 'function' ? '[Function]' : v])
    ),
    url: `${getBackendUrl()}${path}`
  });
}

/**
 * Log error response details
 */
export async function logErrorResponse(response: Response, path: string): Promise<void> {
  console.error(`${path} - Error response:`, {
    status: response.status,
    statusText: response.statusText
  });
  
  // Try to get error details
  try {
    const errorText = await response.text();
    console.error('Error details:', errorText);
    return errorText;
  } catch (e) {
    console.error('Could not get error text');
    return '';
  }
} 