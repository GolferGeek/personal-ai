# V1 Implementation Plan

This document outlines the step-by-step implementation plan for Phase 1 (V1) of the Personal AI project, based on the specifications in `v1-plan.md`.

**Goal:** Build the foundational core interaction flow (UI -> Orchestrator -> Agent/MCP -> UI) with dynamic parameter handling.

---

**Phase 1: Setup, Configuration & Testing Setup**

*   **Objective:** Initialize the project, install dependencies, set up basic configuration, directory structure, and the testing framework.
*   **Tasks:**
    1.  Run `npx create-next-app@latest --typescript --eslint personal-ai` (using App Router).
    2.  **Testing Setup:** Install testing dependencies: `npm install --save-dev jest @types/jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest`. Configure Jest for Next.js (create `jest.config.js`, `jest.setup.js`).
    3.  Install core dependencies: `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material zustand`.
    4.  Create initial project directories: `/src/lib`, `/src/agents`, `/src/mcp`, `/src/config`, `/src/components`, `/src/store`.
    5.  Create `.env.local` file. **Note:** This file is for secrets (like API keys) only and should be added to `.gitignore`. It will remain empty for now.
    6.  Create `/src/config/llmConfig.ts`. Define basic structure for `availableModels` (can be empty or have stubs, potentially referencing key env vars like `apiKeyEnvVar: 'OPENAI_API_KEY'`). **Define default provider, model, and temperature directly in this file as exported constants.**

**Phase 2: Core Backend Logic Structures**

*   **Objective:** Define interfaces and create stubbed implementations for core backend services.
*   **Tasks:**
    1.  Define Agent Metadata TypeScript interface (in `/src/lib/types.ts` or similar) including `id`, `name`, `description`, `parameters` array (`name`, `type`, `required`, `description`, `control`).
    2.  Create `/src/lib/agentRegistry.ts` with stubbed functions: `initializeRegistry()`, `getAgent(id): AgentInfo | undefined`, `listAgents(): AgentMetadata[]`. Define `AgentInfo` and `AgentMetadata` types.
    3.  Create `/src/lib/orchestrator.ts` with a stubbed main function: `async handleRequest(input: { type: 'text' | 'params', content: string | Record<string, any>, context?: any }): Promise<OrchestratorResponse>`. Define `OrchestratorResponse` types (e.g., `{ status: 'success', data: any }`, `{ status: 'error', error: {...} }`, `{ status: 'needs_parameters', parameters_needed: ParameterDefinition[] }`).
    4.  Define V1 MCP protocol (JSON structure for request/response) in comments within relevant files or create `docs/mcp-protocol-v1.md`.
    5.  Create `/src/lib/mcpClient.ts` with a stubbed function: `async callMcp(taskId: string, params: Record<string, any>): Promise<McpResponse>`. Define `McpResponse` type based on the protocol.

**Phase 3: Simple Agent & MCP Server Implementation**

*   **Objective:** Implement the specific agent and MCP server logic for V1 demonstration and add unit tests.
*   **Tasks:**
    1.  Create `/src/agents/reverseStringAgent.ts`. Implement the `metadata` according to the standard (using `inputText`, `textInput` control) and the `run({ inputText })` function.
    2.  Implement the actual agent discovery logic in `/src/lib/agentRegistry.ts`: `initializeRegistry` function should scan `/src/agents`, dynamically `import()` `.ts` files, validate metadata, and populate the internal registry map. Ensure this runs reliably on server startup (e.g., potentially via a helper function called from `layout.tsx` or a custom server if needed, needs care with Next.js build process).
    3.  Implement the V1 MCP Server logic to handle `task_id: "get_fixed_data"` (no params needed). This can initially be directly within the `/api/mcp/route.ts` file for simplicity. It should return the defined fixed success message or a standard MCP error structure.
    4.  **Testing:** Write unit tests for `reverseStringAgent.ts`'s `run` function. Write unit tests for `agentRegistry.ts` core logic (mocking filesystem/dynamic imports if necessary).

