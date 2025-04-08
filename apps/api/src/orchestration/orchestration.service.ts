import { Injectable, Logger } from "@nestjs/common";
import { Message } from "@personal-ai/models";
import { ConversationsService } from "../conversations/conversations.service";
import { AgentsService } from "../agents/agents.service";
import { McpService } from "../mcp/mcp.service";

@Injectable()
export class OrchestrationService {
  private readonly logger = new Logger(OrchestrationService.name);

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly agentsService: AgentsService,
    private readonly mcpService: McpService
  ) {}

  async generateResponse(
    conversationId: string,
    userMessage: string
  ): Promise<Message> {
    try {
      // 1. Add the user message to the conversation
      await this.conversationsService.addMessage(conversationId, {
        role: "user",
        content: userMessage,
      });

      try {
        // Check if the message is a reverse command
        if (userMessage.toLowerCase().trim().startsWith("reverse ")) {
          // Extract the text to reverse (everything after 'reverse ')
          const textToReverse = userMessage.substring("reverse ".length).trim();

          // Call the MCP service to reverse the text
          const mcpResponse = await this.mcpService.processTask(
            "reverse_text",
            {
              text: textToReverse,
            }
          );

          let responseContent = "";

          if (mcpResponse.status === "success") {
            // Use the reversed text in our response
            this.logger.log(
              `Received reversed text from MCP: ${mcpResponse.data?.reversed}`
            );
            responseContent = mcpResponse.data?.reversed;
          } else {
            // If MCP call fails, provide an error
            this.logger.warn(`MCP call failed: ${mcpResponse.error?.message}`);
            responseContent = `Error: ${mcpResponse.error?.message}`;
          }

          // Add the assistant's response to the conversation
          const assistantMessage = await this.conversationsService.addMessage(
            conversationId,
            {
              role: "assistant",
              content: responseContent,
            }
          );

          return assistantMessage;
        } else {
          // Not a reverse command, provide a default response
          const assistantMessage = await this.conversationsService.addMessage(
            conversationId,
            {
              role: "assistant",
              content: `I understand you said: "${userMessage}". If you want me to reverse some text, please start your message with 'reverse' followed by the text you want reversed.`,
            }
          );

          return assistantMessage;
        }
      } catch (mcpError) {
        // If MCP processing fails, log and generate a different response
        this.logger.error(`MCP processing error: ${mcpError.message}`);

        const fallbackMessage = await this.conversationsService.addMessage(
          conversationId,
          {
            role: "assistant",
            content: `I received your message: "${userMessage}", but encountered an error while processing it through MCP. 
            
Error details: ${mcpError.message}`,
          }
        );

        return fallbackMessage;
      }
    } catch (error) {
      // Catch-all for any other errors (e.g., conversation service errors)
      this.logger.error(`Error generating response: ${error.message}`);

      // Try to add a fallback message, but if that fails, just return a constructed message
      try {
        return await this.conversationsService.addMessage(conversationId, {
          role: "assistant",
          content: `I apologize, but I was unable to process your message: "${userMessage}". Please try again later.`,
        });
      } catch (addMessageError) {
        this.logger.error(
          `Failed to add fallback message: ${addMessageError.message}`
        );
        // Return a constructed message that doesn't require saving to the conversation
        return {
          id: "error-fallback",
          conversationId,
          role: "assistant",
          content: `I apologize, but I was unable to process your message. There was an error with the conversation system.`,
          timestamp: Date.now(),
          createdAt: new Date().toISOString(),
        };
      }
    }
  }

  async getAgentsSummary(): Promise<{
    count: number;
    agents: Array<{ id: string; name: string }>;
  }> {
    const agents = await this.agentsService.findAll();

    return {
      count: agents.length,
      agents: agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
      })),
    };
  }
}
