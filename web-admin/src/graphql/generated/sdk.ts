import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ApiKeyEntity = {
  __typename?: 'ApiKeyEntity';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  key?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type AuthenticationPayload = {
  __typename?: 'AuthenticationPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Channel = {
  __typename?: 'Channel';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  token: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChannelConnection = {
  __typename?: 'ChannelConnection';
  items: Array<Channel>;
  totalCount: Scalars['Int']['output'];
};

export type CreateApiKeyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateChannelInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};

export type CreateTranslationKeyInput = {
  context?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type ExportResult = {
  __typename?: 'ExportResult';
  downloadUrl?: Maybe<Scalars['String']['output']>;
  jobId: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type ExportTranslationsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  format: ImportExportFormat;
  languageCode: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type FailedJobOutput = {
  __typename?: 'FailedJobOutput';
  attemptsMade: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  data: Scalars['JSON']['output'];
  failedAt: Scalars['DateTime']['output'];
  failedReason: Scalars['String']['output'];
  finishedOn?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  maxAttempts: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  processedOn?: Maybe<Scalars['Float']['output']>;
};

export type FailedJobStatsOutput = {
  __typename?: 'FailedJobStatsOutput';
  jobsByFailureReason: Scalars['JSON']['output'];
  jobsByType: Scalars['JSON']['output'];
  newestFailedJob?: Maybe<Scalars['DateTime']['output']>;
  oldestFailedJob?: Maybe<Scalars['DateTime']['output']>;
  totalFailed: Scalars['Float']['output'];
};

export enum ImportExportFormat {
  Json = 'JSON',
  Yaml = 'YAML'
}

export type ImportResult = {
  __typename?: 'ImportResult';
  jobId: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalKeys: Scalars['Float']['output'];
};

export type ImportTranslationsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  format: ImportExportFormat;
  languageCode: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  translations: Scalars['JSON']['input'];
};

export type LoginUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LogoutOutput = {
  __typename?: 'LogoutOutput';
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cleanupOldFailedJobs: RetryJobResult;
  createApiKey: ApiKeyEntity;
  createChannel: Channel;
  createProject: ProjectEntity;
  createTranslationKey: TranslationKeyEntity;
  deleteApiKey: Scalars['Boolean']['output'];
  exportTranslations: ExportResult;
  importTranslations: ImportResult;
  loginUser: AuthenticationPayload;
  logoutUser: LogoutOutput;
  registerNewTenant: AuthenticationPayload;
  registerUser: AuthenticationPayload;
  removeFailedJob: RetryJobResult;
  retryFailedJob: RetryJobResult;
  retryFailedJobsByType: RetryJobResult;
  revokeApiKey: Scalars['Boolean']['output'];
  syncTranslations: SyncTranslationsResult;
};


export type MutationCleanupOldFailedJobsArgs = {
  olderThanDays?: Scalars['Float']['input'];
};


export type MutationCreateApiKeyArgs = {
  input: CreateApiKeyInput;
};


export type MutationCreateChannelArgs = {
  createChannelInput: CreateChannelInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateTranslationKeyArgs = {
  input: CreateTranslationKeyInput;
};


export type MutationDeleteApiKeyArgs = {
  id: Scalars['String']['input'];
};


export type MutationExportTranslationsArgs = {
  input: ExportTranslationsInput;
};


export type MutationImportTranslationsArgs = {
  input: ImportTranslationsInput;
};


export type MutationLoginUserArgs = {
  loginUserInput: LoginUserInput;
};


export type MutationRegisterNewTenantArgs = {
  registerNewTenantInput: RegisterNewTenantInput;
};


export type MutationRegisterUserArgs = {
  channelToken: Scalars['String']['input'];
  registerUserInput: RegisterUserInput;
};


export type MutationRemoveFailedJobArgs = {
  jobId: Scalars['String']['input'];
};


export type MutationRetryFailedJobArgs = {
  jobId: Scalars['String']['input'];
};


export type MutationRetryFailedJobsByTypeArgs = {
  jobType: Scalars['String']['input'];
};


export type MutationRevokeApiKeyArgs = {
  id: Scalars['String']['input'];
};


export type MutationSyncTranslationsArgs = {
  input: SyncTranslationsInput;
};

export type ProjectEntity = {
  __typename?: 'ProjectEntity';
  channelToken: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  apiKeys: Array<ApiKeyEntity>;
  channelByToken?: Maybe<Channel>;
  channels: ChannelConnection;
  failedJob?: Maybe<FailedJobOutput>;
  failedJobStats: FailedJobStatsOutput;
  failedJobs: Array<FailedJobOutput>;
  getTranslations: TranslationsResponse;
  getUser: User;
  getUserByEmail: User;
  getUsers: UserConnection;
  me?: Maybe<User>;
  project?: Maybe<ProjectEntity>;
  projects: Array<ProjectEntity>;
  translationKeys: Array<TranslationKeyEntity>;
};


export type QueryChannelByTokenArgs = {
  token: Scalars['String']['input'];
};


export type QueryChannelsArgs = {
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFailedJobArgs = {
  jobId: Scalars['String']['input'];
};


export type QueryGetTranslationsArgs = {
  language: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetUsersArgs = {
  skip: Scalars['Float']['input'];
  take: Scalars['Float']['input'];
};


export type QueryProjectArgs = {
  id: Scalars['String']['input'];
};


export type QueryTranslationKeysArgs = {
  projectId: Scalars['String']['input'];
};

export type RegisterNewTenantInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  tenantDescription?: InputMaybe<Scalars['String']['input']>;
  tenantName: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RetryJobResult = {
  __typename?: 'RetryJobResult';
  jobId?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type SyncTranslationsInput = {
  projectId?: InputMaybe<Scalars['String']['input']>;
  sourceLanguage: Scalars['String']['input'];
  sourceText?: InputMaybe<Scalars['String']['input']>;
  targetLanguage?: InputMaybe<Scalars['String']['input']>;
  targetLanguages?: InputMaybe<Array<Scalars['String']['input']>>;
  translationKeyId?: InputMaybe<Scalars['String']['input']>;
  type: SyncTranslationsType;
};

export type SyncTranslationsResult = {
  __typename?: 'SyncTranslationsResult';
  estimatedDuration?: Maybe<Scalars['Float']['output']>;
  jobId: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  totalKeys?: Maybe<Scalars['Float']['output']>;
  totalLanguages?: Maybe<Scalars['Float']['output']>;
};

export enum SyncTranslationsType {
  Project = 'PROJECT',
  SingleKey = 'SINGLE_KEY'
}

export type TranslationKeyEntity = {
  __typename?: 'TranslationKeyEntity';
  context?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TranslationsResponse = {
  __typename?: 'TranslationsResponse';
  language: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  totalKeys: Scalars['Float']['output'];
  translatedKeys: Scalars['Float']['output'];
  translations: Scalars['JSON']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  items: Array<User>;
  totalCount: Scalars['Int']['output'];
};

export type CreateTranslationKeyMutationVariables = Exact<{
  input: CreateTranslationKeyInput;
}>;


export type CreateTranslationKeyMutation = { __typename?: 'Mutation', createTranslationKey: { __typename?: 'TranslationKeyEntity', id: string, key: string, description?: string | null, context?: string | null, isActive: boolean, projectId: string, createdAt: any, updatedAt: any } };

export type SyncTranslationsMutationVariables = Exact<{
  input: SyncTranslationsInput;
}>;


export type SyncTranslationsMutation = { __typename?: 'Mutation', syncTranslations: { __typename?: 'SyncTranslationsResult', jobId: string, message?: string | null, success: boolean, estimatedDuration?: number | null, totalKeys?: number | null, totalLanguages?: number | null } };

export type ExportTranslationsMutationVariables = Exact<{
  input: ExportTranslationsInput;
}>;


export type ExportTranslationsMutation = { __typename?: 'Mutation', exportTranslations: { __typename?: 'ExportResult', jobId: string, message: string, status: string, downloadUrl?: string | null } };

export type ImportTranslationsMutationVariables = Exact<{
  input: ImportTranslationsInput;
}>;


export type ImportTranslationsMutation = { __typename?: 'Mutation', importTranslations: { __typename?: 'ImportResult', jobId: string, message: string, status: string, totalKeys: number } };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'ProjectEntity', id: string, name: string, description?: string | null, slug: string, isActive: boolean, channelToken: string, createdAt: any, updatedAt: any }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'ProjectEntity', id: string, name: string, description?: string | null, slug: string, isActive: boolean, channelToken: string, createdAt: any, updatedAt: any } | null };

export type GetProjectTranslationsQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
}>;


export type GetProjectTranslationsQuery = { __typename?: 'Query', translationKeys: Array<{ __typename?: 'TranslationKeyEntity', id: string, key: string, description?: string | null, context?: string | null, isActive: boolean, projectId: string, createdAt: any, updatedAt: any }> };

export type GetTranslationsQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
  language: Scalars['String']['input'];
}>;


export type GetTranslationsQuery = { __typename?: 'Query', getTranslations: { __typename?: 'TranslationsResponse', language: string, projectId: string, totalKeys: number, translatedKeys: number, translations: any } };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'ProjectEntity', id: string, name: string, description?: string | null, slug: string, isActive: boolean, channelToken: string, createdAt: any, updatedAt: any } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name?: string | null, email: string, createdAt?: any | null, updatedAt?: any | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name?: string | null, email: string, createdAt?: any | null, updatedAt?: any | null } | null };


