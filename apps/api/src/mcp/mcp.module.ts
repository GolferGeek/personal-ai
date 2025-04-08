import { Module } from "@nestjs/common";
import { McpService } from "./mcp.service";
import { McpController } from "./mcp.controller";

@Module({
  controllers: [McpController],
  providers: [McpService],
  exports: [McpService], // Export service to make McpServer instance accessible
})
export class McpModule {}
