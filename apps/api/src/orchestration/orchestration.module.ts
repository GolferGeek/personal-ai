import { Module } from "@nestjs/common";
import { OrchestrationController } from "./orchestration.controller";
import { OrchestrationService } from "./orchestration.service";
import { ConversationsModule } from "../conversations/conversations.module";
import { AgentsModule } from "../agents/agents.module";
import { McpModule } from "../mcp/mcp.module";

@Module({
  imports: [ConversationsModule, AgentsModule, McpModule],
  controllers: [OrchestrationController],
  providers: [OrchestrationService],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}