export const CreateTranslationKeyDocument = gql`
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
    `;
export const SyncTranslationsDocument = gql`
    mutation SyncTranslations($input: SyncTranslationsInput!) {
  syncTranslations(input: $input) {
    jobId
    message
    success
    estimatedDuration
    totalKeys
    totalLanguages
  }
}
    `;
export const ExportTranslationsDocument = gql`
    mutation ExportTranslations($input: ExportTranslationsInput!) {
  exportTranslations(input: $input) {
    jobId
    message
    status
    downloadUrl
  }
}
    `;
export const ImportTranslationsDocument = gql`
    mutation ImportTranslations($input: ImportTranslationsInput!) {
  importTranslations(input: $input) {
    jobId
    message
    status
    totalKeys
  }
}
    `;
export const GetProjectsDocument = gql`
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
    `;
export const GetProjectDocument = gql`
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
    `;
export const GetProjectTranslationsDocument = gql`
    query GetProjectTranslations($projectId: String!) {
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
    `;
export const GetTranslationsDocument = gql`
    query GetTranslations($projectId: String!, $language: String!) {
  getTranslations(projectId: $projectId, language: $language) {
    language
    projectId
    totalKeys
    translatedKeys
    translations
  }
}
    `;
export const CreateProjectDocument = gql`
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
    `;
