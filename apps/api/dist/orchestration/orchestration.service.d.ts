import { Message } from "@personal-ai/models";
import { ConversationsService } from "../conversations/conversations.service";
import { AgentsService } from "../agents/agents.service";
import { McpService } from "../mcp/mcp.service";
export declare class OrchestrationService {
    private readonly conversationsService;
    private readonly agentsService;
    private readonly mcpService;
    private readonly logger;
    constructor(conversationsService: ConversationsService, agentsService: AgentsService, mcpService: McpService);
    generateResponse(conversationId: string, userMessage: string): Promise<Message>;
    getAgentsSummary(): Promise<{
        count: number;
        agents: Array<{
            id: string;
            name: string;
        }>;
    }>;
}
