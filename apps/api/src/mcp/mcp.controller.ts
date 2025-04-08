import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { McpService } from "./mcp.service";

// DTO for MCP API requests
class McpApiRequestDto {
  task_id: string;
  params?: Record<string, any>;
}

// DTO for MCP messages
class McpMessageDto {
  sessionId: string;
  message: any; // The MCP message body
}

@Controller("api/mcp")
export class McpController {
  private readonly logger = new Logger(McpController.name);
  // Map of session IDs to SSE clients (response objects)
  private readonly connections = new Map<string, Response>();

  constructor(private readonly mcpService: McpService) {}

  /**
   * Simple HTTP API for MCP tasks
   * This follows the simplified JSON protocol defined for V1
   */
  @Post()
  async handleApiRequest(@Body() request: McpApiRequestDto) {
    this.logger.log(`Received MCP API request: ${request.task_id}`);

    if (!request.task_id) {
      throw new BadRequestException("Missing task_id in request");
    }

    try {
      const result = await this.mcpService.processTask(
        request.task_id,
        request.params || {}
      );
      return result;
    } catch (error) {
      this.logger.error("Error processing MCP API request");
      throw new InternalServerErrorException("Failed to process MCP request");
    }
  }

  /**
   * SSE endpoint for MCP connections
   * This is a simplified version that only returns a session ID for now
   */
  @Get("sse")
  async handleSseConnection(@Req() req: Request, @Res() res: Response) {
    try {
      // Generate a session ID
      const sessionId = this.generateSessionId();

      this.logger.log(`New SSE connection established: ${sessionId}`);

      // Set up SSE headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no"); // For nginx

      // Send the session ID to the client
      res.write(`data: ${JSON.stringify({ sessionId })}\n\n`);

      // Store the response object for later use
      this.connections.set(sessionId, res);

      // Handle client disconnect
      req.on("close", () => {
        this.logger.log(`SSE connection closed: ${sessionId}`);
        this.connections.delete(sessionId);
      });
    } catch (error) {
      this.logger.error("Error setting up SSE connection:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to establish SSE connection",
      });
    }
  }

  /**
   * Handles POST messages to the MCP server
   */
  @Post("messages")
  async handleMessage(@Body() messageDto: McpMessageDto) {
    try {
      const { sessionId, message } = messageDto;

      this.logger.log(`Received message for session ${sessionId}`);

      if (!this.connections.has(sessionId)) {
        throw new HttpException(
          `Session ${sessionId} not found`,
          HttpStatus.NOT_FOUND
        );
      }

      // For simplicity in the initial version, just acknowledge the message
      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error("Error handling MCP message");
      throw new HttpException(
        "Failed to handle message",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Generates a simple session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
