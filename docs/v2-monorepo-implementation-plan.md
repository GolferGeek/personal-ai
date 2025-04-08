# V2 Monorepo Implementation Plan

This document outlines the step-by-step plan for migrating our current project structure to a modern monorepo architecture using pnpm workspaces and Turborepo.

## Phase 1: Setup Monorepo Foundation (Week 1)

### 1.1 Initialize Monorepo Structure
- [ ] Create `apps` and `packages` directories
- [ ] Set up pnpm workspaces
  ```
  # pnpm-workspace.yaml
  packages:
    - 'apps/*'
    - 'packages/*'
  ```
- [ ] Configure Turborepo
  ```
  # turbo.json
  {
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**"]
      },
      "test": {
        "dependsOn": ["^build"],
        "outputs": []
      },
      "lint": {
        "outputs": []
      },
      "dev": {
        "cache": false
      }
    }
  }
  ```
- [ ] Update root package.json with new scripts
  ```json
  {
    "scripts": {
      "dev": "turbo run dev",
      "build": "turbo run build",
      "test": "turbo run test",
      "lint": "turbo run lint"
    }
  }
  ```

### 1.2 Create Shared Configuration Packages
- [ ] Create `packages/config` package
  - [ ] ESLint configuration
  - [ ] TypeScript base configuration
  - [ ] Jest configuration
- [ ] Set up `packages/tsconfig` with various base configs
  ```
  packages/tsconfig/
  ├── base.json
  ├── nextjs.json
  ├── nestjs.json
  └── react-library.json
  ```

## Phase 2: Extract Shared Packages (Week 2)

### 2.1 Create Models Package
- [ ] Create `packages/models` directory
- [ ] Extract conversation and message models from current codebase
- [ ] Set up TypeScript configuration
- [ ] Add unit tests for models
- [ ] Create package.json with proper dependencies

### 2.2 Create UI Components Package
- [ ] Create `packages/ui` directory
- [ ] Move reusable UI components from `src/components`
- [ ] Set up Storybook for component documentation
- [ ] Ensure proper styling system compatibility
- [ ] Add comprehensive tests for UI components

### 2.3 Create Utils Package
- [ ] Create `packages/utils` directory
- [ ] Extract utility functions from current codebase
- [ ] Set up TypeScript configuration
- [ ] Add unit tests for utilities

## Phase 3: Setup Next.js Frontend (Week 3)

### 3.1 Create Next.js App
- [ ] Create `apps/web` directory
- [ ] Initialize Next.js app with App Router
- [ ] Configure package.json with appropriate dependencies
- [ ] Set up proper TypeScript configuration
- [ ] Implement proper eslint configuration

### 3.2 Migrate Frontend Code
- [ ] Move components from `src/components` to `apps/web/components`
- [ ] Migrate pages from `app` directory to `apps/web/app`
- [ ] Update imports to use packages from the monorepo
- [ ] Ensure components use shared UI components where appropriate
- [ ] Migrate testing setup and tests

### 3.3 Setup Frontend API Client
- [ ] Create API client for communicating with backend
- [ ] Implement request/response types using shared models
- [ ] Setup proper error handling
- [ ] Add comprehensive tests

## Phase 4: Setup Nest.js Backend (Week 4)

### 4.1 Initialize Nest.js App
- [ ] Create `apps/api` directory
- [ ] Initialize Nest.js application
- [ ] Configure package.json with appropriate dependencies
- [ ] Set up proper TypeScript configuration
- [ ] Implement proper eslint configuration

### 4.2 Implement Core Backend Modules
- [ ] Create domain-driven module structure
  ```
  apps/api/src/
  ├── conversations/
  │   ├── conversation.controller.ts
  │   ├── conversation.service.ts
  │   ├── conversation.module.ts
  │   └── tests/
  ├── agents/
  │   ├── agent.controller.ts
  │   ├── agent.service.ts
  │   ├── agent.module.ts
  │   └── tests/
  ```
- [ ] Implement proper dependency injection
- [ ] Use shared models from `packages/models`

### 4.3 Migrate API Routes
- [ ] Migrate routes from `app/api` to Nest.js controllers
- [ ] Implement proper validation using class-validator
- [ ] Set up consistent error handling
- [ ] Add swagger documentation

## Phase 5: Integration and Testing (Week 5)

### 5.1 Setup Development Environment
- [ ] Configure dev server for concurrent running of apps
- [ ] Implement environment variable management
- [ ] Set up debugging configuration

### 5.2 Integration Testing
- [ ] Create end-to-end tests for critical user flows
- [ ] Implement API integration tests
- [ ] Verify cross-package functionality

### 5.3 Performance Testing
- [ ] Benchmark build times
- [ ] Optimize Turborepo caching
- [ ] Test hot reloading across packages

## Phase 6: CI/CD and Deployment (Week 6)

### 6.1 CI Pipeline
- [ ] Set up GitHub Actions workflow for monorepo
- [ ] Configure caching for faster builds
- [ ] Implement selective testing based on changed packages

### 6.2 Deployment Strategy
- [ ] Configure deployment for Next.js frontend
- [ ] Set up Nest.js API deployment
- [ ] Implement staging/production environments

### 6.3 Documentation
- [ ] Create comprehensive README for monorepo
- [ ] Document development workflow
- [ ] Create package-specific documentation
- [ ] Create API documentation with Swagger UI

## Migration Checklist

### Prerequisites
- [ ] Backup current codebase
- [ ] Ensure all tests pass in current structure
- [ ] Document current API contracts

### Key Milestones
- [ ] Monorepo infrastructure setup complete
- [ ] Shared packages extracted and working
- [ ] Next.js frontend migrated
- [ ] Nest.js backend implemented
- [ ] All tests passing in new structure
- [ ] CI/CD pipeline operational
- [ ] Documentation complete

## Rollback Plan

In case of critical issues during migration:

1. Identify the problematic changes
2. Roll back to the previous working version
3. Document issues encountered
4. Revise implementation plan accordingly

## Post-Migration Tasks

- [ ] Performance optimization
- [ ] Dependency audit and cleanup
- [ ] Developer training on new structure
- [ ] Monitor for any regressions
- [ ] Gather feedback for structure improvements 