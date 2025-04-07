# V1 Implementation Plan

This document outlines the step-by-step implementation plan for Phase 1 (V1) of the Personal AI project, based on the specifications in `v1-plan.md`.

**Goal:** Build the foundational core interaction flow (UI -> Orchestrator -> Agent/MCP -> UI) with dynamic parameter handling.

---

**Phase 1: Setup, Configuration & Testing Setup**

*   **Objective:** Initialize the project, install dependencies, set up basic configuration, directory structure, and the testing framework.
*   **Tasks:**
    1.  Run `npx create-next-app@latest --typescript --eslint .` (using App Router).
    2.  **Testing Setup:** Install testing dependencies: `npm install --save-dev jest @types/jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest`. Configure Jest for Next.js (create `jest.config.js`, `jest.setup.js`).
    3.  Install core dependencies: `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material zustand`.
    4.  **Install MCP SDK:** `npm install @modelcontextprotocol/sdk zod`.
    5.  Create initial project directories: `/src/lib`, `/src/agents`, `/src/mcp` (optional, can contain server logic), `/src/config`, `/src/components`, `/src/store`.
    6.  Create `.env.local` file. **Note:** This file is for secrets (like API keys) only and should be added to `.gitignore`. It will remain empty for now.
    7.  Create `/src/config/llmConfig.ts`. Define basic structure for `availableModels` (can be empty or have stubs, potentially referencing key env vars like `apiKeyEnvVar: 'OPENAI_API_KEY'`). **Define default provider, model, and temperature directly in this file as exported constants.**

**Phase 2: Core Backend Logic Structures**

*   **Objective:** Define interfaces and create stubbed implementations for core backend services.
*   **Tasks:**
    1.  Define Agent Metadata TypeScript interface (in `/src/lib/types.ts` or similar) including `id`, `name`, `description`, `parameters` array (`name`, `type`, `required`, `description`, `control`).
    2.  Create `/src/lib/agentRegistry.ts` with stubbed functions: `initializeRegistry()`, `getAgent(id): AgentInfo | undefined`, `listAgents(): AgentMetadata[]`. Define `AgentInfo` and `AgentMetadata` types.
    3.  Create `/src/lib/orchestrator.ts` with a stubbed main function: `async handleRequest(input: { type: 'text' | 'params', content: string | Record<string, any>, context?: any }): Promise<OrchestratorResponse>`. Define `OrchestratorResponse` types (e.g., `{ status: 'success', data: any }`, `{ status: 'error', error: {...} }`, `{ status: 'needs_parameters', parameters_needed: ParameterDefinition[] }`). **Note:** The MCP interaction logic will be integrated here in Phase 5.
    4.  *(Removed task for custom MCP protocol)*
    5.  *(Removed task for custom `mcpClient.ts`)*

**Phase 3: Simple Agent & MCP Server Implementation**

*   **Objective:** Implement the specific agent, set up the MCP server using the SDK for V1 demonstration, and add unit tests.
*   **Tasks:**
    1.  Create `/src/agents/reverseStringAgent.ts`. Implement the `metadata` according to the standard (using `inputText`, `textInput` control) and the `run({ inputText })` function.
    2.  Implement the actual agent discovery logic in `/src/lib/agentRegistry.ts`: `initializeRegistry` function should scan `/src/agents`, dynamically `import()` `.ts` files, validate metadata, and populate the internal registry map. Ensure this runs reliably on server startup (e.g., potentially via a helper function called from `layout.tsx` or a custom server if needed, needs care with Next.js build process).
    3.  **Implement MCP Server Instance:** Create a shared `McpServer` instance (e.g., in `/src/lib/mcpServerInstance.ts`) using `@modelcontextprotocol/sdk`. Configure it with basic info (`name`, `version`).
    4.  **Define MCP Tool:** Add the `get_fixed_data` tool to the `McpServer` instance. This tool takes no parameters (`zod` schema) and returns the defined fixed success message.
    5.  **Testing:** Write unit tests for `reverseStringAgent.ts`'s `run` function. Write unit tests for `agentRegistry.ts` core logic. Write unit tests for the `get_fixed_data` MCP tool logic.

