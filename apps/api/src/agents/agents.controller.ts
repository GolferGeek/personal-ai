import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Agent, AgentParameter } from '@personal-ai/models';
import { AgentsService } from './agents.service';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  @ApiResponse({ status: 200, description: 'List of all agents' })
  async findAll(): Promise<Agent[]> {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an agent by ID' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({ status: 200, description: 'The agent' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async findOne(@Param('id') id: string): Promise<Agent> {
    return this.agentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiBody({ type: Object, description: 'Agent creation object' })
  @ApiResponse({ status: 201, description: 'The created agent' })
  async create(@Body() createAgentDto: Omit<Agent, 'id'>): Promise<Agent> {
    return this.agentsService.create(createAgentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiBody({ type: Object, description: 'Agent update object' })
  @ApiResponse({ status: 200, description: 'The updated agent' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateAgentDto: Partial<Agent>
  ): Promise<Agent> {
    return this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({ status: 204, description: 'Agent successfully deleted' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.agentsService.delete(id);
  }

  @Get(':id/parameters')
  @ApiOperation({ summary: 'Get parameters for an agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({ status: 200, description: 'Agent parameters' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async getParameters(@Param('id') id: string): Promise<AgentParameter[]> {
    return this.agentsService.getParameters(id);
  }
} 