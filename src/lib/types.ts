// Defines the structure for a parameter required by an agent
export interface ParameterDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean'; // Extendable type system
  required: boolean;
  description: string;
  control: 'textInput' | 'numberInput' | 'switch' | 'select'; // Defines UI control type
  options?: string[]; // For 'select' control type
}

// Defines the metadata structure for an agent
export interface AgentMetadata {
  id: string; // Unique identifier for the agent
  name: string;
  description: string;
  parameters: ParameterDefinition[];
  // Potentially add category, version, etc. later
}

// Represents the full information about an agent, including its execution logic
// (Execution logic will be defined later)
export interface AgentInfo extends AgentMetadata {
  execute: (params: Record<string, any>) => Promise<any>; // Placeholder for execution function
} 