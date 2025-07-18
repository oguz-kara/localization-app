# GraphQL API Queries and Mutations

## Authentication

All queries and mutations require authentication. Use the JWT token from the `login` mutation in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

For service-to-service calls, use API keys:

```
Authorization: Bearer <api_key>
```

## Core Mutations

### 1. Create Project

```graphql
mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    description
    slug
    isActive
    channelToken
    createdAt
    updatedAt
  }
}
```

Variables:
```json
{
  "input": {
    "name": "My Web App",
    "description": "Main web application translations",
    "slug": "web-app"
  }
}
```

### 2. Create Translation Key

```graphql
mutation CreateTranslationKey($input: CreateTranslationKeyInput!) {
  createTranslationKey(input: $input) {
    id
    key
    description
    context
    isActive
    projectId
    createdAt
    updatedAt
  }
}
```

Variables:
```json
{
  "input": {
    "key": "buttons.submit",
    "description": "Submit button text",
    "context": "Used in forms throughout the application",
    "projectId": "project-id-here"
  }
}
```

## Core Queries

### 1. Get Translations (Most Important)

This is the primary query for client applications to consume localization data.

```graphql
query GetTranslations($projectId: ID!, $language: String!) {
  getTranslations(projectId: $projectId, language: $language) {
    translations
    projectId
    language
    totalKeys
    translatedKeys
  }
}
```

Variables:
```json
{
  "projectId": "project-id-here",
  "language": "en"
}
```

Response:
```json
{
  "data": {
    "getTranslations": {
      "translations": {
        "buttons.submit": "Submit",
        "buttons.cancel": "Cancel",
        "welcome.message": "Welcome to our application",
        "errors.required": "This field is required"
      },
      "projectId": "project-id-here",
      "language": "en",
      "totalKeys": 4,
      "translatedKeys": 4
    }
  }
}
```

### 2. Get Projects

```graphql
query GetProjects {
  projects {
    id
    name
    description
    slug
    isActive
    channelToken
    createdAt
    updatedAt
  }
}
```

### 3. Get Project

```graphql
query GetProject($id: String!) {
  project(id: $id) {
    id
    name
    description
    slug
    isActive
    channelToken
    createdAt
    updatedAt
  }
}
```

### 4. Get Translation Keys

```graphql
query GetTranslationKeys($projectId: String!) {
  translationKeys(projectId: $projectId) {
    id
    key
    description
    context
    isActive
    projectId
    createdAt
    updatedAt
  }
}
```

## Security Notes

- **Channel-based Authorization**: All operations are scoped to the user's channel/tenant
- **Project Access Control**: Users can only access projects within their channel
- **Flexible Authentication**: `getTranslations` supports both JWT and API key authentication
- **Data Isolation**: Complete data separation between different channels/tenants

## Error Handling

The API uses a structured error format based on the Vendure pattern:

```json
{
  "errors": [
    {
      "message": "Entity not found",
      "code": "ENTITY_NOT_FOUND",
      "extensions": {
        "entityName": "Project",
        "entityId": "invalid-id"
      }
    }
  ]
}
```

Common error codes:
- `ENTITY_NOT_FOUND`: Resource not found
- `UNIQUE_CONSTRAINT_VIOLATION`: Duplicate key/slug
- `ACCESS_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input data