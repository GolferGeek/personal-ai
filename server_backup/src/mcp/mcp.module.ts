import { Module } from '@nestjs/common';
import { McpService } from './mcp.service';
import { McpController } from './mcp.controller';
// Import McpController when created in Phase 4

@Module({
  controllers: [McpController],
  providers: [McpService],
  exports: [McpService] // Export service to make McpServer instance accessible
})
export class McpModule {}
