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
