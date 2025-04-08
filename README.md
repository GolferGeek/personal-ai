# Personal AI

A voice-enabled AI assistant with conversation persistence and dynamic agent interaction.

## Features

- Voice input with speech recognition
- Text-based conversation
- Persistent conversation history across devices
- Dynamic parameter handling for agent interactions
- MCP (Model Context Protocol) integration

## Architecture

- **Frontend**: Next.js (App Router) with Material UI, Zustand for state management
- **Backend**: NestJS with conversation persistence, agent registry, and MCP server

## V2 Monorepo Structure

The project has been restructured as a monorepo using pnpm workspaces and Turborepo for better maintainability and scalability.

### Getting Started with V2

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Running the development servers:

   ```bash
   # Run both the API and Web app together
   pnpm dev

   # Run only the web app (Next.js frontend)
   pnpm --filter "@personal-ai/web" dev

   # Run only the API app (NestJS backend)
   pnpm --filter "@personal-ai/api" dev
   ```

3. Access the applications:

   - Web application: http://localhost:3000
   - API (NestJS): http://localhost:3001/api
   - API documentation: http://localhost:3001/api/docs

4. Building the apps:

   ```bash
   pnpm build
   ```

5. Running in production mode:

   ```bash
   # Build all packages and apps
   pnpm build

   # Start both frontend and backend together
   pnpm startAll

   # Start individual apps
   pnpm --filter "@personal-ai/web" start
   pnpm --filter "@personal-ai/api" start
   ```

### Project Structure

- `apps/web`: Next.js frontend application
- `apps/api`: NestJS backend API
- `packages/models`: Shared data models
- `packages/utils`: Shared utilities
- `packages/ui`: Shared UI components
- `packages/config-*`: Shared configurations

### Package-Specific Documentation

Each package has its own README with specific details about usage and development.

### Troubleshooting

If you encounter issues with package resolution:

1. Clean the build artifacts and reinstall dependencies:

   ```bash
   pnpm clean && pnpm install
   ```

2. Ensure all packages are built in the correct order:
   ```bash
   pnpm build
   ```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/personal-ai.git
   cd personal-ai
   ```

2. Install frontend dependencies

   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd server
   npm install
   cd ..
   ```

### Running the Application

1. Start the backend server

   ```
   cd server
   npm run start:dev
   ```

   The NestJS backend will run on http://localhost:3001

2. In another terminal, start the frontend
   ```
   npm run dev
   ```
   The Next.js frontend will run on http://localhost:3000

### Testing

#### Frontend Tests

```
npm test
```

#### Backend Tests

```
cd server
npm test
```

## Usage

1. Open the application at http://localhost:3000
2. Create a new conversation or select an existing one
3. Begin interacting with the assistant using:
   - Type a message and press Enter or click Send
   - Click the microphone icon to use voice input

### Agent Commands

- "reverse [text]" - Reverses the provided text
- "mcp data" - Retrieves data using the MCP tool

## Implementation Plan

The implementation follows a phased approach as detailed in `docs/v1-implementation-plan.md`.

Current Status: Phase 11 - End-to-End Testing

## License

[MIT License](LICENSE)

## Contributors

- Your Name <your.email@example.com>
