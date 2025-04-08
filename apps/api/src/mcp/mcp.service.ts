import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

@Injectable()
export class McpService implements OnModuleInit {
  private readonly logger = new Logger(McpService.name);
  private mcpServer: any; // Using any type to avoid issues with MCP SDK types

  constructor() {}

  /**
   * Initialize the MCP server when the module is initialized
   */
  async onModuleInit() {
    this.initializeMcpServer();
  }

  /**
   * Initialize the MCP server with the necessary configuration
   */
  private initializeMcpServer(): void {
    this.logger.log("Initializing MCP Server...");

    const serverName = "PersonalAI-MCPServer";
    const serverVersion = "1.0.0";

    try {
      this.mcpServer = new McpServer({
        name: serverName,
        version: serverVersion,
        capabilities: {
          tools: {},
          // resources: {}, // Not used in V1
          // prompts: {},   // Not used in V1
        },
      });

      this.registerToolHandlers();
      this.logger.log(
        `MCP Server initialized: ${serverName} v${serverVersion}`
      );
    } catch (error) {
      this.logger.error("Failed to initialize MCP Server:", error);
      // Continue initialization even if MCP fails
      // In a production environment, you might want to fail hard here
    }
  }

  /**
   * Register tool handlers with the MCP server
   */
  private registerToolHandlers(): void {
    if (!this.mcpServer) {
      this.logger.warn(
        "Cannot register tool handlers - MCP Server not initialized"
      );
      return;
    }

    this.logger.log("Registering MCP tool handlers...");

    try {
      // Register get_fixed_data tool
      this.mcpServer.tool(
        "get_fixed_data",
        {}, // No parameters needed for this tool
        async () => {
          this.logger.log("📡 MCP TOOL CALLED: get_fixed_data");
          this.logger.log("🔄 Processing MCP tool request...");

          // Simulate some processing time
          await new Promise((resolve) => setTimeout(resolve, 100));

          this.logger.log("✅ MCP tool executed successfully");

          return {
            content: [
              {
                type: "text",
                text: "Success! This is the fixed data from the MCP tool.",
              },
            ],
          };
        }
      );

      // Register text reversal tool
      this.mcpServer.tool(
        "reverse_text",
        {
          text: z.string().min(1, "Text must not be empty"),
        },
        async ({ text }) => {
          this.logger.log(`📡 MCP TOOL CALLED: reverse_text`);
          this.logger.log(`Input text: "${text}"`);

          // Reverse the text
          const reversed = text.split("").reverse().join("");

          this.logger.log(`Reversed text: "${reversed}"`);

          return {
            content: [
              {
                type: "text",
                text: reversed,
              },
            ],
          };
        }
      );

      // Register calculator tool
      this.mcpServer.tool(
        "calculator",
        {
          operation: z.enum(["add", "subtract", "multiply", "divide"]),
          a: z.number(),
          b: z.number(),
        },
        async ({ operation, a, b }) => {
          this.logger.log(`📡 MCP TOOL CALLED: calculator (${operation})`);

          let result: number;
          switch (operation) {
            case "add":
              result = a + b;
              break;
            case "subtract":
              result = a - b;
              break;
            case "multiply":
              result = a * b;
              break;
            case "divide":
              if (b === 0) {
                return {
                  content: [{ type: "text", text: "Error: Division by zero" }],
                };
              }
              result = a / b;
              break;
          }

          return {
            content: [{ type: "text", text: `${result}` }],
          };
        }
      );

      this.logger.log("MCP tools registered successfully");
    } catch (error) {
      this.logger.error("Failed to register tool handler:", error);
    }
  }

  /**
   * Get the MCP server instance
   * @returns The MCP server instance
   */
  getServerInstance(): any {
    if (!this.mcpServer) {
      this.logger.error("MCP Server instance accessed before initialization!");
      throw new Error("MCP Server not initialized");
    }
    return this.mcpServer;
  }

  /**
   * Process a task and return the result
   * @param taskId The ID of the task to perform
   * @param params The parameters for the task
   * @returns The result of the task
   */
  async processTask(taskId: string, params: Record<string, any> = {}) {
    this.logger.log(`Processing MCP task: ${taskId}`);

    try {
      if (taskId === "get_fixed_data") {
        return {
          status: "success",
          data: {
            message: "This is the fixed data from the MCP.",
          },
        };
      } else if (taskId === "reverse_text") {
        const { text } = params;
        if (!text || typeof text !== "string") {
          return {
            status: "error",
            error: {
              code: "INVALID_PARAMETERS",
              message: "Text parameter is required and must be a string",
            },
          };
        }

        // Reverse the text
        const reversed = text.split("").reverse().join("");

        return {
          status: "success",
          data: {
            original: text,
            reversed: reversed,
          },
        };
      } else if (taskId === "calculator") {
        const { operation, a, b } = params;
        if (!operation || typeof a !== "number" || typeof b !== "number") {
          return {
            status: "error",
            error: {
              code: "INVALID_PARAMETERS",
              message: "Invalid parameters for calculator operation",
            },
          };
        }

        let result: number;
        switch (operation) {
          case "add":
            result = a + b;
            break;
          case "subtract":
            result = a - b;
            break;
          case "multiply":
            result = a * b;
            break;
          case "divide":
            if (b === 0) {
              return {
                status: "error",
                error: {
                  code: "DIVISION_BY_ZERO",
                  message: "Division by zero is not allowed",
                },
              };
            }
            result = a / b;
            break;
          default:
            return {
              status: "error",
              error: {
                code: "INVALID_OPERATION",
                message: `Unknown operation: ${operation}`,
              },
            };
        }

        return {
          status: "success",
          data: {
            result,
          },
        };
      }

      return {
        status: "error",
        error: {
          code: "TASK_NOT_FOUND",
          message: `Task '${taskId}' not recognized`,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error processing MCP task: ${error.message}`,
        error.stack
      );
      return {
        status: "error",
        error: {
          code: "INTERNAL_MCP_ERROR",
          message: "An internal error occurred while processing the task",
        },
      };
    }
  }
}
