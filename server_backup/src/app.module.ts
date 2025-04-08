import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { McpModule } from './mcp/mcp.module';

@Module({
  imports: [ApiModule, McpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
