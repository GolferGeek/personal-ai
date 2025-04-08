// Shared type definitions for the Personal AI project

/**
 * Defines a parameter required by an agent.
 */
export interface ParameterDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean'; // Expand with other types like 'date', 'enum' etc. as needed
  description?: string;
  required?: boolean;
  // Add constraints like min, max, pattern, enum values etc. if required
}

/**
 * Metadata describing an agent.
 */
export interface AgentMetadata {
  id: string; // Unique identifier for the agent
  name: string;
  description: string;
  parameters: ParameterDefinition[];
}

/**
 * Represents the structure for executing an agent's logic.
 */
export interface AgentInfo extends AgentMetadata {
  // The function that executes the agent's core logic.
  // It receives validated parameters and should return a result or throw an error.
  execute: (params: Record<string, any>) => Promise<any>; // Result can be any serializable value
}

// === Orchestrator Types ===

export type OrchestratorTextInput = {
  type: 'text';
  content: string;
  context?: any;
};

export type OrchestratorParamsInput = {
  type: 'params';
  content: Record<string, any>;
  context?: any;
};

export type OrchestratorInput = OrchestratorTextInput | OrchestratorParamsInput;

// --- Orchestrator Response Types --- 

export interface BaseResponse {
  conversationId?: string; // ID of the conversation this response belongs to
}

export interface SuccessResponse extends BaseResponse {
  type: 'success';
  message: string; // The final response message for the user
  // Optional: Add raw agent result if needed
  // agentResult?: any;
}

export interface ErrorResponse extends BaseResponse {
  type: 'error';
  message: string; // Error message to display to the user
  // Optional: Add error details for logging
  // errorDetails?: string;
}

export interface NeedsParametersResponse extends BaseResponse {
  type: 'needs_parameters';
  agentId: string;
  parameters: ParameterDefinition[]; // The parameters required by the agent
}

/**
 * Union type for all possible responses from the orchestrator.
 */
export type OrchestratorResponse = SuccessResponse | ErrorResponse | NeedsParametersResponse; 