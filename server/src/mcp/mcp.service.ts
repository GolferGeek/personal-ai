import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as path from 'path';

// Bypass typing issues for now - will need to be fixed properly later
// @ts-ignore
const { McpServer } = require(path.join(process.cwd(), 'node_modules/@modelcontextprotocol/sdk/dist/cjs/server/mcp.js'));

@Injectable()
export class McpService implements OnModuleInit {
  private readonly logger = new Logger(McpService.name);
  // Use any type to bypass TypeScript issues
  private mcpServer: any;

  constructor() {}

  async onModuleInit() {
    this.initializeMcpServer();
  }

  private initializeMcpServer(): void {
    this.logger.log('Initializing MCP Server...');

    const serverName = 'PersonalAI-MCPServer';
    const serverVersion = '1.0.0';

    try {
      // Use any type constructor to bypass type checking
      this.mcpServer = new McpServer({
        name: serverName,
        version: serverVersion,
      });

      this.registerToolHandlers();
      this.logger.log(`MCP Server initialized: ${serverName} v${serverVersion}`);
    } catch (error) {
      this.logger.error('Failed to initialize MCP Server:', error);
      // Continue initialization even if MCP fails
      // In a production environment, you might want to fail hard here
    }
  }

  private registerToolHandlers(): void {
    if (!this.mcpServer) {
      this.logger.warn('Cannot register tool handlers - MCP Server not initialized');
      return;
    }

    this.logger.log('Registering MCP tool handlers...');

    try {
      // Register tool using the tool method (bypassing type checking)
      this.mcpServer.tool(
        'get_fixed_data', 
        'Returns a fixed predefined string.',
        async () => {
          this.logger.log('📡 MCP TOOL CALLED: get_fixed_data');
          this.logger.log('🔄 Processing MCP tool request...');
          
          // Simulate some processing time
          await new Promise(resolve => setTimeout(resolve, 100));
          
          this.logger.log('✅ MCP tool executed successfully');
          
          return {
            content: [
              {
                type: 'text',
                text: 'Success! This is the fixed data from the MCP tool.',
              },
            ],
          };
        }
      );

      this.logger.log('Registered tool handler: get_fixed_data');
    } catch (error) {
      this.logger.error('Failed to register tool handler:', error);
    }
  }

  /**
   * Provides access to the underlying McpServer instance.
   * This might be needed by the McpController to connect transports.
   * @returns The McpServer instance.
   */
  getServerInstance(): any {
    if (!this.mcpServer) {
      this.logger.error('MCP Server instance accessed before initialization!');
      throw new Error('MCP Server not initialized');
    }
    return this.mcpServer;
  }
} 