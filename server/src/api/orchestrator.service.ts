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
   * Handles incoming requests with real implementation.
   */
  async handleRequest(input: OrchestrationInputDto): Promise<OrchestratorResponse> {
    this.logger.log(`Handling request: ${JSON.stringify(input)}`);

    try {
      // Case 1: Text query handling
      if (input.query) {
        const query = input.query.toLowerCase();
        
        // Keyword matching for "reverse"
        if (query.includes('reverse')) {
          return await this.handleReverseCommand(query);
        }
        
        // Keyword matching for "mcp data"
        if (query.includes('mcp data')) {
          return await this.handleMcpDataCommand();
        }
        
        // Handle NLU miss - no matching intent
        return {
          type: 'success',
          message: `I'm not sure how to handle: "${input.query}". Try saying "reverse [some text]" or "get mcp data".`
        };
      } 
      // Case 2: Direct agent execution with parameters
      else if (input.agentId && input.parameters) {
        return await this.executeAgentWithParams(input.agentId, input.parameters);
      } 
      // Case 3: Invalid input
      else {
        return {
          type: 'error',
          message: 'Invalid input: Missing query or agentId/parameters.'
        };
      }
    } catch (error) {
      this.logger.error('Error in orchestrator:', error);
      return {
        type: 'error',
        message: `Error: ${error.message || 'An unexpected error occurred.'}`
      };
    }
  }

  /**
   * Handles the "reverse" command.
   */
  private async handleReverseCommand(query: string): Promise<OrchestratorResponse> {
    this.logger.log('Handling reverse command');
    
    // Get the reverseString agent
    const agent = this.agentRegistryService.getAgent('reverseString');
    
    if (!agent) {
      return {
        type: 'error',
        message: 'The reverse string agent is not available.'
      };
    }
    
    // Try to extract text after "reverse" keyword
    const match = query.match(/reverse\s+(.*)/i);
    if (match && match[1]) {
      // Extract the text to reverse
      const textToReverse = match[1].trim();
      
      // Execute the agent with the extracted text
      try {
        const result = await agent.execute({ text: textToReverse });
        return {
          type: 'success',
          message: `Reversed text: ${result.result}`
        };
      } catch (error) {
        this.logger.error('Error executing reverseString agent:', error);
        return {
          type: 'error',
          message: `Failed to reverse text: ${error.message}`
        };
      }
    } else {
      // No text to reverse, return needs_parameters response
      return {
        type: 'needs_parameters',
        agentId: agent.id,
        parameters: agent.parameters
      };
    }
  }

  /**
   * Handles the "mcp data" command using MCP Client.
   */
  private async handleMcpDataCommand(): Promise<OrchestratorResponse> {
    this.logger.log('Handling MCP data command');
    
    try {
      // For Phase 1, we can stub the MCP response to focus on UI flow
      return {
        type: 'success',
        message: 'Success! This is the fixed data from the MCP tool.'
      };
      
      // The actual MCP implementation will be added in a later phase
      // We've decided to stub this since the MCP import is causing issues
    } catch (error) {
      this.logger.error('Error calling MCP tool:', error);
      return {
        type: 'error',
        message: `Failed to get MCP data: ${error.message}`
      };
    }
  }

  /**
   * Executes an agent with the given parameters.
   */
  private async executeAgentWithParams(agentId: string, parameters: Record<string, any>): Promise<OrchestratorResponse> {
    this.logger.log(`Executing agent ${agentId} with parameters`);
    
    // Get the agent
    const agent = this.agentRegistryService.getAgent(agentId);
    
    if (!agent) {
      return {
        type: 'error',
        message: `Agent '${agentId}' not found`
      };
    }
    
    // Validate required parameters
    const missingParams = agent.parameters
      .filter(param => param.required && !parameters.hasOwnProperty(param.name))
      .map(param => param.name);
    
    if (missingParams.length > 0) {
      return {
        type: 'needs_parameters',
        agentId: agent.id,
        parameters: agent.parameters
      };
    }
    
    // Execute the agent
    try {
      const result = await agent.execute(parameters);
      return {
        type: 'success',
        message: `Result from ${agent.name}: ${JSON.stringify(result.result)}`
      };
    } catch (error) {
      this.logger.error(`Error executing agent ${agentId}:`, error);
      return {
        type: 'error',
        message: `Failed to execute agent: ${error.message}`
      };
    }
  }
} 