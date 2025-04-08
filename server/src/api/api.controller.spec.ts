import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { AgentRegistryService } from '../shared/agent-registry.service';
import { OrchestratorService } from './orchestrator.service';
import { UserService } from '../shared/user.service';
import { ConversationService } from '../shared/conversation.service';

// Create mock services
const mockAgentRegistryService = {
  getAgent: jest.fn(),
  listAgents: jest.fn(),
};

const mockOrchestratorService = {
  handleRequest: jest.fn(),
};

const mockUserService = {
  createAnonymousUser: jest.fn(),
  getUser: jest.fn(),
};

describe('ApiController', () => {
  let controller: ApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: AgentRegistryService,
          useValue: mockAgentRegistryService,
        },
        {
          provide: OrchestratorService,
          useValue: mockOrchestratorService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConversationService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    
    // Reset mock implementations
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  it('should have required dependencies', () => {
    expect(controller).toHaveProperty('agentRegistry');
    expect(controller).toHaveProperty('orchestratorService');
    expect(controller).toHaveProperty('userService');
  });
});
