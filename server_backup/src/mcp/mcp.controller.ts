import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Sse,
  Query,
  Body,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express'; // Use Express types
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { McpService } from './mcp.service';
import { Observable, Subject, finalize } from 'rxjs';

// In-memory store for active transports (Session ID -> Transport)
// WARNING: Not suitable for multi-instance production.
const activeTransports = new Map<string, SSEServerTransport>();

// DTO for MCP messages
class McpMessageDto {
  sessionId: string;
  message: any; // The MCP message body
}

@Controller('api/mcp') // Base path /api/mcp
export class McpController {
  private readonly logger = new Logger(McpController.name);
  // Map of session IDs to SSE clients (response objects)
  private readonly connections = new Map<string, Response>();

  constructor(private readonly mcpService: McpService) {}

  /**
   * SSE endpoint for MCP connections
   */
  @Get('sse')
  async handleSseConnection(@Req() req: Request, @Res() res: Response) {
    try {
      // Generate a session ID
      const sessionId = this.generateSessionId();
      
      this.logger.log(`New SSE connection established: ${sessionId}`);
      
      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // For nginx
      
      // Send the session ID to the client
      res.write(`data: ${JSON.stringify({ sessionId })}\n\n`);
      
      // Store the response object for later use
      this.connections.set(sessionId, res);
      
      // Handle client disconnect
      req.on('close', () => {
        this.logger.log(`SSE connection closed: ${sessionId}`);
        this.connections.delete(sessionId);
      });

      // Handle server-sent events through the McpServer
      // This may vary based on the MCP SDK implementation
      try {
        const mcpServer = this.mcpService.getServerInstance();
        
        // Connect the McpServer to this transport/session
        // Implementation may vary based on MCP SDK details
        // For now, we'll use a basic connection mechanism
        
        // Example: mcpServer.registerSession(sessionId, {
        //   send: (data) => {
        //     if (this.connections.has(sessionId)) {
        //       this.connections.get(sessionId).write(`data: ${JSON.stringify(data)}\n\n`);
        //     }
        //   }
        // });
        
        // For actual implementation, refer to MCP SDK documentation
      } catch (error) {
        this.logger.error(`Error connecting MCP server to SSE transport: ${error.message}`);
        // Continue - don't close the connection, as it might work for simple messages
      }
      
    } catch (error) {
      this.logger.error('Error setting up SSE connection:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to establish SSE connection',
      });
    }
  }

  /**
   * Handles POST messages to the MCP server
   */
  @Post('messages')
  async handleMessage(@Body() messageDto: McpMessageDto) {
    try {
      const { sessionId, message } = messageDto;
      
      this.logger.log(`Received message for session ${sessionId}`);
      
      if (!this.connections.has(sessionId)) {
        throw new HttpException(`Session ${sessionId} not found`, HttpStatus.NOT_FOUND);
      }
      
      // Process the message through the MCP server
      try {
        const mcpServer = this.mcpService.getServerInstance();
        
        // Process the message according to the MCP protocol
        // Example: mcpServer.handleMessage(sessionId, message);
        
        // Return success response
        return { success: true };
      } catch (error) {
        this.logger.error(`Error processing MCP message: ${error.message}`);
        throw new HttpException(
          `Failed to process message: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('Error handling MCP message:', error);
      throw new HttpException(
        'Failed to handle message',
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
