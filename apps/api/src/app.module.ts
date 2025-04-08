import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConversationsModule } from './conversations/conversations.module';
import { AgentsModule } from './agents/agents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConversationsModule,
    AgentsModule,
  ],
})
export class AppModule {} 