import { Agent, AgentParameter } from '@personal-ai/models';
export declare class AgentsService {
    private agents;
    constructor();
    findAll(): Promise<Agent[]>;
    findOne(id: string): Promise<Agent>;
    create(agent: Omit<Agent, 'id'>): Promise<Agent>;
    update(id: string, agent: Partial<Agent>): Promise<Agent>;
    delete(id: string): Promise<void>;
    getParameters(id: string): Promise<AgentParameter[]>;
}
