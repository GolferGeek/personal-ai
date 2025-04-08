import { NextResponse } from 'next/server';
import { listAgents } from '@/lib/agentRegistry'; // Use path alias

/**
 * GET handler for /api/agents
 * Returns metadata for all registered agents.
 */
export async function GET(request: Request) {
  console.log('GET /api/agents called');
  try {
    // Ensure the registry is initialized and get the list of agent metadata
    const agentsMetadata = await listAgents();

    console.log(`Returning ${agentsMetadata.length} agents.`);
    return NextResponse.json(agentsMetadata);

  } catch (error) {
    console.error('Error fetching agent list:', error);
    // Return a generic server error response
    return NextResponse.json(
      { error: 'Failed to retrieve agent list.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests if necessary (good practice)
export async function OPTIONS(request: Request) {
  // In a real app, configure allowed origins, methods, headers more strictly
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow any origin (adjust in production)
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow relevant methods
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow relevant headers
    },
  });
} 