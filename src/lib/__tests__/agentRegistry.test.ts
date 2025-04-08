import fs from 'fs';
import path from 'path';
import * as agentRegistry from '../agentRegistry'; // Import module to test
import { AgentInfo } from '../types';

// --- Mocking Dependencies ---

// Mock the fs.promises module
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
  },
}));

// Mock the dynamic import behavior
// We need to control what `import(\`@/agents/${file}\`)` returns
jest.mock('@/agents/validAgent.ts', () => ({
    default: {
        id: 'validAgent',
        name: 'Valid Agent',
        description: 'A valid test agent.',
        parameters: [],
        execute: jest.fn().mockResolvedValue('valid result'),
    } as AgentInfo,
}), { virtual: true });

jest.mock('@/agents/invalidAgent.ts', () => ({
    // Missing 'id' or 'execute' to simulate invalid structure
    default: {
        name: 'Invalid Agent',
        description: 'An invalid test agent.',
        parameters: [],
    },
}), { virtual: true });

jest.mock('@/agents/idMismatchAgent.ts', () => ({
    default: {
        id: 'exportedId', // Different from filename
        name: 'ID Mismatch Agent',
        description: 'Agent ID mismatch test.',
        parameters: [],
        execute: jest.fn(),
    } as AgentInfo,
}), { virtual: true });

jest.mock('@/agents/nonAgentFile.txt', () => ({}), { virtual: true }); // Simulate non-ts/js file

// --- Test Suite ---

describe('agentRegistry', () => {
  // Clear mocks and reset registry state before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Need a way to reset the internal state (registry map and isInitialized flag)
    // We also need to reset the isInitialized flag manually for tests
    // This is a bit hacky, exposing it only for testing or adding a reset function would be better.
    (agentRegistry as any).__test_resetInitialized(); // Assuming we add a test helper
  });

  // Add a way to reset the internal isInitialized flag for testing purposes
  // This should ideally be handled more cleanly, e.g., exporting a reset function
  beforeAll(() => {
    (agentRegistry as any).__test_resetInitialized = () => {
      let internalState = agentRegistry as any;
      internalState.isInitialized = false;
      internalState.agentRegistry.clear(); // Also clear the map
    };
  });

  afterAll(() => {
    // Clean up the test helper
    delete (agentRegistry as any).__test_resetInitialized;
  });

  it('should initialize correctly, load valid agents, and skip invalid ones', async () => {
    // Arrange: Mock fs.promises.readdir to return a list of files
    (fs.promises.readdir as jest.Mock).mockResolvedValue([
      'validAgent.ts',
      'invalidAgent.ts',
      'idMismatchAgent.ts',
      'nonAgentFile.txt',
    ]);

    // Act: Initialize the registry
    await agentRegistry.initializeRegistry();

    // Assert: Check which agents were loaded
    const loadedAgents = await agentRegistry.listAgents();
    const validAgent = await agentRegistry.getAgent('validAgent');
    const mismatchAgent = await agentRegistry.getAgent('exportedId');
    const invalidAgent = await agentRegistry.getAgent('invalidAgent'); // Should not exist by this ID

    expect(loadedAgents).toHaveLength(2); // Only validAgent and idMismatchAgent (using exportedId)
    expect(loadedAgents.map(a => a.id)).toEqual(expect.arrayContaining(['validAgent', 'exportedId']));

    expect(validAgent).toBeDefined();
    expect(validAgent?.name).toBe('Valid Agent');
    expect(typeof validAgent?.execute).toBe('function');

    expect(mismatchAgent).toBeDefined();
    expect(mismatchAgent?.id).toBe('exportedId');

    expect(invalidAgent).toBeUndefined();

    // Check if readdir was called
    expect(fs.promises.readdir).toHaveBeenCalledTimes(1);
    expect(fs.promises.readdir).toHaveBeenCalledWith(path.join(process.cwd(), 'src', 'agents'));
  });

  it('should handle directory not found error gracefully', async () => {
    // Arrange: Mock readdir to throw ENOENT error
    const enoentError = new Error('ENOENT: no such file or directory');
    (enoentError as any).code = 'ENOENT';
    (fs.promises.readdir as jest.Mock).mockRejectedValue(enoentError);

    // Act & Assert: Initialize and check if agents list is empty
    await agentRegistry.initializeRegistry();
    const agents = await agentRegistry.listAgents();
    expect(agents).toHaveLength(0);
    // Should probably log a warning - could test console mocks if needed
  });

  it('should handle other file system errors during initialization', async () => {
    // Arrange: Mock readdir to throw a generic error
    const genericError = new Error('Disk read error');
    (fs.promises.readdir as jest.Mock).mockRejectedValue(genericError);

    // Act & Assert: Expect initialization to complete but load no agents
    await agentRegistry.initializeRegistry();
    const agents = await agentRegistry.listAgents();
    expect(agents).toHaveLength(0);
    // Should probably log an error - could test console mocks if needed
  });

  it('should prevent multiple initializations', async () => {
     // Arrange: Mock readdir
    (fs.promises.readdir as jest.Mock).mockResolvedValue(['validAgent.ts']);

    // Act: Initialize multiple times
    await agentRegistry.initializeRegistry();
    await agentRegistry.initializeRegistry(); // Second call

    // Assert: Check that readdir was only called once
    expect(fs.promises.readdir).toHaveBeenCalledTimes(1);
    const agents = await agentRegistry.listAgents();
    expect(agents).toHaveLength(1); // Should still have the agent from the first init
  });

  it('getAgent should initialize registry if not already done', async () => {
    // Arrange: Mock readdir
    (fs.promises.readdir as jest.Mock).mockResolvedValue(['validAgent.ts']);

    // Act: Call getAgent directly (assuming not initialized)
    const agent = await agentRegistry.getAgent('validAgent');

    // Assert:
    expect(fs.promises.readdir).toHaveBeenCalledTimes(1); // Initialization should have been triggered
    expect(agent).toBeDefined();
    expect(agent?.id).toBe('validAgent');
  });

   it('listAgents should initialize registry if not already done', async () => {
    // Arrange: Mock readdir
    (fs.promises.readdir as jest.Mock).mockResolvedValue(['validAgent.ts']);

    // Act: Call listAgents directly (assuming not initialized)
    const agents = await agentRegistry.listAgents();

    // Assert:
    expect(fs.promises.readdir).toHaveBeenCalledTimes(1); // Initialization should have been triggered
    expect(agents).toHaveLength(1);
    expect(agents[0].id).toBe('validAgent');
  });
}); 