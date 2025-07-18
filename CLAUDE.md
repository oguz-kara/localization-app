# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **multi-tenant localization management service** - an API-first platform for managing translations across multiple projects and languages. The system was built from a CRM base, retaining core functionalities like authentication and multi-tenancy while evolving into a comprehensive localization solution.

## Project Structure

- `api/` - NestJS GraphQL API backend (localization service)
- `web-admin/` - Next.js React frontend (localization management dashboard)
- `docker-compose.yml` - PostgreSQL, Redis, and test database services

## Core Architectural Concepts

### API-First Design
- **Primary Interface**: GraphQL API for all operations
- **No Mandatory UI**: Service is entirely controllable through API
- **Future SDKs**: Designed for eventual SDK development (JS, Python, Java)
- **Webhooks**: Reactive notifications for translation updates

### Multi-Tenancy Hierarchy
```
Tenant (Company/Organization)
├── Project (Web App, Mobile App, etc.)
│   ├── Language (en, es, fr, etc.)
│   └── Translation Keys (buttons.submit, welcome.message)
```

### Key Features
1. **Automated Translation & Sync Engine**: AI-powered translation with human review workflow
2. **Multi-tenant Project Scoping**: Complete data isolation per tenant
3. **Translation Workflow**: Machine Translated → In Review → Approved
4. **Rich Context Management**: Developer notes, screenshots, usage context
5. **Versioning & Audit Trails**: Complete history of translation changes

## Common Development Commands

### Backend (api/)
```bash
cd api
pnpm install
pnpm run start:dev    # Development server with watch mode
pnpm run build        # Build for production
pnpm run start:prod   # Production server
pnpm run lint         # ESLint
pnpm run test         # Unit tests
pnpm run test:e2e     # End-to-end tests
pnpm run test:cov     # Test coverage
pnpm run seed         # Run database seeder
```

### Frontend (web-admin/)
```bash
cd web-admin
pnpm install
pnpm run dev          # Development server (uses Turbopack)
pnpm run build        # Build for production
pnpm run start        # Production server
pnpm run lint         # ESLint
pnpm run generate     # Generate GraphQL types
```

### Database & Services
```bash
docker-compose up -d  # Start PostgreSQL, Redis, and test database
```

## Architecture Overview

### Backend (NestJS GraphQL API)
- **Framework**: NestJS with GraphQL (code-first approach)
- **Database**: PostgreSQL with Prisma ORM
- **Background Jobs**: Redis + BullMQ for translation processing
- **Authentication**: JWT + API Key authentication
- **Module Structure**: Domain-driven design:
  - `api/graphql/` - GraphQL resolvers, DTOs, entities
  - `application/services/` - Business logic
  - `domain/` - Domain entities and exceptions
  - `infrastructure/` - External service integrations

### Frontend (Next.js React)
- **Framework**: Next.js 15.3.3 with App Router
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form with Zod validation
- **GraphQL**: Apollo Client with code generation
- **UI Components**: Radix UI primitives with custom components
- **Authentication**: NextAuth.js integration

### Database Schema (Localization-focused)
Multi-tenant translation management system:
- **Core Entities**: User, Tenant, Project, Language
- **Translation System**: TranslationKey, Translation, TranslationHistory
- **Workflow**: Translation status management (untranslated, in_review, approved)
- **Multi-tenancy**: All data scoped by tenant/channel

## Implementation Roadmap

### Phase 0: Foundation (1 Week)
- NestJS project setup with Prisma
- Core schema: Tenant, Project, Language, User
- GraphQL setup with health check
- Docker containerization

### Phase 1: Core MVP (3 Weeks)
- Multi-tenancy & project scoping
- JWT authentication with guards
- Basic key management (TranslationKey, Translation models)
- Core API: `getTranslations(projectId, language)`

### Phase 2: Management Features (4 Weeks)
- Versioning & audit trails (TranslationHistory)
- User roles (Admin, Translator, Reviewer)
- Translation workflow status
- Context management (notes, screenshots)
- Import/export functionality

### Phase 3: AI Integration (3 Weeks)
- Redis + BullMQ background jobs
- Translation provider abstraction
- OpenAI/Google Translate integration
- Automated sync engine

### Phase 4: User Interface (4+ Weeks)
- React/Next.js dashboard
- Translation matrix view
- User management
- Apollo Client integration

