# Migration Tasks

## Packages (Shared Code)

- [x] Create shared models package (`@personal-ai/models`)
  - [x] Define conversation model
  - [x] Define message model
  - [x] Set up package.json

- [x] Create utilities package (`@personal-ai/utils`)
  - [x] Move formatters (date, string)
  - [x] Move validators
  - [x] Add API utilities
  - [x] Set up package.json

- [x] Create UI components package (`@personal-ai/ui`)
  - [x] Move ConversationList component
  - [x] Move DynamicForm component
  - [x] Move ConversationDisplay component
  - [x] Move TextInputButton component
  - [x] Move ErrorDisplay component
  - [x] Set up package.json

## Next.js Web App

- [x] Basic app structure setup
  - [x] Create apps/web directory
  - [x] Set up package.json

- [x] Move core app files
  - [x] Migrate layout.tsx
  - [x] Migrate Providers.tsx
  - [x] Migrate globals.css
  - [x] Migrate page.tsx
  - [x] Update imports to use package components

- [x] Move API routes to web app
  - [x] Move conversation API routes
  - [x] Move conversation by ID API routes
  - [x] Move conversation messages API routes
  - [x] Move agent parameters API routes
  - [x] Move agent API routes
  - [x] Move orchestration API routes

- [ ] Configuration
  - [x] Set up next.config.js
  - [ ] Configure TypeScript
  - [ ] Configure ESLint
  - [ ] Set up Jest for web app

## NestJS API App

- [x] Basic app structure setup
  - [x] Create apps/api directory
  - [x] Set up package.json

- [ ] Create API features
  - [ ] Implement conversation controllers
  - [ ] Implement agent controllers
  - [ ] Implement orchestration controllers

- [ ] Configuration
  - [ ] Set up NestJS config
  - [ ] Configure TypeScript
  - [ ] Set up authentication
  - [ ] Configure tests

## Testing

- [ ] Set up test infrastructure
  - [x] Configure root Jest setup
  - [ ] Set up test mocks
  - [ ] Create test helpers

- [ ] Update tests
  - [ ] Update UI component tests
  - [ ] Update API endpoint tests
  - [ ] Create package-specific tests

## Build Configuration

- [ ] Set up build processes
  - [ ] Configure TypeScript references
  - [ ] Set up package building
  - [ ] Configure development scripts

- [ ] Update root package.json
  - [ ] Add workspace configuration
  - [ ] Update scripts
  - [ ] Configure dependencies 