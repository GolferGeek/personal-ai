import { Test, TestingModule } from "@nestjs/testing";
import { OrchestrationService } from "./orchestration.service";
import { ConversationsService } from "../conversations/conversations.service";
import { AgentsService } from "../agents/agents.service";
import { McpService } from "../mcp/mcp.service";
import { Message } from "@personal-ai/models";
import { Logger } from "@nestjs/common";

describe("OrchestrationService", () => {
  let service: OrchestrationService;
  let conversationsService: ConversationsService;
  let agentsService: AgentsService;
  let mcpService: McpService;

  beforeEach(async () => {
    // Mock services
    const mockConversationsService = {
      addMessage: jest.fn(
        (conversationId: string, message: any): Promise<Message> => {
          return Promise.resolve({
            id: "test-message-id",
            conversationId,
            role: message.role,
            content: message.content,
            timestamp: Date.now(),
            createdAt: new Date().toISOString(),
          });
        }
      ),
      findOne: jest.fn(),
    };

    const mockAgentsService = {
      findAll: jest.fn(() =>
        Promise.resolve([
          { id: "agent1", name: "Agent 1" },
          { id: "agent2", name: "Agent 2" },
        ])
      ),
      findOne: jest.fn(),
    };

    const mockMcpService = {
      processTask: jest.fn((taskId: string, params: any) => {
        if (taskId === "reverse_text") {
          const reversedText = params.text.split("").reverse().join("");
          return Promise.resolve({
            status: "success",
            data: {
              original: params.text,
              reversed: reversedText,
            },
          });
        }
        return Promise.resolve({
          status: "error",
          error: {
            code: "TASK_NOT_FOUND",
            message: `Task '${taskId}' not recognized`,
          },
        });
      }),
      getServerInstance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrchestrationService,
        { provide: ConversationsService, useValue: mockConversationsService },
        { provide: AgentsService, useValue: mockAgentsService },
        { provide: McpService, useValue: mockMcpService },
        {
          provide: Logger,
          useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<OrchestrationService>(OrchestrationService);
    conversationsService =
      module.get<ConversationsService>(ConversationsService);
    agentsService = module.get<AgentsService>(AgentsService);
    mcpService = module.get<McpService>(McpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("generateResponse", () => {
    it("should add user message and generate a response", async () => {
      const conversationId = "test-conversation-id";
      const userMessage = "Hello, world!";

      const result = await service.generateResponse(
        conversationId,
        userMessage
      );

      // Expect the user message to be added
      expect(conversationsService.addMessage).toHaveBeenCalledWith(
        conversationId,
        { role: "user", content: userMessage }
      );

      // Expect the assistant message to be added
      expect(conversationsService.addMessage).toHaveBeenCalledWith(
        conversationId,
        expect.objectContaining({
          role: "assistant",
          content: expect.any(String),
        })
      );

      // Expect a valid response
      expect(result).toBeDefined();
      expect(result.role).toBe("assistant");
    });

    it("should handle reverse command correctly", async () => {
      const conversationId = "test-conversation-id";
      const userMessage = "reverse Hello, world!";

      const result = await service.generateResponse(
        conversationId,
        userMessage
      );

      // Expect MCP reverse_text task to be called with the text after 'reverse '
      expect(mcpService.processTask).toHaveBeenCalledWith("reverse_text", {
        text: "Hello, world!",
      });

      // Expect the reversed text in the response
      expect(result).toBeDefined();
      expect(result.content).toBe("!dlrow ,olleH");
    });

    it("should provide help message for non-reverse commands", async () => {
      const conversationId = "test-conversation-id";
      const userMessage = "Hello, world!";

      const result = await service.generateResponse(
        conversationId,
        userMessage
      );

      // Expect no MCP reverse_text call for regular messages
      expect(mcpService.processTask).not.toHaveBeenCalled();

      // Expect a help message
      expect(result).toBeDefined();
      expect(result.content).toContain("If you want me to reverse some text");
    });
  });

  describe("getAgentsSummary", () => {
    it("should return a summary of available agents", async () => {
      const result = await service.getAgentsSummary();

      expect(result).toBeDefined();
      expect(result.count).toBe(2);
      expect(result.agents).toHaveLength(2);
      expect(result.agents[0].id).toBe("agent1");
      expect(result.agents[1].name).toBe("Agent 2");
    });
  });
});
