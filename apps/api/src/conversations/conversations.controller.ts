import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import {
  Conversation,
  Message,
  CreateConversationParams,
  MessageRole,
} from "@personal-ai/models";
import { ConversationsService } from "./conversations.service";

@ApiTags("conversations")
@Controller("conversations")
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: "Get all conversations" })
  @ApiResponse({ status: 200, description: "List of all conversations" })
  async findAll(): Promise<Conversation[]> {
    return this.conversationsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a conversation by ID" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiResponse({ status: 200, description: "The conversation" })
  @ApiResponse({ status: 404, description: "Conversation not found" })
  async findOne(@Param("id") id: string): Promise<Conversation> {
    return this.conversationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new conversation" })
  @ApiBody({ type: Object, description: "Conversation creation parameters" })
  @ApiResponse({ status: 201, description: "The created conversation" })
  async create(
    @Body() createConversationDto: CreateConversationParams
  ): Promise<Conversation> {
    return this.conversationsService.create(createConversationDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a conversation" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiResponse({ status: 200, description: "The updated conversation" })
  @ApiResponse({ status: 404, description: "Conversation not found" })
  async update(
    @Param("id") id: string,
    @Body() updateConversationDto: Partial<Conversation>
  ): Promise<Conversation> {
    return this.conversationsService.update(id, updateConversationDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a conversation" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiResponse({
    status: 204,
    description: "Conversation successfully deleted",
  })
  @ApiResponse({ status: 404, description: "Conversation not found" })
  async delete(@Param("id") id: string): Promise<void> {
    return this.conversationsService.delete(id);
  }

  @Get(":id/messages")
  @ApiOperation({ summary: "Get all messages for a conversation" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiResponse({
    status: 200,
    description: "List of messages for the conversation",
  })
  @ApiResponse({ status: 404, description: "Conversation not found" })
  async getMessages(@Param("id") id: string): Promise<Message[]> {
    return this.conversationsService.getMessages(id);
  }

  @Post(":id/messages")
  @ApiOperation({ summary: "Add a message to a conversation" })
  @ApiParam({ name: "id", description: "Conversation ID" })
  @ApiBody({ type: Object, description: "Message content" })
  @ApiResponse({ status: 201, description: "The created message" })
  @ApiResponse({ status: 404, description: "Conversation not found" })
  async addMessage(
    @Param("id") id: string,
    @Body() messageDto: { content: string; role: MessageRole }
  ): Promise<Message> {
    return this.conversationsService.addMessage(id, messageDto);
  }
}
