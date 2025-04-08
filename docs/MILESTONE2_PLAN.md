# Milestone 2 Plan

## Package Structure Migration

1. ✅ Move shared models to `@personal-ai/models` package
   - [x] Create basic interfaces for conversations, messages, etc.
   - [x] Configure package exports correctly

2. ✅ Move utility functions to `@personal-ai/utils` package
   - [x] Formatters for dates, strings, etc.
   - [x] Validators for input data

3. ✅ Move UI components to `@personal-ai/ui` package
   - [x] ConversationList component
   - [x] DynamicForm component
   - [ ] Move remaining components (ConversationDisplay, TextInputButton)

## Testing Infrastructure

1. ✅ Update Jest configuration
   - [x] Configure module resolution for monorepo structure
   - [x] Set up mocks for browser APIs (scrollIntoView, etc.)

2. [ ] Set up test suites for packages
   - [ ] Create unit tests for models
   - [ ] Create unit tests for utils
   - [ ] Update UI component tests to use shared packages

## Build Configuration

1. [ ] Configure package building
   - [ ] Set up TypeScript build configuration for packages
   - [ ] Configure proper dependency resolution
   - [ ] Set up watch mode for development

2. [ ] Update pnpm workspace configuration
   - [ ] Fix workspace reference issues
   - [ ] Configure proper package versioning
   - [ ] Ensure dependencies are correctly hoisted

## Linting Rules

1. [ ] Improve ESLint configuration
   - [ ] Set up specific rules for React components
   - [ ] Configure stricter type checking
   - [ ] Add rules for imports organization

## LLM Integration

1. [ ] Design orchestrator architecture with LLM integration
   - [ ] Define core interfaces for LLM providers
   - [ ] Create abstraction layer for different LLM services
   - [ ] Design prompt templates structure

2. [ ] Implement basic LLM integration
   - [ ] Create service for making LLM requests
   - [ ] Implement prompt handling
   - [ ] Add support for streaming responses

## Next Steps

- Complete the remaining UI component migration
- Set up comprehensive test suites for all packages
- Begin implementing the LLM integration services 