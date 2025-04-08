"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var McpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpService = void 0;
const common_1 = require("@nestjs/common");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
let McpService = McpService_1 = class McpService {
    constructor() {
        this.logger = new common_1.Logger(McpService_1.name);
    }
    async onModuleInit() {
        this.initializeMcpServer();
    }
    initializeMcpServer() {
        this.logger.log("Initializing MCP Server...");
        const serverName = "PersonalAI-MCPServer";
        const serverVersion = "1.0.0";
        try {
            this.mcpServer = new mcp_js_1.McpServer({
                name: serverName,
                version: serverVersion,
                capabilities: {
                    tools: {},
                },
            });
            this.registerToolHandlers();
            this.logger.log(`MCP Server initialized: ${serverName} v${serverVersion}`);
        }
        catch (error) {
            this.logger.error("Failed to initialize MCP Server:", error);
        }
    }
    registerToolHandlers() {
        if (!this.mcpServer) {
            this.logger.warn("Cannot register tool handlers - MCP Server not initialized");
            return;
        }
        this.logger.log("Registering MCP tool handlers...");
        try {
            this.mcpServer.tool("get_fixed_data", {}, async () => {
                this.logger.log("📡 MCP TOOL CALLED: get_fixed_data");
                this.logger.log("🔄 Processing MCP tool request...");
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
            });
            this.mcpServer.tool("reverse_text", {
                text: zod_1.z.string().min(1, "Text must not be empty"),
            }, async ({ text }) => {
                this.logger.log(`📡 MCP TOOL CALLED: reverse_text`);
                this.logger.log(`Input text: "${text}"`);
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
            });
            this.mcpServer.tool("calculator", {
                operation: zod_1.z.enum(["add", "subtract", "multiply", "divide"]),
                a: zod_1.z.number(),
                b: zod_1.z.number(),
            }, async ({ operation, a, b }) => {
                this.logger.log(`📡 MCP TOOL CALLED: calculator (${operation})`);
                let result;
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
            });
            this.logger.log("MCP tools registered successfully");
        }
        catch (error) {
            this.logger.error("Failed to register tool handler:", error);
        }
    }
    getServerInstance() {
        if (!this.mcpServer) {
            this.logger.error("MCP Server instance accessed before initialization!");
            throw new Error("MCP Server not initialized");
        }
        return this.mcpServer;
    }
    async processTask(taskId, params = {}) {
        this.logger.log(`Processing MCP task: ${taskId}`);
        try {
            if (taskId === "get_fixed_data") {
                return {
                    status: "success",
                    data: {
                        message: "This is the fixed data from the MCP.",
                    },
                };
            }
            else if (taskId === "reverse_text") {
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
                const reversed = text.split("").reverse().join("");
                return {
                    status: "success",
                    data: {
                        original: text,
                        reversed: reversed,
                    },
                };
            }
            else if (taskId === "calculator") {
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
                let result;
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
        }
        catch (error) {
            this.logger.error(`Error processing MCP task: ${error.message}`, error.stack);
            return {
                status: "error",
                error: {
                    code: "INTERNAL_MCP_ERROR",
                    message: "An internal error occurred while processing the task",
                },
            };
        }
    }
};
exports.McpService = McpService;
exports.McpService = McpService = McpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], McpService);
//# sourceMappingURL=mcp.service.js.map