import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Message } from '@personal-ai/models';
import { OrchestrationService } from './orchestration.service';

@ApiTags('orchestration')
@Controller('orchestration')
export class OrchestrationController {
  constructor(private readonly orchestrationService: OrchestrationService) {}

  @Post('conversations/:id/generate')
  @ApiOperation({ summary: 'Generate a response from the AI' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiBody({ type: Object, description: 'User message' })
  @ApiResponse({ status: 200, description: 'The generated AI response' })
  async generateResponse(
    @Param('id') conversationId: string,
    @Body() body: { message: string }
  ): Promise<Message> {
    return this.orchestrationService.generateResponse(conversationId, body.message);
  }

  @Get('agents/summary')
  @ApiOperation({ summary: 'Get a summary of available agents' })
  @ApiResponse({ status: 200, description: 'Summary of available agents' })
  async getAgentsSummary(): Promise<{ count: number; agents: Array<{ id: string; name: string }> }> {
    return this.orchestrationService.getAgentsSummary();
  }
} 