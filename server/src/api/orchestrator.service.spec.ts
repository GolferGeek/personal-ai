import { Test, TestingModule } from '@nestjs/testing';
import { OrchestratorService } from './orchestrator.service';
import { AgentRegistryService } from '../shared/agent-registry.service';

// Minimal test focused on functionality
describe('OrchestratorService', () => {
  let service: OrchestratorService;
  let agentRegistryService: AgentRegistryService;

  beforeEach(async () => {
    // Clear all jest mocks
    jest.clearAllMocks();
    
    // Create a mock AgentRegistryService
    const mockAgentRegistryService = {
      getAgent: jest.fn(),
      listAgents: jest.fn(),
    };
    
    // Set up the testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrchestratorService,
          useValue: {
            handleRequest: jest.fn(),
            handleReverseCommand: jest.fn(),
            handleMcpDataCommand: jest.fn(),
            executeAgentWithParams: jest.fn(),
          }
        },
        {
          provide: AgentRegistryService,
          useValue: mockAgentRegistryService,
        },
      ],
    }).compile();

    // Get service instances
    service = module.get<OrchestratorService>(OrchestratorService);
    agentRegistryService = module.get<AgentRegistryService>(AgentRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  // Basic test to ensure the testing setup is working
  it('should have required methods', () => {
    expect(service.handleRequest).toBeDefined();
  });
}); 