## Key Development Practices

### Code Generation
- Run `pnpm run generate` in web-admin after GraphQL schema changes
- Backend uses code-first GraphQL with TypeScript decorators
- Frontend uses graphql-codegen for type-safe queries

### Testing Strategy
- Backend: Jest for unit/integration tests, follows NestJS testing patterns
- Test regex: `.*\.(spec|int-spec|e2e-spec)\.ts$`
- Mocking: Uses jest-mock-extended for comprehensive mocking

### Multi-tenancy
- All requests scoped by tenant/channel
- API keys scoped to projects
- Database queries automatically isolated

### Translation Workflow
```
Untranslated → Machine Translated → In Review → Approved
```

### Development Workflow
1. Start services: `docker-compose up -d`
2. Backend: `cd api && pnpm run start:dev`
3. Frontend: `cd web-admin && pnpm run dev`
4. GraphQL Playground: http://localhost:3001/graphql
5. Frontend: http://localhost:3000

## Important Implementation Details

### Request Context Pattern
Services use RequestContext for tenant isolation and user context:
```typescript
// Most service methods accept RequestContext as first parameter
async getTranslations(ctx: RequestContext, projectId: string, language: string)
```

### Translation Provider System
Abstracted AI translation services:
```typescript
interface TranslationProvider {
  translate(text: string, fromLang: string, toLang: string): Promise<string>
}
```

### Background Job Processing
- Translation requests queued via BullMQ
- Separate worker processes handle AI API calls
- Webhook notifications on completion

### Error Handling
We follow the Vendure error handling pattern for consistent, type-safe error management:

#### Error Types
1. **Unexpected Errors** (System Errors)
   - Thrown as standard JavaScript `Error` objects
   - Returned in GraphQL's standard `errors` array
   - Represent internal server issues, permission problems, database failures
   - Always include proper error codes and messages

2. **Expected Errors** (ErrorResults)
   - Well-defined potential failure scenarios in mutations
   - Structured with standard interface:
     ```typescript
     interface ErrorResult {
       errorCode: ErrorCode!
       message: String!
     }
     ```
   - Encoded directly in GraphQL schema as union types
   - Returned as part of mutation response, not in errors array

#### Implementation Rules
- **Backend**: Use GraphQL union types for mutations that can fail
- **Frontend**: Always handle both success and error cases with `__typename`
- **Type Safety**: Leverage TypeScript discriminated unions for compile-time error checking
- **Exhaustive Handling**: Use switch statements to handle all possible error types

#### Error Handling Patterns
```typescript
// Backend - GraphQL Resolver
@Mutation(() => CreateProjectResult)
async createProject(): Promise<CreateProjectResult> {
  // Return either success or specific error types
}

// Frontend - Client Code
switch (result.createProject.__typename) {
  case 'Project':
    // Success handling
    break;
  case 'ProjectNameTakenError':
    // Specific error handling
    break;
  case 'InsufficientPermissionsError':
    // Permission error handling
    break;
  default:
    // Exhaustive check ensures all cases handled
    const _exhaustive: never = result.createProject;
}
```

#### Error Response Structure
- Custom NestJS exceptions for domain errors
- GraphQL error formatting with proper error codes
- Structured error responses with HTTP status codes
- Client-side conditional fragments for error handling

### Security
- JWT-based user authentication with minimalist payload (sub, jti, channelToken)
- API key authentication for service-to-service with SHA-256 hashing
- Dual authentication support (JWT + API key) via FlexibleAuthGuard
- Tenant-based data isolation via channelToken
- Input validation with class-validator
- Fail-fast JWT configuration (no fallback secrets)
- BCrypt password hashing with salt rounds 10

### Authentication Guards
- `@ProtectResource()` - JWT authentication only
- `@ProtectResourceApiKey()` - API key authentication only  
- `@ProtectResourceFlexible()` - Either JWT or API key authentication
- All sensitive resolvers must use one of these guards

## Database Ports
- Main DB: localhost:5433
- Test DB: localhost:5434
- Redis: localhost:6379

## Environment Variables Required
Backend requires: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRATION_TIME`, `OPENAI_API_KEY`
Frontend requires: `NEXT_PUBLIC_APP_GRAPHQL_API_URL`