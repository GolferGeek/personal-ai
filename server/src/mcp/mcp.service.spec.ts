import { Test, TestingModule } from '@nestjs/testing';
import { McpService } from './mcp.service';
import { Logger } from '@nestjs/common';
import * as path from 'path';

// Create a mock for the McpServer
const mockMcpServerInstance = {
  tool: jest.fn(),
};

// Need to mock the specific path that the service is requiring
const mockMcpPath = path.join(process.cwd(), 'node_modules/@modelcontextprotocol/sdk/dist/cjs/server/mcp.js');
jest.mock(mockMcpPath, () => ({
  McpServer: jest.fn().mockImplementation(() => mockMcpServerInstance)
}), { virtual: true });

describe('McpService', () => {
  let service: McpService;
  let loggerMock: Record<string, jest.Mock>;

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear mocks before each test
    
    // Create logger mock with all needed methods
    loggerMock = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        McpService,
        {
          provide: Logger,
          useValue: loggerMock
        }
      ],
    }).compile();

    service = module.get<McpService>(McpService);
    
    // Since we've mocked the static import, ensure the mock is used
    jest.spyOn(service as any, 'initializeMcpServer').mockImplementation(() => {
      (service as any).mcpServer = mockMcpServerInstance;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize the MCP server on module init', async () => {
    // Call onModuleInit
    await service.onModuleInit();
    
    // Verify the MCP server was initialized
    expect(loggerMock.log).toHaveBeenCalledWith('Initializing MCP Server...');
    expect(service.getServerInstance()).toBe(mockMcpServerInstance);
  });

  it('should register tool handlers', async () => {
    // Create spy on registerToolHandlers
    const registerSpy = jest.spyOn(service as any, 'registerToolHandlers');
    
    // Call onModuleInit
    await service.onModuleInit();
    
    // Verify registerToolHandlers was called
    expect(registerSpy).toHaveBeenCalled();
  });

  it('should provide server instance through getServerInstance', async () => {
    // Set the mcpServer
    (service as any).mcpServer = mockMcpServerInstance;
    
    // Call getServerInstance
    const serverInstance = service.getServerInstance();
    
    // Verify it returns the mock
    expect(serverInstance).toBe(mockMcpServerInstance);
  });

  it('should throw error when getServerInstance called before initialization', () => {
    // Set mcpServer to undefined
    (service as any).mcpServer = undefined;
    
    // Expect error when getServerInstance called
    expect(() => service.getServerInstance()).toThrow('MCP Server not initialized');
  });
}); 