export const GetUserDocument = gql`
    query GetUser($id: String!) {
  getUser(id: $id) {
    id
    name
    email
    createdAt
    updatedAt
  }
}
    `;
export const MeDocument = gql`
    query Me {
  me {
    id
    name
    email
    createdAt
    updatedAt
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    CreateTranslationKey(variables: CreateTranslationKeyMutationVariables, options?: C): Promise<CreateTranslationKeyMutation> {
      return requester<CreateTranslationKeyMutation, CreateTranslationKeyMutationVariables>(CreateTranslationKeyDocument, variables, options) as Promise<CreateTranslationKeyMutation>;
    },
    SyncTranslations(variables: SyncTranslationsMutationVariables, options?: C): Promise<SyncTranslationsMutation> {
      return requester<SyncTranslationsMutation, SyncTranslationsMutationVariables>(SyncTranslationsDocument, variables, options) as Promise<SyncTranslationsMutation>;
    },
    ExportTranslations(variables: ExportTranslationsMutationVariables, options?: C): Promise<ExportTranslationsMutation> {
      return requester<ExportTranslationsMutation, ExportTranslationsMutationVariables>(ExportTranslationsDocument, variables, options) as Promise<ExportTranslationsMutation>;
    },
    ImportTranslations(variables: ImportTranslationsMutationVariables, options?: C): Promise<ImportTranslationsMutation> {
      return requester<ImportTranslationsMutation, ImportTranslationsMutationVariables>(ImportTranslationsDocument, variables, options) as Promise<ImportTranslationsMutation>;
    },
    GetProjects(variables?: GetProjectsQueryVariables, options?: C): Promise<GetProjectsQuery> {
      return requester<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, variables, options) as Promise<GetProjectsQuery>;
    },
    GetProject(variables: GetProjectQueryVariables, options?: C): Promise<GetProjectQuery> {
      return requester<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, variables, options) as Promise<GetProjectQuery>;
    },
    GetProjectTranslations(variables: GetProjectTranslationsQueryVariables, options?: C): Promise<GetProjectTranslationsQuery> {
      return requester<GetProjectTranslationsQuery, GetProjectTranslationsQueryVariables>(GetProjectTranslationsDocument, variables, options) as Promise<GetProjectTranslationsQuery>;
    },
    GetTranslations(variables: GetTranslationsQueryVariables, options?: C): Promise<GetTranslationsQuery> {
      return requester<GetTranslationsQuery, GetTranslationsQueryVariables>(GetTranslationsDocument, variables, options) as Promise<GetTranslationsQuery>;
    },
    CreateProject(variables: CreateProjectMutationVariables, options?: C): Promise<CreateProjectMutation> {
      return requester<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, variables, options) as Promise<CreateProjectMutation>;
    },
    GetUser(variables: GetUserQueryVariables, options?: C): Promise<GetUserQuery> {
      return requester<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables, options) as Promise<GetUserQuery>;
    },
    Me(variables?: MeQueryVariables, options?: C): Promise<MeQuery> {
      return requester<MeQuery, MeQueryVariables>(MeDocument, variables, options) as Promise<MeQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;