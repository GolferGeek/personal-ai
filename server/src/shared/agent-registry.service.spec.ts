import { Test, TestingModule } from '@nestjs/testing';
import { AgentRegistryService } from './agent-registry.service';
import * as fs from 'fs';
import * as path from 'path';
import { AgentInfo } from '@/types';
import { Logger } from '@nestjs/common';

// --- Mocking Dependencies ---

// Mock the fs module completely
jest.mock('fs');

// Mock the Logger to suppress output during tests
jest.mock('@nestjs/common', () => ({
    ...jest.requireActual('@nestjs/common'), // Keep actuals for Injectable etc.
    Logger: jest.fn().mockImplementation(() => ({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }))
}));

// Mock the dynamic imports
jest.mock('../agents/validAgent', () => ({
    default: {
        id: 'validAgent',
        name: 'Valid Agent',
        description: 'A valid test agent.',
        parameters: [],
        execute: jest.fn().mockResolvedValue('valid result'),
    } as AgentInfo,
}), { virtual: true });

jest.mock('../agents/invalidAgent', () => ({
    default: { name: 'Invalid Agent' }, // Invalid structure
}), { virtual: true });

jest.mock('../agents/idMismatchAgent', () => ({
    default: {
        id: 'exportedId', name: 'ID Mismatch Agent', description: '', parameters: [], execute: jest.fn()
    } as AgentInfo,
}), { virtual: true });

// Mock fs and path modules
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    readdir: jest.fn(),
  },
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

// Create mock agent module
const mockReverseStringAgent = {
  id: 'reverseStringAgent',
  name: 'Reverse String Agent',
  description: 'Test agent',
  parameters: [{ name: 'text', type: 'string', required: true }],
  execute: jest.fn(),
};

// Mock dynamic import
jest.mock('../agents/reverseStringAgent.ts', () => ({
  default: mockReverseStringAgent,
}), { virtual: true });

// --- Test Suite ---

