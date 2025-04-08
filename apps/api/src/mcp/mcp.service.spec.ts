import { Test, TestingModule } from "@nestjs/testing";
import { McpService } from "./mcp.service";
import { Logger } from "@nestjs/common";

// Mock the McpServer class and its methods
const mockMcpServerInstance = {
  tool: jest.fn(),
  connect: jest.fn(),
};

jest.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  McpServer: jest.fn().mockImplementation(() => mockMcpServerInstance),
}));

describe("McpService", () => {
  let service: McpService;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        McpService,
        {
          provide: Logger,
          useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<McpService>(McpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("processTask", () => {
    it("should handle get_fixed_data task", async () => {
      const result = await service.processTask("get_fixed_data", {});

      expect(result).toBeDefined();
      expect(result.status).toBe("success");
      expect(result.data).toBeDefined();
      expect(result.data.message).toBe("This is the fixed data from the MCP.");
    });

    it("should handle reverse_text task", async () => {
      const result = await service.processTask("reverse_text", {
        text: "Hello, world!",
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("success");
      expect(result.data).toBeDefined();
      expect(result.data.original).toBe("Hello, world!");
      expect(result.data.reversed).toBe("!dlrow ,olleH");
    });

    it("should handle calculator task with valid parameters", async () => {
      const result = await service.processTask("calculator", {
        operation: "add",
        a: 5,
        b: 3,
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("success");
      expect(result.data).toBeDefined();
      expect(result.data.result).toBe(8);
    });

    it("should handle calculator task with division by zero", async () => {
      const result = await service.processTask("calculator", {
        operation: "divide",
        a: 5,
        b: 0,
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("error");
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe("DIVISION_BY_ZERO");
    });

    it("should handle calculator task with invalid operation", async () => {
      const result = await service.processTask("calculator", {
        operation: "invalid",
        a: 5,
        b: 3,
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("error");
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe("INVALID_OPERATION");
    });

    it("should handle unknown task", async () => {
      const result = await service.processTask("unknown_task", {});

      expect(result).toBeDefined();
      expect(result.status).toBe("error");
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe("TASK_NOT_FOUND");
    });
  });

  describe("getServerInstance", () => {
    it("should return the MCP server instance", () => {
      // The service initializes the MCP server on module init
      // We can simulate that by calling the private method directly
      (service as any).initializeMcpServer();

      const instance = service.getServerInstance();

      expect(instance).toBeDefined();
      expect(instance).toBe(mockMcpServerInstance);
    });

    it("should throw an error if server is not initialized", () => {
      // Reset the mcpServer property
      (service as any).mcpServer = null;

      expect(() => service.getServerInstance()).toThrow(
        "MCP Server not initialized"
      );
    });
  });
});
