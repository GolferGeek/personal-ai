/**
 * MCP Client - Utilities for interacting with the Model Context Protocol API
 */

// Types for MCP API responses
export type McpSuccessResponse = {
  status: "success";
  data: Record<string, any>;
};

export type McpErrorResponse = {
  status: "error";
  error: {
    code: string;
    message: string;
  };
};

export type McpResponse = McpSuccessResponse | McpErrorResponse;

/**
 * Makes a call to the MCP API endpoint.
 * @param taskId The ID of the task for the MCP to execute.
 * @param params Parameters required by the MCP task.
 * @returns A promise that resolves with the McpResponse.
 */
export async function callMcp(
  taskId: string,
  params: Record<string, any> = {}
): Promise<McpResponse> {
  try {
    const response = await fetch("/api/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: taskId, params }),
    });

    if (!response.ok) {
      // Attempt to parse error response from MCP
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        // Ignore if response is not JSON
      }

      return {
        status: "error",
        error: {
          code: errorBody?.error?.code || "HTTP_ERROR",
          message:
            errorBody?.error?.message ||
            `MCP request failed with status ${response.status}`,
        },
      };
    }

    const data: McpResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling MCP:", error);
    return {
      status: "error",
      error: {
        code: "NETWORK_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "An unknown network error occurred",
      },
    };
  }
}
