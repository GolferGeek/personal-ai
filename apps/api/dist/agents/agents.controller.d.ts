import { Agent, AgentParameter } from '@personal-ai/models';
import { AgentsService } from './agents.service';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    findAll(): Promise<Agent[]>;
    findOne(id: string): Promise<Agent>;
    create(createAgentDto: Omit<Agent, 'id'>): Promise<Agent>;
    update(id: string, updateAgentDto: Partial<Agent>): Promise<Agent>;
    delete(id: string): Promise<void>;
    getParameters(id: string): Promise<AgentParameter[]>;
}
