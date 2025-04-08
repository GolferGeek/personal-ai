# V1 Implementation Plan (Next.js Frontend + NestJS Backend)

This document outlines the step-by-step implementation plan for Phase 1 (V1) of the Personal AI project.
**Architecture:** Next.js (App Router) for the frontend UI, NestJS for the backend API (including Agent/Orchestrator/MCP logic).

**Goal:** Build the foundational core interaction flow (UI -> NestJS API -> UI) with dynamic parameter handling and MCP integration.

---

**Phase 1: Setup, Configuration & Testing Setup**

*   **Objective:** Initialize projects, install dependencies, set up basic configuration, directory structure, and testing frameworks.
*   **Tasks:**
    1.  **Frontend:** Run `npx create-next-app@latest --typescript --eslint .` (using App Router) in the project root.
    2.  **Frontend Testing:** Install FE testing dependencies: `npm install --save-dev jest @types/jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest`. Configure Jest for Next.js.
    3.  **Frontend Core:** Install FE core dependencies: `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material zustand`.
    4.  **Backend:** Initialize NestJS project: `npx --yes @nestjs/cli new server --skip-git --package-manager npm`.
    5.  **Backend Modules:** Create initial NestJS modules: `cd server && npx nest g mo api && npx nest g mo mcp && cd ..`.
    6.  **Backend Core:** Install BE dependencies in `/server`: `cd server && npm install @modelcontextprotocol/sdk zod && cd ..`. (Other NestJS dependencies installed by `new`).
    7.  **Monorepo Setup (Optional but Recommended):** Consider setting up Nx or Turborepo to manage shared code (like types), dependencies, and scripts between frontend and backend.
    8.  Create shared `/types` directory (e.g., at root or managed by monorepo tool) for common interfaces (AgentMetadata, etc.).
    9.  Configure FE `.env.local` (for `NEXT_PUBLIC_API_URL=http://localhost:3001` - adjust port if needed). Add `.env*.local` to root `.gitignore`.
    10. Configure BE `.env` file in `/server` (add to `/server/.gitignore`). Define CORS origins, ports, etc.
    11. Create `/src/config/llmConfig.ts` (or move to `server/src/config`) - This config likely belongs in the backend now.

**Phase 2: Core Backend Logic Structures (NestJS)**

*   **Objective:** Define interfaces, create NestJS services/providers for core logic stubs.
*   **Tasks:**
    1.  Define `AgentMetadata`, `ParameterDefinition`, `AgentInfo` in shared `/types`. Define `OrchestratorResponse` types.
    2.  **Agent Registry Service:** Create `AgentRegistryService` (`server/src/shared/agent-registry.service.ts` or within `ApiModule`). Implement stubbed `initializeRegistry`, `getAgent`, `listAgents` methods. Use dynamic agent loading logic from previous plan. Make this service injectable.
    3.  **Orchestrator Service:** Create `OrchestratorService` (`server/src/api/orchestrator.service.ts`). Implement stubbed `handleRequest` method. Inject `AgentRegistryService`. Define necessary DTOs (Data Transfer Objects) for input.
    4.  **MCP Server Service:** Create `McpService` (`server/src/mcp/mcp.service.ts`). Instantiate the `McpServer` from `@modelcontextprotocol/sdk`. Define the `get_fixed_data` tool handler logic within this service. Make the `McpServer` instance available (e.g., as a provider or via the service).

**Phase 3: Simple Agent & MCP Tool Implementation (NestJS)**

*   **Objective:** Implement the specific agent logic and the MCP tool handler within the NestJS backend.
*   **Tasks:**
    1.  Create `/server/src/agents/reverseStringAgent.ts`. Implement metadata and `execute` logic (can be a simple function or class). Agent files will be discovered by `AgentRegistryService`.
    2.  Implement dynamic agent loading logic in `AgentRegistryService.initializeRegistry` (scan `/server/src/agents`). Ensure it runs on application startup (e.g., using `OnModuleInit`).
    3.  Implement the `get_fixed_data` tool handler logic within `McpService` (returns the fixed success message).
    4.  **Testing (Backend):** Write unit tests for `reverseStringAgent` logic, `AgentRegistryService` (mocking fs/imports), `OrchestratorService` stubs, and `McpService` tool handler logic using NestJS testing utilities (`@nestjs/testing`).

