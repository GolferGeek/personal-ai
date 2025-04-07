// --- Response Types (based on docs/mcp-protocol-v1.md) ---

export type McpSuccessResponse = {
  status: 'success';
  data: Record<string, any>; // Task-specific data
};

export type McpErrorResponse = {
  status: 'error';
  error: {
    code: string;
    message: string;
  };
};

export type McpResponse = McpSuccessResponse | McpErrorResponse;

// --- Client Function ---

/**
 * Makes a call to the MCP API endpoint.
 * For V1 Phase 2, it remains a stub.
 * @param taskId The ID of the task for the MCP to execute.
 * @param params Parameters required by the MCP task.
 * @returns A promise that resolves with the McpResponse.
 */
export async function callMcp(taskId: string, params: Record<string, any>): Promise<McpResponse> {
  console.log(`Calling MCP (stubbed) - Task: ${taskId}, Params:`, params);

  // Stub implementation: Simulate a specific response or error
  if (taskId === 'get_fixed_data') {
    // Simulate success for the known V1 task
    return {
      status: 'success',
      data: {
        message: 'This is the fixed data from the MCP. (Stubbed Response)'
      },
    };
  } else {
    // Simulate an error for unknown tasks
    return {
      status: 'error',
      error: {
        code: 'TASK_NOT_FOUND',
        message: `MCP Task '${taskId}' not recognized (stubbed).`,
      },
    };
  }

  // Actual implementation (in Phase 5) would use fetch:
  /*
  try {
    const response = await fetch('/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        status: 'error',
        error: {
          code: errorBody?.error?.code || 'HTTP_ERROR',
          message: errorBody?.error?.message || `MCP request failed with status ${response.status}`,
        },
      };
    }

    const data: McpResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Error calling MCP:', error);
    return {
      status: 'error',
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'An unknown network error occurred',
      },
    };
  }
  */
} 