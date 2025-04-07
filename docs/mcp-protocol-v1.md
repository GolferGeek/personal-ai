# MCP Protocol V1

This document outlines the simple JSON-based protocol for communication between the Orchestrator (via `mcpClient`) and the Master Control Program (MCP) endpoint (`/api/mcp`) for V1.

## Request (Orchestrator -> MCP)

```json
{
  "task_id": "get_fixed_data",
  "params": {} // No parameters needed for V1 task
}
```

*   **task_id**: (string, required) Identifies the specific task the MCP should perform. For V1, only `"get_fixed_data"` is supported.
*   **params**: (object, required) An object containing parameters for the task. Empty for the V1 task.

## Response (MCP -> Orchestrator)

### Success Response

```json
{
  "status": "success",
  "data": {
    "message": "This is the fixed data from the MCP."
    // Other data fields specific to the task could be added here
  }
}
```

*   **status**: (string, required) Indicates the outcome. Always `"success"` for a successful operation.
*   **data**: (object, required) Contains the result of the MCP task.
    *   **message**: (string, optional) A user-friendly message.

### Error Response

```json
{
  "status": "error",
  "error": {
    "code": "TASK_NOT_FOUND" | "INTERNAL_MCP_ERROR", // Example error codes
    "message": "A description of the error."
  }
}
```

*   **status**: (string, required) Always `"error"` for failed operations.
*   **error**: (object, required) Contains details about the error.
    *   **code**: (string, required) A machine-readable error code.
    *   **message**: (string, required) A human-readable description of the error. 