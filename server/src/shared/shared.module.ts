import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConversationService } from './conversation.service';

@Module({
  providers: [UserService, ConversationService],
  exports: [UserService, ConversationService],
})
export class SharedModule {} 