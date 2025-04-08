import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Create and configure the MCP Server instance
// This instance will be shared across the application, particularly by the transport API routes.
export const mcpServer = new McpServer({
  name: "PersonalAI-MCP-V1",
  version: "1.0.0",
  // Define server capabilities - for V1, we only have tools
  capabilities: {
    tools: {},
    // resources: {}, // We don't have resources in V1
    // prompts: {},   // We don't have prompts in V1
  },
});

// --- Define MCP Tools ---

// Define the schema for the 'get_fixed_data' tool (no parameters)
const getFixedDataSchema = z.object({});

// Define the handler function for the 'get_fixed_data' tool
// Simplified signature, relying on the SDK overload for no-parameter tools
// Exported for testability
export async function handleGetFixedData(
    // The 'extra' argument is likely passed implicitly by the SDK
): Promise<{ content: { type: "text"; text: string }[] }> {
  console.log("MCP Tool: handleGetFixedData invoked");
  // Return the predefined success message as per the V1 plan
  return {
    content: [
      {
        type: "text",
        text: "This is the fixed data from the MCP.",
      },
    ],
  };
}

// Register the tool with the server instance using the overload for no-parameter tools
mcpServer.tool(
    "get_fixed_data",                // Tool name
    "Returns a fixed predefined string.", // Description
    handleGetFixedData               // Async handler function
);

console.log(`MCP Server instance created and tool 'get_fixed_data' registered.`);

// Note: This file only defines the server and its tools.
// The actual transport (e.g., SSE endpoints) needs to be set up separately
// (in Phase 4) and connected to this 'mcpServer' instance. 