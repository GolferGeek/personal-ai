import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe, // Or ParseIntPipe if IDs are numbers
  UsePipes,
  ValidationPipe,
  HttpException,
  Logger,
} from '@nestjs/common';
import { AgentRegistryService } from '../shared/agent-registry.service';
import { AgentMetadata, ParameterDefinition, OrchestratorInput } from '@/types';
import { IsObject, IsOptional, IsString, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrchestratorService, OrchestrationInputDto } from './orchestrator.service';
import { OrchestratorResponse } from '@/types';

// --- DTOs for Request Validation ---
class AgentExecutionParamsDto {
  @IsObject()
  @IsOptional() // Parameters might be optional for some agents
  parameters?: Record<string, any>;
}

// DTO for the Orchestrate endpoint body
class OrchestrateInputDto {
  @IsEnum(['text', 'params'])
  type: 'text' | 'params';

  @IsString() // Base validation, needs refinement
  // TODO: Add custom validation logic here to check content type based on 'type' field
  content: any;

  @IsObject()
  @IsOptional()
  context?: any;
}

// DTO for direct agent execution
class AgentExecutionDto {
  // Will hold agent parameters (any valid JSON)
  [key: string]: any;
}

// --- Controller ---

@Controller('api') // Base path for this controller
export class ApiController {
  private readonly logger = new Logger(ApiController.name);

  constructor(
    private readonly agentRegistry: AgentRegistryService,
    private readonly orchestratorService: OrchestratorService, // Inject OrchestratorService
  ) {}

  @Get('agents')
  async listAgents(): Promise<AgentMetadata[]> {
    try {
      this.logger.log('Listing all agents');
      const agents = await this.agentRegistry.listAgents();
      return agents.map(({ execute, ...metadata }) => metadata);
    } catch (error) {
      this.logger.error('Error listing agents:', error);
      throw new HttpException('Failed to retrieve agents', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('agents/:agentId')
  async getAgentMetadata(@Param('agentId') agentId: string): Promise<AgentMetadata> {
    try {
      this.logger.log(`Getting agent: ${agentId}`);
      const agentInfo = await this.agentRegistry.getAgent(agentId);
      if (!agentInfo) {
        throw new HttpException(`Agent '${agentId}' not found`, HttpStatus.NOT_FOUND);
      }
      const { execute, ...metadata } = agentInfo;
      return metadata;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error getting agent ${agentId}:`, error);
      throw new HttpException('Failed to retrieve agent metadata', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('agents/:agentId')
  @HttpCode(HttpStatus.OK) // Set default success code to 200
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) // Apply validation pipe
  async executeAgent(
    @Param('agentId') agentId: string,
    @Body() body: AgentExecutionDto,
  ): Promise<{ result: any }> {
    try {
      this.logger.log(`Executing agent ${agentId} with params:`, body);
      const agentInfo = await this.agentRegistry.getAgent(agentId);
      if (!agentInfo) {
        throw new HttpException(`Agent '${agentId}' not found`, HttpStatus.NOT_FOUND);
      }

      // Perform basic validation of required parameters
      const missingParams = agentInfo.parameters
        .filter(param => param.required && !body.hasOwnProperty(param.name))
        .map(param => param.name);
      
      if (missingParams.length > 0) {
        throw new HttpException(
          `Missing required parameters: ${missingParams.join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await agentInfo.execute(body);
      return { result };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error executing agent ${agentId}:`, error);
      throw new HttpException(
        `Failed to execute agent: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('orchestrate')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Apply validation
  async orchestrate(@Body() input: OrchestrationInputDto): Promise<OrchestratorResponse> {
    try {
      this.logger.log('Orchestrating request:', input);
      return await this.orchestratorService.handleRequest(input);
    } catch (error) {
      this.logger.error('Error orchestrating request:', error);
      throw new HttpException(
        `Orchestration failed: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
