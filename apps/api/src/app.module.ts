import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConversationsModule } from "./conversations/conversations.module";
import { AgentsModule } from "./agents/agents.module";
import { OrchestrationModule } from "./orchestration/orchestration.module";
import { McpModule } from "./mcp/mcp.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConversationsModule,
    AgentsModule,
    OrchestrationModule,
    McpModule,
  ],
})
export class AppModule {}
