import { AgentInfo, AgentMetadata } from './types';

// In-memory storage for discovered agents
const agentRegistry = new Map<string, AgentInfo>();

/**
 * Initializes the agent registry. In a real implementation,
 * this would scan a directory (e.g., /src/agents) and load agent definitions.
 * For V1 Phase 2, it remains a stub.
 */
export function initializeRegistry(): void {
  console.log('Agent registry initialization (stubbed)...');
  // TODO: Implement dynamic agent loading in Phase 3
  agentRegistry.clear(); // Ensure it's empty on re-init
}

/**
 * Retrieves agent information by its unique ID.
 * @param id The unique ID of the agent.
 * @returns AgentInfo if found, otherwise undefined.
 */
export function getAgent(id: string): AgentInfo | undefined {
  console.log(`Getting agent (stubbed): ${id}`);
  // Stub implementation: return undefined or a dummy agent for testing
  return agentRegistry.get(id);
}

/**
 * Lists the metadata for all registered agents.
 * @returns An array of AgentMetadata.
 */
export function listAgents(): AgentMetadata[] {
  console.log('Listing agents (stubbed)...');
  // Stub implementation: return empty array or dummy data
  return Array.from(agentRegistry.values()).map(({ execute, ...metadata }) => metadata);
}

// Ensure registry is initialized at least once when the module loads
// Note: In Next.js, module loading can be complex. Initialization might need
// to be triggered more explicitly depending on usage (e.g., in a server component
// or API route handler before first use).
// initializeRegistry(); 