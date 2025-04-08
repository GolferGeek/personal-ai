import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Logger, 
  NotFoundException, 
  BadRequestException,
  Headers,
  Patch,
  ValidationPipe
} from '@nestjs/common';
import { ConversationService } from '../shared/conversation.service';
import { UserService } from '../shared/user.service';
import { MessageRole } from '../shared/models';

class CreateConversationDto {
  title?: string;
}

class AddMessageDto {
  content: string;
  role?: MessageRole;  // Make role optional with default value applied in controller
}

class UpdateConversationDto {
  title: string;
}

@Controller('api/conversations')
export class ConversationController {
  private readonly logger = new Logger(ConversationController.name);

  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
  ) {}

  private getUserIdFromHeader(userIdHeader: string): string {
    if (userIdHeader) {
      return userIdHeader;
    }
    
    // Create anonymous user if no user ID provided
    const newUser = this.userService.createAnonymousUser();
    this.logger.log(`Created new anonymous user: ${newUser.id}`);
    return newUser.id;
  }

  @Get()
  listConversations(
    @Headers('x-user-id') userIdHeader: string,
    @Body('query') query?: string,
  ) {
    const userId = this.getUserIdFromHeader(userIdHeader);
    
    if (query) {
      return this.conversationService.searchConversations(userId, query);
    }
    
    return this.conversationService.listConversationsForUser(userId);
  }

  @Get(':id')
  getConversation(
    @Param('id') id: string,
    @Headers('x-user-id') userIdHeader: string,
  ) {
    const userId = this.getUserIdFromHeader(userIdHeader);
    const conversation = this.conversationService.getConversation(id);
    
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    // Ensure the user has access to this conversation
    if (conversation.userId !== userId) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    const messages = this.conversationService.getMessagesForConversation(id);
    
    return {
      conversation,
      messages,
    };
  }

  @Post()
  createConversation(
    @Headers('x-user-id') userIdHeader: string,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    const userId = this.getUserIdFromHeader(userIdHeader);
    const { title } = createConversationDto;
    
    const conversation = this.conversationService.createConversation(
      userId,
      title,
    );
    
    return conversation;
  }

  @Patch(':id')
  updateConversation(
    @Param('id') id: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    const userId = this.getUserIdFromHeader(userIdHeader);
    const conversation = this.conversationService.getConversation(id);
    
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    // Ensure the user has access to this conversation
    if (conversation.userId !== userId) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    return this.conversationService.updateConversationTitle(
      id,
      updateConversationDto.title,
    );
  }

  @Delete(':id')
  deleteConversation(
    @Param('id') id: string,
    @Headers('x-user-id') userIdHeader: string,
  ) {
    const userId = this.getUserIdFromHeader(userIdHeader);
    const conversation = this.conversationService.getConversation(id);
    
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    // Ensure the user has access to this conversation
    if (conversation.userId !== userId) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    const deleted = this.conversationService.deleteConversation(id);
    
    if (!deleted) {
      throw new BadRequestException(`Failed to delete conversation with ID ${id}`);
    }
    
    return { success: true };
  }

  @Post(':id/messages')
  addMessage(
    @Param('id') id: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() addMessageDto: AddMessageDto,
  ) {
    const userId = this.getUserIdFromHeader(userIdHeader);
    const conversation = this.conversationService.getConversation(id);
    
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    // Ensure the user has access to this conversation
    if (conversation.userId !== userId) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    if (!addMessageDto.content) {
      throw new BadRequestException('Message content is required');
    }
    
    const message = this.conversationService.addMessage(
      id,
      addMessageDto.content,
      addMessageDto.role || 'user',
    );
    
    return message;
  }

  @Get(':id/messages')
  getMessages(
    @Param('id') id: string,
    @Headers('x-user-id') userIdHeader: string,
  ) {
    const userId = this.getUserIdFromHeader(userIdHeader);
    const conversation = this.conversationService.getConversation(id);
    
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    // Ensure the user has access to this conversation
    if (conversation.userId !== userId) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    return this.conversationService.getMessagesForConversation(id);
  }
} 