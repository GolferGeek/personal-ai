import { Message } from '@personal-ai/models';
import { OrchestrationService } from './orchestration.service';
export declare class OrchestrationController {
    private readonly orchestrationService;
    constructor(orchestrationService: OrchestrationService);
    generateResponse(conversationId: string, body: {
        message: string;
    }): Promise<Message>;
    getAgentsSummary(): Promise<{
        count: number;
        agents: Array<{
            id: string;
            name: string;
        }>;
    }>;
}
