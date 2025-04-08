import { Test, TestingModule } from '@nestjs/testing';
import { OrchestratorService } from './orchestrator.service';
import { AgentRegistryService } from '../shared/agent-registry.service';
import { AgentInfo, OrchestratorInput, OrchestratorResponse } from '@/types';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { Logger } from '@nestjs/common';

// --- Mocks ---
jest.mock('../shared/agent-registry.service'); // Mock the AgentRegistryService

// Mock the MCP Client and Transport
const mockMcpClientInstance = {
  connect: jest.fn().mockResolvedValue(undefined),
  callTool: jest.fn(),
  close: jest.fn().mockResolvedValue(undefined),
};
jest.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: jest.fn().mockImplementation(() => mockMcpClientInstance)
}));
jest.mock('@modelcontextprotocol/sdk/client/sse.js');

// Mock Logger
jest.mock('@nestjs/common', () => ({
    ...jest.requireActual('@nestjs/common'),
    Logger: jest.fn().mockImplementation(() => ({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }))
}));

// Mock Agent Info
const mockReverseAgent: AgentInfo = {
  id: 'reverseString',
  name: 'Reverse String Agent',
  description: '',
  parameters: [{ name: 'inputText', type: 'string', required: true, description: '', control: 'textInput' }],
  execute: jest.fn(),
};

// --- Test Suite ---
describe('OrchestratorService', () => {
  let service: OrchestratorService;
  let agentRegistryService: jest.Mocked<AgentRegistryService>;

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear all mocks

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrchestratorService,
        AgentRegistryService, // Provide the original (mocked by jest.mock)
      ],
    }).compile();

    service = module.get<OrchestratorService>(OrchestratorService);
    agentRegistryService = module.get(AgentRegistryService); // Get the mocked instance

    // Setup default mock implementations
    agentRegistryService.getAgent.mockResolvedValue(undefined); // Default to agent not found
  });

