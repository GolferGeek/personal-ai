import fs from 'fs';
import path from 'path';
import { AgentInfo, AgentMetadata } from './types';

// In-memory storage for discovered agents
const agentRegistry = new Map<string, AgentInfo>();

// Flag to prevent multiple initializations
let isInitialized = false;

/**
 * Scans the /src/agents directory, dynamically imports agent definitions,
 * validates them, and populates the registry.
 * Ensures this logic runs only once.
 */
export async function initializeRegistry(): Promise<void> {
  if (isInitialized) {
    console.log('Agent registry already initialized.');
    return;
  }

  console.log('Initializing agent registry...');
  agentRegistry.clear(); // Clear previous entries if any

  const agentsDir = path.join(process.cwd(), 'src', 'agents');

  try {
    const files = await fs.promises.readdir(agentsDir);

    for (const file of files) {
      // Look for .ts files (or .js after compilation)
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const filePath = path.join(agentsDir, file);
        const agentId = path.basename(file, path.extname(file)); // Use filename (without ext) as potential ID

        try {
          console.log(`Loading agent from: ${file}`);
          // Dynamically import the agent module
          const agentModule = await import(`@/agents/${file}`);
          const agentInfo = agentModule.default as AgentInfo;

          // Basic validation
          if (!agentInfo || typeof agentInfo.execute !== 'function' || !agentInfo.id) {
            console.warn(`  [WARN] Invalid agent structure in ${file}. Skipping.`);
            continue;
          }

          // Ensure the filename-derived ID matches the exported ID
          if (agentInfo.id !== agentId) {
            console.warn(`  [WARN] Agent ID mismatch in ${file}: filename suggests '${agentId}', but module exports '${agentInfo.id}'. Using exported ID.`);
          }

          if (agentRegistry.has(agentInfo.id)) {
            console.warn(`  [WARN] Duplicate agent ID '${agentInfo.id}' found in ${file}. Overwriting existing entry.`);
          }

          agentRegistry.set(agentInfo.id, agentInfo);
          console.log(`  -> Registered agent: ${agentInfo.id} (${agentInfo.name})`);

        } catch (error) {
          console.error(`  [ERROR] Failed to load agent from ${file}:`, error);
        }
      }
    }
  } catch (error: any) {
    // Handle cases where the directory might not exist
    if (error.code === 'ENOENT') {
      console.warn(`Agent directory not found: ${agentsDir}. No agents loaded.`);
    } else {
      console.error('Error reading agent directory:', error);
    }
  }

  console.log(`Agent registry initialization complete. ${agentRegistry.size} agents loaded.`);
  isInitialized = true;
}

/**
 * Retrieves agent information by its unique ID.
 * Ensures registry is initialized before attempting retrieval.
 * @param id The unique ID of the agent.
 * @returns AgentInfo if found, otherwise undefined.
 */
export async function getAgent(id: string): Promise<AgentInfo | undefined> {
  if (!isInitialized) {
    await initializeRegistry();
  }
  return agentRegistry.get(id);
}

/**
 * Lists the metadata for all registered agents.
 * Ensures registry is initialized before listing.
 * @returns An array of AgentMetadata.
 */
export async function listAgents(): Promise<AgentMetadata[]> {
  if (!isInitialized) {
    await initializeRegistry();
  }
  // Map AgentInfo to AgentMetadata (excluding the execute function)
  return Array.from(agentRegistry.values()).map(({ execute, ...metadata }) => metadata);
}

// Initializing the registry when the module first loads might be problematic
// in Next.js edge runtime or during build phases. It's safer to initialize
// it lazily when getAgent or listAgents is first called, or explicitly
// in the application setup (e.g., in a layout or global server component).
// await initializeRegistry(); // Avoid eagerly initializing here 