**Phase 4: Backend API Route Implementation**

*   **Objective:** Create the Next.js API routes to expose backend functionality, including the MCP Server transport endpoints, and add integration tests.
*   **Tasks:**
    1.  Implement `GET` handler in `/app/api/agents/route.ts` using `agentRegistry.listAgents()`.
    2.  Implement `GET` (metadata) and `POST` (execution) handlers in `/app/api/agents/[agentId]/route.ts`. Use `agentRegistry.getAgent()`. The `POST` handler must include input validation logic based on agent metadata.
    3.  **Implement MCP Server Transport Routes:**
        *   Create `/app/api/mcp/sse/route.ts`: Implement a `GET` handler that creates an `SSEServerTransport` from `@modelcontextprotocol/sdk`, connects it to the shared `McpServer` instance, and handles the SSE connection lifecycle. Manage multiple connections using session IDs.
        *   Create `/app/api/mcp/messages/route.ts`: Implement a `POST` handler that finds the correct `SSEServerTransport` based on the `sessionId` query parameter and uses its `handlePostMessage` method to process incoming messages from clients (like the orchestrator).
    4.  Implement `/app/api/orchestrate/route.ts`. Initially, just structure it to receive `POST` requests and perhaps log the input body. The core logic calling agents/MCP will be added in Phase 5.
    5.  **Testing:** Write integration tests for the primary API routes (`/api/agents`, `/api/agents/[agentId]` POST/GET, `/api/mcp/sse`, `/api/mcp/messages`) using Jest and potentially mocking tools or Next.js test handlers.

**Phase 5: Orchestrator & MCP Client Logic Implementation**

*   **Objective:** Implement the core routing and MCP client interaction logic *within* the orchestrator.
*   **Tasks:**
    1.  *(Removed task for implementing standalone `mcpClient.ts`)*
    2.  Implement the V1 logic in `/src/lib/orchestrator.ts`'s `handleRequest` function:
        *   Keyword matching ("reverse", "mcp data").
        *   If agent identified, check metadata for required parameters.
        *   If parameters missing, format and return `needs_parameters` response.
        *   If agent identified and parameters ok (or none needed), call `agentRegistry.getAgent().execute()`.
        *   **If MCP intent identified (`mcp data`):**
            *   Instantiate an MCP `Client` from `@modelcontextprotocol/sdk`.
            *   Create an `SSEServerTransport` (or similar mechanism if running in the same process allows a more direct connection, TBD) to connect to the MCP server's transport endpoints (e.g., `http://localhost:3000/api/mcp/sse`).
            *   Connect the `Client` to the `McpServer` via the transport.
            *   Call the `get_fixed_data` tool using `client.callTool()`.
            *   Handle the response (success or error) from the tool call.
            *   Disconnect the client.
        *   Format final success/error responses based on agent/MCP results.
        *   Handle NLU miss with the defined error structure.
    3.  Update `/app/api/orchestrate/route.ts` to call the enhanced `orchestrator.handleRequest()` and return its response correctly formatted (using `NextResponse.json`).
    4.  **Testing:** Write unit tests for the core logic within `orchestrator.ts`, mocking dependencies like the agent registry and the MCP `Client` interactions (tool calls, connection).

**Phase 6: Frontend UI Shell & Basic State**

*   **Objective:** Build the basic MUI layout, set up state management, and add basic component tests.
*   **Tasks:**
    1.  Configure MUI theme provider (`ThemeRegistry` pattern) in `/app/layout.tsx`.
    2.  Create basic page layout in `/app/page.tsx` using MUI `Container`, `Box`, `AppBar` (optional), etc.
    3.  Create `/src/components/ConversationDisplay.tsx` to render conversation history (messages).
    4.  Create `/src/components/ErrorDisplay.tsx` (e.g., using MUI `Alert`).
    5.  Create `/src/components/VoiceInputButton.tsx` using MUI `Button`/`IconButton`.
    6.  Create `/src/store/conversationStore.ts` using Zustand. Define state slices for `messages` (array of user/assistant messages), `isLoading` (boolean), `error` (object or null).
    7.  Connect `ConversationDisplay` and `ErrorDisplay` to read from the Zustand store.
    8.  **Testing:** Write basic component tests using React Testing Library for `ConversationDisplay` and `ErrorDisplay` to ensure they render correctly based on props/store state.

