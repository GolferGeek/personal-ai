# Application Migration Plan

## Current Structure
- Root level Next.js app (`app/` directory)
- Root level Next.js API routes (`app/api/` directory)
- Partially migrated UI components in packages (`packages/ui`)
- Shared models in packages (`packages/models`)
- Utility functions in packages (`packages/utils`)
- New app structure started but incomplete (`apps/web` and `apps/api`)

## Migration Steps

### 1. Complete Next.js App Migration to `apps/web`

- [x] Create basic app structure with package.json and configs
- [ ] Migrate app layouts, providers, and pages from root to `apps/web/app`
- [ ] Migrate global CSS and other assets
- [ ] Update imports to use shared packages (`@personal-ai/ui`, etc.)
- [ ] Configure proper dependencies and build scripts
- [ ] Set up Jest configuration specifically for the web app
- [ ] Move tests for web components to the appropriate locations

### 2. API Migration

#### Option A: Move API routes to NestJS (`apps/api`)
- [x] Set up basic NestJS app structure
- [ ] Create equivalent controllers/services for each API route
- [ ] Implement proper error handling and validation
- [ ] Set up authentication and authorization
- [ ] Configure database connections and repositories
- [ ] Move API-specific tests
- [ ] Update frontend to use new API endpoints

#### Option B: Keep Next.js API routes but move to monorepo
- [ ] Move API routes to `apps/web/app/api`
- [ ] Update imports to use shared packages
- [ ] Configure middleware and API handlers
- [ ] Update tests for API routes

### 3. Package Updates

- [ ] Update package versions to be consistent (all at 0.0.1)
- [ ] Fix dependency references (change from `"0.1.0"` to `"0.0.1"`)
- [ ] Add missing types packages where needed
- [ ] Configure proper peer dependencies for UI components

### 4. Build Configuration

- [ ] Create root-level build scripts to build all packages
- [ ] Configure watch mode for development
- [ ] Set up TypeScript references for faster incremental builds
- [ ] Configure proper output paths for compiled code

### 5. Testing Infrastructure

- [ ] Create Jest configuration for each package and app
- [ ] Move and update tests to match new structure
- [ ] Create test helpers and mocks in shared locations
- [ ] Set up CI workflow for running tests

### 6. Development Workflow

- [ ] Create scripts for easy local development
- [ ] Set up hot reloading across packages
- [ ] Configure debug configurations
- [ ] Update documentation with new development instructions

## Decision Points

1. **Next.js API vs NestJS**: Decide whether to move the Next.js API routes to the NestJS app or keep them as part of the Next.js app in the monorepo.
2. **Package Manager**: Confirm whether to use npm, yarn, or pnpm for the monorepo.
3. **Development Strategy**: Decide whether to develop with all packages linked locally or use published versions.

## Timeline Estimate

1. Package Structure Updates: 1 day
2. Next.js App Migration: 2 days
3. API Migration: 2-3 days
4. Build & Test Configuration: 1-2 days
5. Testing & Debugging: 1-2 days

Total estimated time: 7-10 days 