**Phase 4: Backend API Endpoints (NestJS)**

*   **Objective:** Implement NestJS controllers to expose backend functionality via HTTP endpoints.
*   **Tasks:**
    1.  **API Controller:** Create `ApiController` (`server/src/api/api.controller.ts`).
        *   Implement `GET /api/agents` endpoint using `AgentRegistryService.listAgents()`.
        *   Implement `GET /api/agents/:agentId` endpoint using `AgentRegistryService.getAgent()`.
        *   Implement `POST /api/agents/:agentId` endpoint. Inject `AgentRegistryService`, perform validation (using NestJS Pipes/DTOs), call `agentInfo.execute()`.
        *   Implement `POST /api/orchestrate` endpoint. Inject `OrchestratorService`, use DTOs for request body, call `orchestratorService.handleRequest()`. (Logic to be implemented in Phase 5).
    2.  **MCP Controller:** Create `McpController` (`server/src/mcp/mcp.controller.ts`).
        *   Implement `GET /api/mcp/sse` endpoint. Use NestJS SSE capabilities (`@nestjs/common` Sse decorator). Create `SSEServerTransport`, connect it to the `McpServer` instance from `McpService`, manage connections/sessions.
        *   Implement `POST /api/mcp/messages` endpoint. Find the transport by session ID, use `transport.handlePostMessage`.
    3.  Configure CORS in `server/src/main.ts` (`app.enableCors()`).
    4.  **Testing (Backend):** Write e2e tests (`.e2e-spec.ts`) for the NestJS API endpoints using `@nestjs/testing` and `supertest`.

**Phase 5: Orchestrator & MCP Client Logic Implementation (NestJS)**

*   **Objective:** Implement the core routing and MCP client interaction logic *within* the `OrchestratorService`.
*   **Tasks:**
    1.  Implement the V1 logic in `OrchestratorService.handleRequest`:
        *   Keyword matching ("reverse", "mcp data").
        *   Agent Handling: Check params, return `needs_parameters` response if needed, call agent execute.
        *   **MCP Handling (`mcp data`):**
            *   Instantiate an MCP `Client` from `@modelcontextprotocol/sdk`.
            *   Connect the `Client` to the *local* NestJS MCP SSE endpoint (`http://localhost:3001/api/mcp/sse` - use config/env var for URL).
            *   Call the `get_fixed_data` tool using `client.callTool()`.
            *   Handle the response/error.
            *   Disconnect the client.
        *   Format final success/error responses.
        *   Handle NLU miss.
    2.  Ensure `ApiController` correctly uses the updated `OrchestratorService`.
    3.  **Testing (Backend):** Write/update unit tests for `OrchestratorService` logic, mocking `AgentRegistryService` and MCP `Client` interactions.

**Phase 6: Backend Conversation Persistence (NestJS)**

*   **Objective:** Implement conversation history persistence and user identity on the backend to support cross-device continuity.
*   **Tasks:**
    1.  **Conversation Data Models:** Create models in `server/src/shared/models/`
        *   Create `Conversation` model with fields for ID, user ID, title, created date, etc.
        *   Create `Message` model with fields for ID, conversation ID, content, role (user/system), timestamp, etc.
    2.  **User Identity & Session Management:**
        *   Create `UserService` for managing user identities (can start with simple anonymous sessions)
        *   Implement session middleware to attach user ID to requests
        *   Store user preferences and settings
    3.  **Conversation Service:** Create `ConversationService` in `server/src/shared/conversation.service.ts`
        *   Implement methods to create, read, update conversations and messages
        *   Add support for conversation search and filtering
    4.  **Conversation Controller:** Create `ConversationController` in `server/src/api/conversation.controller.ts`
        *   Implement `GET /api/conversations` to list user conversations
        *   Implement `GET /api/conversations/:id` to get a specific conversation with messages
        *   Implement `POST /api/conversations` to create a new conversation
        *   Implement `POST /api/conversations/:id/messages` to add a message to a conversation
    5.  **Integrate with Orchestrator:**
        *   Update `OrchestratorService` to store queries and responses in the conversation history
        *   Add conversation context to enhance agent responses
    6.  **Testing:** Write unit and e2e tests for the conversation management functionality

