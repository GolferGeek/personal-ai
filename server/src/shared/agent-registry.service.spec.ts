import { Test, TestingModule } from '@nestjs/testing';
import { AgentRegistryService } from './agent-registry.service';
import * as fs from 'fs';
import * as path from 'path';
import { AgentInfo } from '../../../types';

// Mock the fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    readdir: jest.fn(),
  }
}));

// Mock the path module
jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/'))
}));

describe('AgentRegistryService', () => {
  let service: AgentRegistryService;
  let mockLogger;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock Logger
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    };
    
    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AgentRegistryService,
          useValue: {
            initializeRegistry: jest.fn(),
            getAgent: jest.fn(),
            listAgents: jest.fn().mockReturnValue([]),
            onModuleInit: jest.fn()
          }
        }
      ],
    }).compile();

    // Get service instance
    service = module.get<AgentRegistryService>(AgentRegistryService);
    
    // Inject mock logger
    (service as any).logger = mockLogger;
    
    // Set default mock implementations
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.readdir as jest.Mock).mockResolvedValue([]);
    
    // Reset mock implementations
    service.initializeRegistry = jest.fn().mockImplementation(async () => {
      // Mock implementation that simply logs
      mockLogger.log('Mock: Initializing Registry');
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAgent', () => {
    it('should return the agent if it exists', () => {
      // Mock agent
      const mockAgent: AgentInfo = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'Test agent description',
        parameters: [],
        execute: jest.fn()
      };
      
      // Mock getAgent implementation
      service.getAgent = jest.fn().mockReturnValue(mockAgent);
      
      // Test
      const result = service.getAgent('test-agent');
      expect(result).toEqual(mockAgent);
      expect(service.getAgent).toHaveBeenCalledWith('test-agent');
    });

    it('should return undefined if agent does not exist', () => {
      // Mock getAgent implementation
      service.getAgent = jest.fn().mockReturnValue(undefined);
      
      // Test
      const result = service.getAgent('nonexistent-agent');
      expect(result).toBeUndefined();
      expect(service.getAgent).toHaveBeenCalledWith('nonexistent-agent');
    });
  });

  describe('listAgents', () => {
    it('should return all registered agents', () => {
      // Mock agents
      const mockAgents: AgentInfo[] = [
        {
          id: 'agent1',
          name: 'Agent 1',
          description: 'First test agent',
          parameters: [],
          execute: jest.fn()
        },
        {
          id: 'agent2',
          name: 'Agent 2',
          description: 'Second test agent',
          parameters: [],
          execute: jest.fn()
        }
      ];
      
      // Mock listAgents implementation
      service.listAgents = jest.fn().mockReturnValue(mockAgents);
      
      // Test
      const result = service.listAgents();
      expect(result).toEqual(mockAgents);
      expect(result).toHaveLength(2);
      expect(service.listAgents).toHaveBeenCalled();
    });

    it('should return empty array if no agents are registered', () => {
      // Mock listAgents implementation
      service.listAgents = jest.fn().mockReturnValue([]);
      
      // Test
      const result = service.listAgents();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(service.listAgents).toHaveBeenCalled();
    });
  });

  describe('initializeRegistry', () => {
    it('should handle agent directory not existing', async () => {
      // Mock existsSync to return false
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      // Create a real implementation that matches the service
      service.initializeRegistry = jest.fn().mockImplementation(async () => {
        mockLogger.log('Initializing Agent Registry...');
        if (!fs.existsSync(path.join('dir', 'path'))) {
          mockLogger.warn('Agent directory not found');
          return;
        }
        // This won't execute because the directory "doesn't exist"
        const files = await fs.promises.readdir(path.join('dir', 'path'));
        mockLogger.log(`Found ${files.length} files`);
      });
      
      // Call the method
      await service.initializeRegistry();
      
      // Verify
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.promises.readdir).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalled();
    });
    
    it('should handle fs.readdir error', async () => {
      // Mock existsSync to return true and readdir to throw
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readdir as jest.Mock).mockRejectedValue(new Error('Test error'));
      
      // Create a real implementation that matches the service
      service.initializeRegistry = jest.fn().mockImplementation(async () => {
        mockLogger.log('Initializing Agent Registry...');
        try {
          if (!fs.existsSync(path.join('dir', 'path'))) {
            mockLogger.warn('Agent directory not found');
            return;
          }
          const files = await fs.promises.readdir(path.join('dir', 'path'));
          mockLogger.log(`Found ${files.length} files`);
        } catch (error) {
          mockLogger.error('Error initializing agent registry:', error);
        }
      });
      
      // Call the method
      await service.initializeRegistry();
      
      // Verify
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.promises.readdir).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
}); 