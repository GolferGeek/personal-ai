import { ParameterDefinition } from './types';

// --- Input Types ---

export type OrchestratorTextInput = {
  type: 'text';
  content: string;
  context?: any; // Optional context (e.g., conversation history)
};

export type OrchestratorParamsInput = {
  type: 'params';
  content: Record<string, any>; // Parameters provided by the user
  context?: any; // Context carrying info about the pending agent/task
};

export type OrchestratorInput = OrchestratorTextInput | OrchestratorParamsInput;

// --- Response Types ---

export type OrchestratorSuccessResponse = {
  status: 'success';
  data: any; // The result from the agent or MCP
  message?: string; // Optional display message
};

export type OrchestratorErrorResponse = {
  status: 'error';
  error: {
    code: string; // e.g., 'AGENT_NOT_FOUND', 'MCP_ERROR', 'NLU_MISS', 'VALIDATION_FAILED'
    message: string;
    details?: any;
  };
};

export type OrchestratorNeedsParametersResponse = {
  status: 'needs_parameters';
  parametersNeeded: ParameterDefinition[];
  agentId: string; // ID of the agent needing parameters
  message?: string; // Optional message explaining why params are needed
};

export type OrchestratorResponse =
  | OrchestratorSuccessResponse
  | OrchestratorErrorResponse
  | OrchestratorNeedsParametersResponse;

/**
 * Main orchestrator logic.
 * Receives user input (text or parameters) and routes to the appropriate agent or MCP.
 * For V1 Phase 2, it remains a stub.
 * @param input The user input (text or parameters).
 * @returns An OrchestratorResponse indicating success, error, or need for parameters.
 */
export async function handleRequest(input: OrchestratorInput): Promise<OrchestratorResponse> {
  console.log('Handling orchestrator request (stubbed): ', input);

  // Stub implementation: Return a simple error or default response
  if (input.type === 'text' && input.content.toLowerCase().includes('hello')) {
      return {
          status: 'success',
          data: 'Hello back to you! (Stubbed response)',
          message: 'Orchestrator received greeting.'
      }
  }

  return {
    status: 'error',
    error: {
      code: 'NLU_MISS',
      message: 'Could not understand the request (stubbed).',
    },
  };
} 