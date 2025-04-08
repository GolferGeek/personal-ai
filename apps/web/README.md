# Personal AI Web Application

This is the Next.js frontend for the Personal AI application.

## Development

To start the development server:

```bash
# From the root directory
pnpm --filter "@personal-ai/web" dev

# Or from the web directory
cd apps/web
pnpm dev
```

The web application will be available at http://localhost:3000

## Features

- Conversation management
- Real-time chat interface
- Integration with AI agents

## Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov
```
