import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AgentInfo } from '../../../types'; // Adjust path based on actual location
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AgentRegistryService implements OnModuleInit {
  private readonly logger = new Logger(AgentRegistryService.name);
  private agents: Map<string, AgentInfo> = new Map();

  // This method will be called once the module has been initialized.
  async onModuleInit() {
    await this.initializeRegistry();
  }

  /**
   * Initializes the agent registry by dynamically loading agent files.
   */
  async initializeRegistry(): Promise<void> {
    this.logger.log('Initializing Agent Registry...');
    this.agents.clear(); // Clear any existing agents

    try {
      // Path to the agents directory
      const agentsDir = path.join(__dirname, '..', 'agents');
      
      // Check if the directory exists
      if (!fs.existsSync(agentsDir)) {
        this.logger.warn(`Agent directory not found: ${agentsDir}`);
        return;
      }

      // Read all files in the directory
      const files = await fs.promises.readdir(agentsDir);
      
      // Track loaded agents for logging
      let loadedCount = 0;
      let errorCount = 0;

      // Process each file
      for (const file of files) {
        // Only process .js or .ts files
        if (file.endsWith('.js') || file.endsWith('.ts')) {
          try {
            // Construct the full path to the agent file
            const agentFilePath = path.join(agentsDir, file);
            
            // Import the agent module
            const agentModule = await import(agentFilePath);
            
            // Get the default export which should be an AgentInfo object
            const agent = agentModule.default as AgentInfo;
            
            // Validate the agent has required properties
            if (!agent || !agent.id || !agent.execute || typeof agent.execute !== 'function') {
              this.logger.warn(`Invalid agent structure in ${file}. Skipping.`);
              errorCount++;
              continue;
            }
            
            // Register the agent
            this.agents.set(agent.id, agent);
            this.logger.log(`Loaded agent: ${agent.id} from ${file}`);
            loadedCount++;
          } catch (error) {
            this.logger.error(`Failed to load agent from ${file}:`, error);
            errorCount++;
          }
        }
      }

      this.logger.log(`Agent Registry initialized. Loaded ${loadedCount} agent(s). Errors: ${errorCount}.`);
    } catch (error) {
      this.logger.error('Error initializing agent registry:', error);
    }
  }

  /**
   * Retrieves a specific agent by its ID.
   * @param agentId The ID of the agent to retrieve.
   * @returns The AgentInfo object or undefined if not found.
   */
  getAgent(agentId: string): AgentInfo | undefined {
    this.logger.debug(`Attempting to get agent: ${agentId}`);
    return this.agents.get(agentId);
  }

  /**
   * Lists all registered agents.
   * @returns An array of AgentInfo objects.
   */
  listAgents(): AgentInfo[] {
    this.logger.debug('Listing all agents');
    return Array.from(this.agents.values());
  }
} 