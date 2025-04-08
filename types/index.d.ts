export interface ParameterDefinition {
    name: string;
    type: 'string' | 'number' | 'boolean';
    description?: string;
    required?: boolean;
}
export interface AgentMetadata {
    id: string;
    name: string;
    description: string;
    parameters: ParameterDefinition[];
}
export interface AgentInfo extends AgentMetadata {
    execute: (params: Record<string, any>) => Promise<any>;
}
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
export interface SuccessResponse {
    type: 'success';
    message: string;
}
export interface ErrorResponse {
    type: 'error';
    message: string;
}
export interface NeedsParametersResponse {
    type: 'needs_parameters';
    agentId: string;
    parameters: ParameterDefinition[];
}
export type OrchestratorResponse = SuccessResponse | ErrorResponse | NeedsParametersResponse;
