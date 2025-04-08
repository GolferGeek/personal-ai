import { NextResponse } from 'next/server';
import { getAgent } from '@/lib/agentRegistry';
import { AgentInfo, ParameterDefinition } from '@/lib/types';

// Define the expected structure for the POST request body
interface AgentExecutionRequestBody {
  parameters: Record<string, any>;
}

/**
 * GET handler for /api/agents/[agentId]
 * Returns metadata for a specific agent.
 */
export async function GET(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  const agentId = params.agentId;
  console.log(`GET /api/agents/${agentId} called`);

  try {
    const agentInfo = await getAgent(agentId);

    if (!agentInfo) {
      return NextResponse.json({ error: `Agent with ID '${agentId}' not found.` }, { status: 404 });
    }

    // Return only the metadata part
    const { execute, ...metadata } = agentInfo;
    return NextResponse.json(metadata);

  } catch (error) {
    console.error(`Error fetching agent ${agentId} metadata:`, error);
    return NextResponse.json(
      { error: 'Failed to retrieve agent metadata.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for /api/agents/[agentId]
 * Executes a specific agent with provided parameters.
 */
export async function POST(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  const agentId = params.agentId;
  console.log(`POST /api/agents/${agentId} called`);

  let requestBody: AgentExecutionRequestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body. Expected JSON.' }, { status: 400 });
  }

  const providedParams = requestBody.parameters || {};

  try {
    const agentInfo = await getAgent(agentId);

    if (!agentInfo) {
      return NextResponse.json({ error: `Agent with ID '${agentId}' not found.` }, { status: 404 });
    }

    // --- Basic Input Validation ---
    const validationErrors: string[] = [];
    const validatedParams: Record<string, any> = {};

    agentInfo.parameters.forEach((paramDef: ParameterDefinition) => {
      const value = providedParams[paramDef.name];

      // Check required parameters
      if (paramDef.required && (value === undefined || value === null || value === '')) {
        validationErrors.push(`Parameter '${paramDef.name}' is required.`);
        return; // No further checks if required param is missing
      }

      // Check type (simple check for V1)
      if (value !== undefined && typeof value !== paramDef.type) {
        // Allow number type to be provided as string if convertible for flexibility?
        // For now, strict check.
        validationErrors.push(`Parameter '${paramDef.name}' should be type '${paramDef.type}', but received type '${typeof value}'.`);
      }

      // Add to validated params if present (even if optional and undefined)
      validatedParams[paramDef.name] = value;
    });

    // Check for extra parameters not defined in metadata
    Object.keys(providedParams).forEach(providedKey => {
        if (!agentInfo.parameters.some(p => p.name === providedKey)) {
            console.warn(`Received unexpected parameter '${providedKey}' for agent '${agentId}'`);
            // Decide whether to ignore or reject - let's ignore for now
        }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Input validation failed.', details: validationErrors },
        { status: 400 }
      );
    }
    // --- End Validation ---

    console.log(`Executing agent '${agentId}' with params:`, validatedParams);
    const result = await agentInfo.execute(validatedParams);

    console.log(`Agent '${agentId}' executed successfully.`);
    return NextResponse.json({ result });

  } catch (error: any) {
    console.error(`Error executing agent ${agentId}:`, error);
    // Check if it's an error thrown by the agent's validation/execution logic
    if (error instanceof Error && error.message.startsWith('Invalid input:')) {
         return NextResponse.json(
            { error: 'Agent execution failed due to invalid input.', details: error.message },
            { status: 400 }
         );
    }
    // Otherwise, assume a server error
    return NextResponse.json(
      { error: 'Failed to execute agent.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 