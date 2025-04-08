import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AgentRegistryService } from './../src/shared/agent-registry.service';
import { AgentInfo, AgentMetadata } from '@/types';

// --- Mock Agent Data ---
const mockReverseStringMetadata: AgentMetadata = {
    id: 'reverseString',
    name: 'Reverse String Agent',
    description: 'Reverses the provided input text.',
    parameters: [
        { name: 'inputText', type: 'string', required: true, description: '', control: 'textInput' }
    ],
};
const mockReverseStringExecute = jest.fn();
const mockReverseStringAgent: AgentInfo = {
    ...mockReverseStringMetadata,
    execute: mockReverseStringExecute,
};

const mockOtherAgentMetadata: AgentMetadata = {
    id: 'otherAgent', name: 'Other Agent', description: '', parameters: [],
};
const mockOtherAgent: AgentInfo = {
    ...mockOtherAgentMetadata,
    execute: jest.fn(),
};

// --- Mock Service Implementation ---
const mockAgentRegistryService = {
    listAgents: jest.fn().mockResolvedValue([mockReverseStringMetadata, mockOtherAgentMetadata]),
    getAgent: jest.fn().mockImplementation(async (id: string) => {
        if (id === 'reverseString') return mockReverseStringAgent;
        if (id === 'otherAgent') return mockOtherAgent;
        return undefined;
    }),
    // We don't need initializeRegistry mock as e2e tests use the compiled app
};

// --- Test Suites ---

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    // Override the actual service with our mock
    .overrideProvider(AgentRegistryService)
    .useValue(mockAgentRegistryService)
    .compile();

    app = moduleFixture.createNestApplication();
    // Apply the same global pipes as in main.ts for consistency
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    await app.init();
  });

  afterEach(async () => {
    await app.close(); // Close app after each test
    jest.clearAllMocks(); // Clear mocks
  });

  // Keep the original root test
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

// New describe block for agent endpoints
describe('ApiController - /api/agents (e2e)', () => {
    let app: INestApplication<App>;

    // Setup similar to AppController, overriding the service
    beforeAll(async () => { // Use beforeAll as the mock setup is static for this suite
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        })
        .overrideProvider(AgentRegistryService)
        .useValue(mockAgentRegistryService)
        .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test run
        // Reset specific mock implementations if they change between tests
        mockReverseStringExecute.mockClear();
    });

    it('/api/agents (GET) - should list agent metadata', () => {
        return request(app.getHttpServer())
          .get('/api/agents')
          .expect(200)
          .expect((res) => {
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body).toHaveLength(2);
            expect(res.body).toEqual([mockReverseStringMetadata, mockOtherAgentMetadata]);
          });
      });

    it('/api/agents/:agentId (GET) - should return metadata for a specific agent', () => {
        return request(app.getHttpServer())
          .get('/api/agents/reverseString')
          .expect(200)
          .expect(mockReverseStringMetadata); // Expect only metadata
      });

    it('/api/agents/:agentId (GET) - should return 404 for unknown agent', () => {
        return request(app.getHttpServer())
          .get('/api/agents/unknownAgent')
          .expect(404);
      });

    it('/api/agents/:agentId (POST) - should execute an agent successfully', async () => {
        const inputText = 'test input';
        const expectedResult = 'tupni tset';
        mockReverseStringExecute.mockResolvedValue(expectedResult);

        await request(app.getHttpServer())
          .post('/api/agents/reverseString')
          .send({ parameters: { inputText: inputText } })
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({ result: expectedResult });
          });

        // Verify the mocked execute function was called correctly
        expect(mockAgentRegistryService.getAgent).toHaveBeenCalledWith('reverseString');
        expect(mockReverseStringExecute).toHaveBeenCalledTimes(1);
        expect(mockReverseStringExecute).toHaveBeenCalledWith({ inputText: inputText });
      });

    it('/api/agents/:agentId (POST) - should return 400 for missing required parameter', () => {
        return request(app.getHttpServer())
          .post('/api/agents/reverseString')
          .send({ parameters: {} }) // Missing inputText
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('Input validation failed');
            expect(res.body.errors).toContain("Parameter 'inputText' is required.");
          });
      });

     it('/api/agents/:agentId (POST) - should return 400 for incorrect parameter type', () => {
        return request(app.getHttpServer())
          .post('/api/agents/reverseString')
          .send({ parameters: { inputText: 123 } }) // Incorrect type
          .expect(400)
           .expect((res) => {
            expect(res.body.message).toContain('Input validation failed');
            expect(res.body.errors).toContain("Parameter 'inputText' should be type 'string', but received type 'number'.");
          });
      });

     it('/api/agents/:agentId (POST) - should return 404 for unknown agent', () => {
        return request(app.getHttpServer())
          .post('/api/agents/unknownAgent')
          .send({ parameters: { someParam: 'value' } })
          .expect(404);
      });

      it('/api/agents/:agentId (POST) - should handle agent execution errors (e.g., internal validation)', async () => {
        const errorMessage = 'Invalid input: Specific agent error.';
        mockReverseStringExecute.mockRejectedValue(new Error(errorMessage));

        await request(app.getHttpServer())
          .post('/api/agents/reverseString')
          .send({ parameters: { inputText: 'abc' } })
          .expect(400) // Expecting BadRequest due to agent input error
          .expect((res) => {
                expect(res.body.message).toContain('Agent execution failed due to invalid input.');
                expect(res.body.errors).toContain(errorMessage);
            });
    });
});
