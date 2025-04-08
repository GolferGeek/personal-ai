import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { AgentRegistryService } from '../shared/agent-registry.service';
import { ApiController } from './api.controller';
import { ConversationController } from './conversation.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ApiController, ConversationController],
  providers: [OrchestratorService, AgentRegistryService],
  exports: [OrchestratorService]
})
export class ApiModule {}
