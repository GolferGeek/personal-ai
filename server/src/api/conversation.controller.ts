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
  ValidationPipe,
  Inject
} from '@nestjs/common';
import { ConversationService } from '../shared/conversation.service';
import { UserService } from '../shared/user.service';
import { MessageRole } from '../shared/models';
import { OrchestratorService } from './orchestrator.service';
import { Message } from '../shared/models';

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
    private readonly orchestratorService: OrchestratorService,
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
  async addMessage(
    @Param('id') id: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: any, // Accept any payload format
  ) {
    // Log the raw body to see what's coming in
    console.log('Received raw body:', {
      body,
      bodyType: typeof body,
      bodyIsObject: typeof body === 'object',
      bodyKeys: typeof body === 'object' ? Object.keys(body) : [],
      bodyJson: JSON.stringify(body)
    });
    
    const userId = this.getUserIdFromHeader(userIdHeader);
    const conversation = this.conversationService.getConversation(id);
    
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    // Ensure the user has access to this conversation
    if (conversation.userId !== userId) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    
    // Try multiple ways to extract content
    let content: string | undefined;
    let role: MessageRole = 'user';
    
    // Option 1: Check if body has content property
    if (body && typeof body === 'object' && 'content' in body) {
      content = String(body.content).trim();
      role = (body.role as MessageRole) || 'user';
    } 
    // Option 2: Check if body is directly the content
    else if (typeof body === 'string') {
      content = body.trim();
    }
    // Option 3: Parse JSON if body is a string that looks like JSON
    else if (typeof body === 'string' && body.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === 'object' && 'content' in parsed) {
          content = String(parsed.content).trim();
          role = (parsed.role as MessageRole) || 'user';
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    console.log('Extracted message content:', {
      content,
      contentType: typeof content,
      role
    });
    
    // Enhanced content checking
    if (!content || content.trim() === '') {
      console.error('Message content is missing or empty');
      throw new BadRequestException('Message content is required and must be a non-empty string');
    }
    
    try {
      // 1. First save the message to the conversation
      const message = this.conversationService.addMessage(
        id,
        content,
        role,
      );
      
      if (!message) {
        throw new Error('Failed to add message to conversation');
      }
      
      // 2. Then pass the message content to the orchestrator for processing
      this.logger.log(`Processing message with orchestrator: ${content}`);
      
      // NOTE: This is asynchronous - we don't await the result since we want to 
      // return quickly to the user. The orchestrator will save its response separately.
      this.orchestratorService.handleRequest({
        query: content,
        conversationId: id,
        userId
      }).then(response => {
        this.logger.log(`Orchestrator response for message: ${JSON.stringify(response)}`);
        
        // Success case - save the assistant's response to the conversation
        if (response.type === 'success' || response.type === 'error') {
          // Add assistant's response to the conversation
          const assistantMessage = this.conversationService.addMessage(
            id,
            response.message,
            'assistant'
          );
          
          this.logger.log('Added assistant response to conversation:', assistantMessage);
        }
      }).catch(error => {
        this.logger.error('Error processing message with orchestrator:', error);
      });
      
      // 3. Return the user's message immediately, don't wait for orchestrator
      return message;
    } catch (error) {
      console.error('Error in addMessage:', error);
      throw new BadRequestException(error.message || 'Failed to add message');
    }
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

  @Post(':id/messages/sync')
  async addMessageSync(
    @Param('id') id: string,
    @Body() body: any,
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
    
    let content: string = '';
    let role: MessageRole = 'user';
    
    // Option 1: Extract content from structured payload
    if (body && typeof body === 'object' && 'content' in body) {
      content = String(body.content).trim();
      role = (body.role as MessageRole) || 'user';
    }
    // Option 2: Treat entire body as content if it's a string
    else if (typeof body === 'string') {
      content = body.trim();
    }
    // Option 3: Parse JSON if body is a string that looks like JSON
    else if (typeof body === 'string' && body.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === 'object' && 'content' in parsed) {
          content = String(parsed.content).trim();
          role = (parsed.role as MessageRole) || 'user';
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    console.log('Extracted message content (sync):', {
      content,
      contentType: typeof content,
      role
    });
    
    // Enhanced content checking
    if (!content || content.trim() === '') {
      console.error('Message content is missing or empty');
      throw new BadRequestException('Message content is required and must be a non-empty string');
    }
    
    try {
      // 1. First save the message to the conversation
      const userMessage = this.conversationService.addMessage(
        id,
        content,
        role,
      );
      
      if (!userMessage) {
        throw new Error('Failed to add message to conversation');
      }
      
      this.logger.log(`Processing message with orchestrator (sync): ${content}`);
      
      // 2. Process with orchestrator and WAIT for the response
      const response = await this.orchestratorService.handleRequest({
        query: content,
        conversationId: id,
        userId
      });
      
      this.logger.log(`Orchestrator response received (sync): ${JSON.stringify(response)}`);
      
      let assistantMessage: Message | undefined = undefined;
      
      // Save the assistant's response to the conversation
      if (response.type === 'success' || response.type === 'error') {
        // Add assistant's response to the conversation
        assistantMessage = this.conversationService.addMessage(
          id,
          response.message,
          'assistant'
        );
        
        this.logger.log('Added assistant response to conversation (sync):', assistantMessage);
      }
      
      // 3. Return both the user message and assistant message
      return {
        userMessage,
        assistantMessage,
        response
      };
    } catch (error) {
      console.error('Error in addMessageSync:', error);
      throw new BadRequestException(error.message || 'Failed to process message');
    }
  }
} 