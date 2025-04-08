import { Injectable, Logger } from '@nestjs/common';
import { AgentRegistryService } from '../shared/agent-registry.service';
import {
  OrchestratorResponse,
  SuccessResponse,
  ErrorResponse,
  NeedsParametersResponse,
  ParameterDefinition,
} from '../../../types';

// --- Input DTO --- 
export class OrchestrationInputDto {
  query?: string;
  agentId?: string;
  parameters?: Record<string, any>;
}
// --- End Input DTO ---

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);

  constructor(private agentRegistryService: AgentRegistryService) {}

  /**
   * Handles incoming requests (stubbed).
   */
  async handleRequest(input: OrchestrationInputDto): Promise<OrchestratorResponse> {
    this.logger.log(`Handling request: ${JSON.stringify(input)}`);

    // --- Stubbed Logic (Phase 2) --- 
    if (input.query) {
      if (input.query.toLowerCase().includes('reverse')) {
        const agent = this.agentRegistryService.getAgent('reverseStringAgent'); 
        // Check existence and parameter count
        if (agent?.parameters?.length && agent.parameters.length > 0) { 
          this.logger.log('Simulating \'needs_parameters\' response for query:', input.query);
          const response: NeedsParametersResponse = {
            type: 'needs_parameters',
            agentId: agent.id,
            parameters: agent.parameters,
          };
          return response;
        } else {
          // Simulate success if agent exists but has no params, or if agent doesn't exist yet
          this.logger.log('Simulating direct success response for query:', input.query);
          const response: SuccessResponse = {
             type: 'success',
             message: `(Stub) Received query: "${input.query}"`
          };
          return response;
        }
      } else {
        this.logger.log('Simulating generic success response for query:', input.query);
        const response: SuccessResponse = {
          type: 'success',
          message: `(Stub) You said: "${input.query}"`,
        };
        return response;
      }
    } else if (input.agentId && input.parameters) {
      this.logger.log(
        `Simulating success response after receiving parameters for agent: ${input.agentId}`,
      );
      const response: SuccessResponse = {
        type: 'success',
        message: `(Stub) Parameters received for ${input.agentId}: ${JSON.stringify(input.parameters)}`,
      };
      return response;
    } else {
      this.logger.error('Invalid input received by orchestrator:', input);
      const response: ErrorResponse = {
        type: 'error',
        message: 'Invalid input: Missing query or agentId/parameters.',
      };
      return response;
    }
    // --- End Stubbed Logic --- 
  }
} 