describe('AgentRegistryService', () => {
  let service: AgentRegistryService;
  let mockedFs: jest.Mocked<typeof fs>;

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create a testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentRegistryService],
    }).compile();

    service = module.get<AgentRegistryService>(AgentRegistryService);
    mockedFs = fs as jest.Mocked<typeof fs>;

    // Manually reset initialization flag before each test
    (service as any).isInitialized = false;
    (service as any).agentRegistry.clear();

    // Set default mock implementations
    mockedFs.existsSync.mockReturnValue(true); // Assume dir exists by default
    (mockedFs.promises.readdir as jest.Mock).mockResolvedValue([]); // Default to empty dir

    // Set up mocks for fs.existsSync and path.join
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (path.join as jest.Mock).mockReturnValue('/mocked/path/to/agents');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize, load valid, skip invalid onModuleInit', async () => {
    // Arrange
    const mockFiles = ['validAgent.ts', 'invalidAgent.ts', 'idMismatchAgent.ts', 'other.txt'];
    (mockedFs.promises.readdir as jest.Mock).mockResolvedValue(mockFiles);

    // Act: Trigger initialization (happens implicitly via module init)
    await service.onModuleInit();

    // Assert: Check registry content
    const agents = await service.listAgents();
    expect(agents).toHaveLength(2);
    expect(agents.map(a => a.id)).toEqual(expect.arrayContaining(['validAgent', 'exportedId']));

    const validAgent = await service.getAgent('validAgent');
    expect(validAgent).toBeDefined();
    expect(validAgent?.name).toBe('Valid Agent');

    const mismatchAgent = await service.getAgent('exportedId');
    expect(mismatchAgent).toBeDefined();

    // Check mocks
    expect(mockedFs.promises.readdir).toHaveBeenCalledTimes(1);
  });

  it('should handle agent directory not existing', async () => {
    // Arrange
    mockedFs.existsSync.mockReturnValue(false);

    // Act
    await service.onModuleInit();

    // Assert
    const agents = await service.listAgents();
    expect(agents).toHaveLength(0);
    expect(mockedFs.promises.readdir).not.toHaveBeenCalled();
  });

   it('should handle readdir error', async () => {
    // Arrange
    const readError = new Error('Read permission denied');
    (mockedFs.promises.readdir as jest.Mock).mockRejectedValue(readError);

    // Act
    await service.onModuleInit();

    // Assert
    const agents = await service.listAgents();
    expect(agents).toHaveLength(0);
  });

  it('getAgent/listAgents should return empty/undefined before initialization is complete', async () => {
    // Arrange: Setup readdir but don't call onModuleInit yet
    (mockedFs.promises.readdir as jest.Mock).mockResolvedValue(['validAgent.ts']);

    // Act & Assert
    const agent = await service.getAgent('validAgent');
    expect(agent).toBeUndefined();
    const agents = await service.listAgents();
    expect(agents).toHaveLength(0);
    // Because onModuleInit didn't run yet
    expect(mockedFs.promises.readdir).not.toHaveBeenCalled();
  });

  describe('initializeRegistry', () => {
    it('should discover and load agents from the agents directory', async () => {
      // Set up mock return values for fs.promises.readdir
      (fs.promises.readdir as jest.Mock).mockResolvedValue(['reverseStringAgent.ts', 'nonAgentFile.txt']);
      
      // Mock import to return our mock agent
      jest.mock('../agents/reverseStringAgent.ts', () => ({
        default: mockReverseStringAgent,
      }), { virtual: true });
      
      // Initialize the registry
      await service.initializeRegistry();
      
      // Verify fs methods were called with correct arguments
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.promises.readdir).toHaveBeenCalledWith('/mocked/path/to/agents');
      
      // Verify the agent was loaded and can be retrieved
      const agent = service.getAgent('reverseStringAgent');
      expect(agent).toBeDefined();
      if (agent) {
        expect(agent.id).toBe('reverseStringAgent');
      }
    });

    it('should handle missing agents directory', async () => {
      // Mock fs.existsSync to return false
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      // Initialize the registry
      await service.initializeRegistry();
      
      // Verify fs methods were called but no agents were loaded
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.promises.readdir).not.toHaveBeenCalled();
      
      // Verify no agents were loaded
      expect(service.listAgents().length).toBe(0);
    });

    it('should handle errors during agent loading', async () => {
      // Set up mock return values for fs.promises.readdir
      (fs.promises.readdir as jest.Mock).mockResolvedValue(['reverseStringAgent.ts', 'invalidAgent.ts']);
      
      // Mock import to throw for invalidAgent.ts
      jest.mock('../agents/invalidAgent.ts', () => {
        throw new Error('Failed to load module');
      }, { virtual: true });
      
      // Initialize the registry
      await service.initializeRegistry();
      
      // Verify fs methods were called
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.promises.readdir).toHaveBeenCalled();
      
      // Verify only the valid agent was loaded
      expect(service.listAgents().length).toBe(1);
      expect(service.getAgent('reverseStringAgent')).toBeDefined();
    });
  });

  describe('getAgent', () => {
    it('should return the agent if it exists', async () => {
      // Manually add an agent to the registry
      await service.initializeRegistry();
      service['agents'].set('testAgent', { 
        id: 'testAgent', 
        name: 'Test', 
        description: 'Test', 
        parameters: [],
        execute: jest.fn(),
      });
      
      const agent = service.getAgent('testAgent');
      expect(agent).toBeDefined();
      if (agent) {
        expect(agent.id).toBe('testAgent');
      }
    });

    it('should return undefined if the agent does not exist', () => {
      const agent = service.getAgent('nonExistentAgent');
      expect(agent).toBeUndefined();
    });
  });

  describe('listAgents', () => {
    it('should return all registered agents', async () => {
      // Manually add some agents to the registry
      service['agents'].set('agent1', { 
        id: 'agent1', 
        name: 'Agent 1', 
        description: 'Test 1', 
        parameters: [],
        execute: jest.fn(),
      });
      
      service['agents'].set('agent2', { 
        id: 'agent2', 
        name: 'Agent 2', 
        description: 'Test 2', 
        parameters: [],
        execute: jest.fn(),
      });
      
      const agents = service.listAgents();
      expect(agents).toHaveLength(2);
      expect(agents.map(a => a.id)).toContain('agent1');
      expect(agents.map(a => a.id)).toContain('agent2');
    });

    it('should return an empty array if no agents are registered', () => {
      service['agents'].clear();
      const agents = service.listAgents();
      expect(agents).toHaveLength(0);
    });
  });
}); 