**Phase 7: Frontend UI Shell & API Integration (Next.js)**

*   **Objective:** Build the basic MUI layout and integrate with backend conversation API.
*   **Tasks:**
    1.  Configure MUI theme provider (`ThemeRegistry`) in `app/layout.tsx`.
    2.  Create basic page layout in `app/page.tsx` using MUI.
    3.  Create components:
        *   `/src/components/ConversationDisplay.tsx` - Display messages in the current conversation
        *   `/src/components/ConversationList.tsx` - List and select conversations
        *   `/src/components/ErrorDisplay.tsx` - Show errors
        *   `/src/components/VoiceInputButton.tsx` - Voice input UI
    4.  Create `/src/api/conversationApi.ts` with functions to interact with conversation endpoints
    5.  Create `/src/store/uiStore.ts` using Zustand for UI-only state (loading indicators, etc.)
    6.  Connect components to backend API endpoints
    7.  **Testing (Frontend):** Write basic component tests using React Testing Library

**Phase 8: Frontend Voice Input & Conversation Integration (Next.js)**

*   **Objective:** Implement voice input and integrate with the backend conversation API.
*   **Tasks:**
    1.  Integrate `SpeechRecognition` API into `VoiceInputButton.tsx`.
    2.  On receiving transcript:
        *   Show in UI immediately
        *   Make a `POST` request to add message to current conversation
        *   Make a `POST` request to the orchestrator endpoint with the transcript
        *   Handle response (success, error, needs_parameters) and update UI
    3.  **Testing (Frontend):** Write component tests for `VoiceInputButton.tsx`, mocking SpeechRecognition and the API calls.

**Phase 9: Frontend Dynamic Parameter Form (Next.js)**

*   **Objective:** Implement the UI for handling agent parameter requests.
*   **Tasks:**
    1.  Add parameter handling to UI store
    2.  Create `/src/components/DynamicForm.tsx`
    3.  Conditionally render `DynamicForm` when needed
    4.  `DynamicForm` renders controls based on parameter definitions
    5.  Form submission handler makes appropriate API requests with parameters
    6.  Handle response and update conversation display
    7.  **Testing (Frontend):** Write component tests for `DynamicForm.tsx`

**Phase 10: Testing & Refinement**

*   **Objective:** Ensure all V1 flows work correctly across FE/BE, complete testing coverage, and perform cleanup.
*   **Tasks:**
    1.  Test complete conversation flows end-to-end
    2.  Test cross-device conversation continuity
    3.  Test error handling flows
    4.  Review test coverage (FE & BE)
    5.  Review code for clarity, consistency, remove logs
    6.  Ensure responsive UI for all screen sizes

---

**Future Considerations:**

*   **Authentication:** Implement proper user authentication beyond simple sessions
*   **Orchestrator Complexity:** If the orchestrator logic becomes significantly more complex (e.g., multi-step agent sequences, dynamic planning based on results, complex error recovery loops), consider refactoring it using a dedicated stateful agent framework like LangGraph. The `@langchain/mcp-adapters` library can facilitate integrating MCP tools into a LangGraph setup.
*   **MCP Permissions:** Implement a robust mechanism for handling user permissions for accessing MCP tools/resources, potentially storing consent per user/tool.
*   **Agent/MCP Discovery:** Enhance the dynamic discovery mechanisms for both agents and potentially MCP servers/capabilities if the system grows.
*   **Performance Optimization:** Add caching for conversation history and agent responses

---

This plan provides a structured sequence for the updated architecture with cross-device conversation persistence.