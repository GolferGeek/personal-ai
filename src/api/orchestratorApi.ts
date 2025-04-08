import { ParameterDefinition } from '../../types';
import { getUserId } from './utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types for orchestrator API
export type OrchestratorSuccessResponse = {
  type: 'success';
  message: string;
  conversationId?: string;
};

export type OrchestratorErrorResponse = {
  type: 'error';
  message: string;
  conversationId?: string;
};

export type OrchestratorNeedsParametersResponse = {
  type: 'needs_parameters';
  agentId: string;
  parameters: ParameterDefinition[];
  conversationId?: string;
};

export type OrchestratorResponse = 
  | OrchestratorSuccessResponse 
  | OrchestratorErrorResponse 
  | OrchestratorNeedsParametersResponse;

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }
  return response.json();
};

// Orchestrator API methods
export const orchestratorApi = {
  // Send a query to the orchestrator
  async sendQuery(
    query: string, 
    conversationId?: string
  ): Promise<OrchestratorResponse> {
    const response = await fetch(`${API_BASE_URL}/api/orchestrate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
      body: JSON.stringify({ 
        query,
        conversationId
      }),
    });
    return handleResponse(response);
  },

  // Send parameters to the orchestrator for an agent
  async sendParameters(
    agentId: string, 
    parameters: Record<string, any>,
    conversationId?: string
  ): Promise<OrchestratorResponse> {
    const response = await fetch(`${API_BASE_URL}/api/orchestrate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId(),
      },
      body: JSON.stringify({ 
        agentId, 
        parameters,
        conversationId 
      }),
    });
    return handleResponse(response);
  },

  // List available agents
  async listAgents(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/agents`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Get agent details by ID
  async getAgent(agentId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
}; 