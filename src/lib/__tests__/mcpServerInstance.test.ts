// Important: We are only testing the TOOL HANDLER LOGIC here,
// not the McpServer class itself or the tool registration process.

// Extract the handler function for testing
// This requires the handler to be exported from mcpServerInstance.ts
// Or we need to mock the McpServer.tool call to capture the handler.
// Let's assume for now we export the handler for testability.

// We need to modify mcpServerInstance.ts to export handleGetFixedData
// export async function handleGetFixedData(...) { ... }

// Assuming handleGetFixedData is exported from the instance file:
import { handleGetFixedData } from '../mcpServerInstance'; // Adjust path if needed

describe('MCP Tool: get_fixed_data', () => {
  it('should return the correct fixed data structure', async () => {
    // Arrange: The handler for this tool doesn't take meaningful args
    // or rely on external state for V1.
    // The RequestHandlerExtra argument is implicitly passed by the SDK,
    // so we don't need to mock it for testing the handler's core logic.

    // Act: Call the handler function
    const result = await handleGetFixedData();

    // Assert: Check the returned structure and content
    expect(result).toBeDefined();
    expect(result.content).toBeInstanceOf(Array);
    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toEqual({
      type: 'text',
      text: 'This is the fixed data from the MCP.',
    });
  });

  // Add more tests here if the handler logic becomes more complex
  // (e.g., reading from config, error handling, etc.)
}); 