**Phase 4: Backend API Route Implementation**

*   **Objective:** Create the Next.js API routes to expose backend functionality and add integration tests.
*   **Tasks:**
    1.  Implement `GET` handler in `/app/api/agents/route.ts` using `agentRegistry.listAgents()`.
    2.  Implement `GET` (metadata) and `POST` (execution) handlers in `/app/api/agents/[agentId]/route.ts`. Use `agentRegistry.getAgent()`. The `POST` handler must include input validation logic based on agent metadata.
    3.  Implement `POST` handler in `/app/api/mcp/route.ts` to act as the V1 MCP Server endpoint, using the logic from Phase 3.
    4.  Implement `/app/api/orchestrate/route.ts`. Initially, just structure it to receive `POST` requests and perhaps log the input body.
    5.  **Testing:** Write integration tests for the primary API routes (`/api/agents`, `/api/agents/[agentId]` POST/GET, `/api/mcp`) using Jest and potentially mocking tools or Next.js test handlers to verify request/response behavior.

**Phase 5: Orchestrator & MCP Client Logic Implementation**

*   **Objective:** Implement the core routing and interaction logic within the orchestrator and MCP client.
*   **Tasks:**
    1.  Implement `/src/lib/mcpClient.ts`: `callMcp` function should use `fetch` to make a `POST` request to `/api/mcp` following the defined protocol, parse the response.
    2.  Implement the V1 logic in `/src/lib/orchestrator.ts`:
        *   Keyword matching ("reverse", "mcp data").
        *   If agent identified, check metadata for required parameters.
        *   If parameters missing, format and return `needs_parameters` response.
        *   If agent identified and parameters ok (or none needed), call `agentRegistry.getAgent().execute()`.
        *   If MCP identified, call `mcpClient.callMcp()`.
        *   Format success/error responses based on agent/MCP results.
        *   Handle NLU miss with the defined error structure.
    3.  Update `/app/api/orchestrate/route.ts` to call `orchestrator.handleRequest()` and return its response correctly formatted (using `NextResponse.json`).
    4.  **Testing:** Write unit tests for the core logic within `orchestrator.ts` and `mcpClient.ts` (mocking dependencies like registry/fetch).

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
*   **Tasks:**
    1.  Integrate `SpeechRecognition` API into `VoiceInputButton.tsx`. Handle start/stop listening, receiving results, and errors (permissions, no speech). Update component visual state (e.g., indicate listening).
    2.  On receiving a transcript:
        *   Update Zustand store: add user message, set `isLoading` to true, clear `error`.
        *   Make a `POST` request to `/api/orchestrate` with the transcribed text.
        *   On response:
            *   Update Zustand store: set `isLoading` to false.
            *   If success/error: add assistant message or set `error` state.
            *   If `needs_parameters`: store needed parameters in state (new state slice needed).
    3.  **Testing:** Write component tests for `VoiceInputButton.tsx` verifying state changes and potentially mocking the SpeechRecognition API and the fetch call to `/api/orchestrate`.

**Phase 8: Frontend Dynamic Parameter Form**

*   **Objective:** Implement the UI for handling parameter requests from the orchestrator and add component tests.
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
*   **Tasks:**
    1.  Perform end-to-end testing for the "reverse string" flow (including parameter request).
    2.  Perform end-to-end testing for the "mcp data" flow.
    3.  Test the flow for unrecognized commands.
    4.  Test direct API calls (`/api/agents`, `/api/agents/[agentId]`) using a tool like Postman or `curl`.
    5.  Test error display in the UI for various scenarios (API errors, agent errors).
    6.  **Testing:** Review test coverage. Add any missing unit, integration, or component tests identified during end-to-end testing.
    7.  Review code for clarity, consistency, and remove any obvious bugs or console logs.
    8.  Ensure basic UI responsiveness and usability.

---

This plan provides a structured sequence. We can tackle these phases one by one.