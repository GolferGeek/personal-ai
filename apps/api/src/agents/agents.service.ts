import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentParameter } from '@personal-ai/models';

@Injectable()
export class AgentsService {
  private agents: Agent[] = [];

  constructor() {
    // Initialize with some sample agents for development
    if (process.env.NODE_ENV === 'development') {
      this.agents = [
        {
          id: uuidv4(),
          name: 'Default Assistant',
          description: 'A general-purpose AI assistant that can help with a variety of tasks.',
          parameters: [],
        },
        {
          id: uuidv4(),
          name: 'Code Helper',
          description: 'Specialized in helping with programming tasks and code reviews.',
          parameters: [
            {
              name: 'programmingLanguage',
              type: 'string',
              label: 'Programming Language',
              description: 'The programming language to focus on',
              required: true,
            },
            {
              name: 'includeExamples',
              type: 'boolean',
              label: 'Include Examples',
              description: 'Whether to include code examples in the response',
              default: true,
            },
          ],
        },
      ];
    }
  }

  async findAll(): Promise<Agent[]> {
    return this.agents;
  }

  async findOne(id: string): Promise<Agent> {
    const agent = this.agents.find(a => a.id === id);
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async create(agent: Omit<Agent, 'id'>): Promise<Agent> {
    const newAgent: Agent = {
      id: uuidv4(),
      ...agent,
    };
    
    this.agents.push(newAgent);
    return newAgent;
  }

  async update(id: string, agent: Partial<Agent>): Promise<Agent> {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    
    const updated = {
      ...this.agents[index],
      ...agent,
    };
    
    this.agents[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    
    this.agents.splice(index, 1);
  }

  async getParameters(id: string): Promise<AgentParameter[]> {
    const agent = await this.findOne(id);
    return agent.parameters || [];
  }
} 