**Phase 7: Frontend Voice Input & API Integration**

*   **Objective:** Implement voice input, connect the frontend to the orchestrator API, and add component tests.
*   **Tasks:** *(Simplified - no direct frontend MCP handling)*
    1.  Integrate `SpeechRecognition` API into `VoiceInputButton.tsx`. Handle start/stop listening, receiving results, and errors (permissions, no speech). Update component visual state (e.g., indicate listening).
    2.  On receiving a transcript:
        *   Update Zustand store: add user message, set `isLoading` to true, clear `error`.
        *   Make a `POST` request to `/api/orchestrate` with the transcribed text.
        *   On response:
            *   Update Zustand store: set `isLoading` to false.
            *   If success/error: add assistant message or set `error` state.
            *   If `needs_parameters`: store needed parameters in state (new state slice needed). *(This remains for agent parameters)*
    3.  **Testing:** Write component tests for `VoiceInputButton.tsx` verifying state changes and potentially mocking the SpeechRecognition API and the fetch call to `/api/orchestrate`.

**Phase 8: Frontend Dynamic Parameter Form**

*   **Objective:** Implement the UI for handling *agent* parameter requests from the orchestrator and add component tests. *(No changes needed here, as this form is for agent params, not MCP)*
*   **Tasks:**
    1.  Add state slice in Zustand store to hold `parametersNeeded` (array or null).
    2.  Create `/src/components/DynamicForm.tsx`.
    3.  Conditionally render `DynamicForm` in `page.tsx` when `parametersNeeded` state is populated.
    4.  `DynamicForm` should map over `parametersNeeded` and render appropriate MUI controls (`TextField`, etc.) based on the `control` property. Include labels/descriptions from metadata.
    5.  Implement form submission handler:
        *   Collect values from form fields.
        *   Update Zustand store: clear `parametersNeeded`, set `isLoading` to true.
        *   Make a `POST` request to `/api/orchestrate` including the collected parameters and necessary context (identifying the pending agent/task).
        *   Handle response as in Phase 7.
    6.  **Testing:** Write component tests for `DynamicForm.tsx` ensuring it renders correct controls based on input props and that its submission handler works (mocking fetch).

**Phase 9: Testing & Refinement**

*   **Objective:** Ensure all V1 flows work correctly, complete testing coverage, and perform basic cleanup.
*   **Tasks:** *(Minor wording adjustments)*
    1.  Perform end-to-end testing for the "reverse string" flow (including parameter request).
    2.  Perform end-to-end testing for the "mcp data" flow (invoked via orchestrator).
    3.  Test the flow for unrecognized commands.
    4.  Test direct API calls (`/api/agents`, `/api/agents/[agentId]`, `/api/mcp/...` endpoints if needed for debugging).
    5.  Test error display in the UI for various scenarios (API errors, agent errors, MCP errors reported via orchestrator).
    6.  **Testing:** Review test coverage. Add any missing unit, integration, or component tests identified during end-to-end testing.
    7.  Review code for clarity, consistency, and remove any obvious bugs or console logs.
    8.  Ensure basic UI responsiveness and usability.

---

**Future Considerations:**

*   **Orchestrator Complexity:** If the orchestrator logic becomes significantly more complex (e.g., multi-step agent sequences, dynamic planning based on results, complex error recovery loops), consider refactoring it using a dedicated stateful agent framework like LangGraph. The `@langchain/mcp-adapters` library can facilitate integrating MCP tools into a LangGraph setup.
*   **MCP Permissions:** Implement a robust mechanism for handling user permissions for accessing MCP tools/resources, potentially storing consent per user/tool.
*   **Agent/MCP Discovery:** Enhance the dynamic discovery mechanisms for both agents and potentially MCP servers/capabilities if the system grows.

---

This plan provides a structured sequence. We can tackle these phases one by one.