it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- NLU Miss Test ---
  it('should return NLU_MISS for unrecognized text input', async () => {
    const input: OrchestratorInput = { type: 'text', content: 'what is the weather?' };
    const expectedResponse: OrchestratorResponse = {
      status: 'error',
      error: { code: 'NLU_MISS', message: 'Could not understand the request.' },
    };
    const result = await service.handleRequest(input);
    expect(result).toEqual(expectedResponse);
  });

  // --- Reverse Agent Tests ---
  describe('Reverse Agent Handling', () => {
    beforeEach(() => {
        // Setup agent registry mock for reverse agent
        agentRegistryService.getAgent.mockImplementation(async (id) =>
             id === 'reverseString' ? mockReverseAgent : undefined
        );
        (mockReverseAgent.execute as jest.Mock).mockClear(); // Clear execute mock
    });

    it(`should ask for parameters if text input is missing required param ('reverse ...')`, async () => {
      const input: OrchestratorInput = { type: 'text', content: 'reverse ' };
      const result = await service.handleRequest(input);
      expect(result.status).toBe('needs_parameters');
      expect(result).toHaveProperty('agentId', 'reverseString');
      expect(result).toHaveProperty('parametersNeeded', mockReverseAgent.parameters);
      expect(mockReverseAgent.execute).not.toHaveBeenCalled();
    });

    it(`should execute if text input seems to contain parameter ('reverse hello')`, async () => {
        const expectedResult = 'olleh';
        (mockReverseAgent.execute as jest.Mock).mockResolvedValue(expectedResult);
        const input: OrchestratorInput = { type: 'text', content: 'reverse hello' };

        const result = await service.handleRequest(input);

        expect(result.status).toBe('success');
        expect(result).toHaveProperty('data', expectedResult);
        expect(mockReverseAgent.execute).toHaveBeenCalledTimes(1);
        expect(mockReverseAgent.execute).toHaveBeenCalledWith({ inputText: 'hello' });
    });

    it('should execute if params are provided directly', async () => {
        const inputText = 'world';
        const expectedResult = 'dlrow';
        (mockReverseAgent.execute as jest.Mock).mockResolvedValue(expectedResult);
        const input: OrchestratorInput = {
            type: 'params',
            content: { inputText },
            context: { pendingAgentId: 'reverseString' }
        };

        const result = await service.handleRequest(input);

        expect(result.status).toBe('success');
        expect(result).toHaveProperty('data', expectedResult);
        expect(mockReverseAgent.execute).toHaveBeenCalledTimes(1);
        expect(mockReverseAgent.execute).toHaveBeenCalledWith({ inputText });
    });

    it('should return validation error if required param missing in direct param input', async () => {
        const input: OrchestratorInput = {
            type: 'params',
            content: { }, // Missing inputText
            context: { pendingAgentId: 'reverseString' }
        };
        const result = await service.handleRequest(input);
        expect(result.status).toBe('needs_parameters'); // Or potentially error?
        expect(result).toHaveProperty('message', expect.stringContaining("Parameter 'inputText' is required."));
        expect(mockReverseAgent.execute).not.toHaveBeenCalled();
    });

    it('should return error if agent execution fails', async () => {
        const execError = new Error('Execution failed!');
        (mockReverseAgent.execute as jest.Mock).mockRejectedValue(execError);
        const input: OrchestratorInput = { type: 'text', content: 'reverse hello' };

        const result = await service.handleRequest(input);

        expect(result.status).toBe('error');
        expect(result).toHaveProperty('error.code', 'AGENT_EXECUTION_ERROR');
        expect(result).toHaveProperty('error.details', execError.message);
    });
  });

  // --- MCP Data Tests ---
  describe('MCP Data Handling', () => {
     it('should connect to MCP, call get_fixed_data, and return success', async () => {
        const input: OrchestratorInput = { type: 'text', content: 'get mcp data' };
        const mcpToolResult = { content: [{ type: 'text', text: 'Fixed MCP Data!' }] };
        mockMcpClientInstance.callTool.mockResolvedValue(mcpToolResult);

        const result = await service.handleRequest(input);

        expect(result.status).toBe('success');
        expect(result).toHaveProperty('data', 'Fixed MCP Data!');
        expect(Client).toHaveBeenCalledTimes(1);
        expect(SSEClientTransport).toHaveBeenCalledTimes(1);
        expect(mockMcpClientInstance.connect).toHaveBeenCalledTimes(1);
        expect(mockMcpClientInstance.callTool).toHaveBeenCalledTimes(1);
        expect(mockMcpClientInstance.callTool).toHaveBeenCalledWith({ name: 'get_fixed_data', arguments: {} });
        expect(mockMcpClientInstance.close).toHaveBeenCalledTimes(1);
    });

     it('should return error if MCP client connection fails', async () => {
        const input: OrchestratorInput = { type: 'text', content: 'fetch mcp data now' };
        const connError = new Error('Connection refused');
        mockMcpClientInstance.connect.mockRejectedValue(connError);

        const result = await service.handleRequest(input);

        expect(result.status).toBe('error');
        expect(result).toHaveProperty('error.code', 'MCP_REQUEST_FAILED');
        expect(result).toHaveProperty('error.details', connError.message);
        expect(mockMcpClientInstance.callTool).not.toHaveBeenCalled();
        expect(mockMcpClientInstance.close).toHaveBeenCalledTimes(1); // Should still try to close
    });

     it('should return error if MCP tool call fails', async () => {
        const input: OrchestratorInput = { type: 'text', content: 'mcp data please' };
        const toolError = new Error('Tool execution error on server');
        mockMcpClientInstance.callTool.mockRejectedValue(toolError);

        const result = await service.handleRequest(input);

        expect(result.status).toBe('error');
        expect(result).toHaveProperty('error.code', 'MCP_REQUEST_FAILED');
        expect(result).toHaveProperty('error.details', toolError.message);
        expect(mockMcpClientInstance.close).toHaveBeenCalledTimes(1);
    });
  });
}); 