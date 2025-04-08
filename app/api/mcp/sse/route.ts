import { NextRequest, NextResponse } from 'next/server';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { mcpServer } from '@/lib/mcpServerInstance'; // Import the shared server instance

// In-memory store for active transports (Session ID -> Transport)
// WARNING: This is not suitable for production environments with multiple server instances.
// A more robust solution (e.g., using Redis or another shared store) would be needed.
const activeTransports = new Map<string, SSEServerTransport>();

/**
 * GET handler for /api/mcp/sse
 * Establishes a Server-Sent Events connection for an MCP client.
 */
export async function GET(request: NextRequest) {
  console.log('GET /api/mcp/sse called - establishing MCP connection...');

  // The SSEServerTransport requires a Response object to stream to.
  // In Next.js App Router, we create a ReadableStream and return a Response based on it.

  const stream = new ReadableStream({
    start(controller) {
      // Create the transport *inside* the stream logic
      // The message endpoint path needs to be absolute or relative to the client's perspective
      const messageEndpoint = '/api/mcp/messages'; // Relative path for client
      const transport = new SSEServerTransport(messageEndpoint, controller);

      const sessionId = transport.sessionId;
      activeTransports.set(sessionId, transport);
      console.log(`MCP SSE Transport created for session: ${sessionId}`);

      // Connect the server instance to this specific transport
      // Run this asynchronously, don't await it here as start() should not block
      mcpServer.connect(transport).catch(error => {
        console.error(`Error connecting McpServer to transport for session ${sessionId}:`, error);
        // Attempt to close the controller if an error occurs during connection
        try {
            controller.error(error);
        } catch { /* Ignore if controller already closed */ }
      });

      // Return a cleanup function for when the stream is cancelled/closed
      return () => {
        console.log(`MCP SSE connection closing for session: ${sessionId}`);
        activeTransports.delete(sessionId);
        // Attempt to close the transport if it has a close method (it should)
        transport.close?.();
        console.log(`Transport closed and removed for session: ${sessionId}`);
      };
    },
    cancel(reason) {
        console.log('MCP SSE Stream cancelled:', reason);
        // Cleanup logic is handled in the return function from start()
    }
  });

  // Return the response with appropriate headers for SSE
  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      // Add CORS headers if your client is on a different origin
      'Access-Control-Allow-Origin': '*', // Adjust in production
    },
  });
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 