import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { AgentRegistryService } from '../shared/agent-registry.service';
import { ApiController } from './api.controller';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [OrchestratorService, AgentRegistryService],
  exports: [OrchestratorService]
})
export class ApiModule {}
