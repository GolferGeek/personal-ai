# Personal AI API

This is the NestJS backend API for the Personal AI application.

## Development

To start the development server:

```bash
# From the root directory
pnpm --filter "@personal-ai/api" dev

# Or from the api directory
cd apps/api
pnpm dev
```

The API will be available at http://localhost:3001/api

## API Documentation

Once the server is running, you can access the Swagger documentation at:

http://localhost:3001/api/docs

## Endpoints

The API provides the following main endpoints:

- `/api/conversations`: Manage conversations
- `/api/agents`: Manage AI agents
- `/api/orchestration`: Interact with AI agents

## Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov
```
