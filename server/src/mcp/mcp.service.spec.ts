import { Test, TestingModule } from '@nestjs/testing';
import { McpService } from './mcp.service';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '@nestjs/common';

// Mock the McpServer class and its methods
const mockMcpServerInstance = {
  tool: jest.fn(),
  // Add other methods if needed for tests
};
jest.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: jest.fn().mockImplementation(() => mockMcpServerInstance)
}));

// Mock the Logger
jest.mock('@nestjs/common', () => ({
    ...jest.requireActual('@nestjs/common'),
    Logger: jest.fn().mockImplementation(() => ({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }))
}));

describe('McpService', () => {
  let service: McpService;

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear mocks before each test

    const module: TestingModule = await Test.createTestingModule({
      providers: [McpService],
    }).compile();

    service = module.get<McpService>(McpService);
  });

it('should be defined', () => {
    expect(service).toBeDefined();
  });

it('should create an McpServer instance on initialization', () => {
    expect(McpServer).toHaveBeenCalledTimes(1);
    expect(McpServer).toHaveBeenCalledWith({
        name: 'PersonalAI-MCP-V1',
        version: '1.0.0',
        capabilities: { tools: {} },
    });
    
    // Use the public getServerInstance method instead of accessing private property
    expect(service.getServerInstance()).toBeDefined();
    expect(service.getServerInstance()).toBe(mockMcpServerInstance);
});

it('should register the get_fixed_data tool on initialization', () => {
    // Constructor calls registerTools
    expect(mockMcpServerInstance.tool).toHaveBeenCalledTimes(1);
    expect(mockMcpServerInstance.tool).toHaveBeenCalledWith(
        'get_fixed_data',
        expect.any(String), // Description
        expect.any(Function) // Handler function
    );
});

it('get_fixed_data handler should return correct data', async () => {
    // Need to capture the handler function registered in the mock
    const toolArgs = mockMcpServerInstance.tool.mock.calls[0];
    expect(toolArgs[0]).toBe('get_fixed_data');
    const handler = toolArgs[2]; // Get the handler function

    // Call the handler
    const result = await handler(); // No args needed for this handler

    // Assert the result
    expect(result).toEqual({
        content: [
            { type: 'text', text: 'This is the fixed data from the MCP.' }
        ]
    });
});

}); 