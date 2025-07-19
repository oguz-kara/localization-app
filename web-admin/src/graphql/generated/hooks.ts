import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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

export type CreateTranslationInput = {
  language: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  translationKeyId: Scalars['String']['input'];
  value: Scalars['String']['input'];
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
  createTranslation: TranslationEntity;
  createTranslationKey: TranslationKeyEntity;
  deleteApiKey: Scalars['Boolean']['output'];
  deleteTranslation: TranslationEntity;
  deleteTranslationKey: TranslationKeyEntity;
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
  updateTranslation: TranslationEntity;
  updateTranslationKey: TranslationKeyEntity;
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


export type MutationCreateTranslationArgs = {
  input: CreateTranslationInput;
};


export type MutationCreateTranslationKeyArgs = {
  input: CreateTranslationKeyInput;
};


export type MutationDeleteApiKeyArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTranslationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTranslationKeyArgs = {
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


export type MutationUpdateTranslationArgs = {
  input: UpdateTranslationInput;
};


export type MutationUpdateTranslationKeyArgs = {
  input: UpdateTranslationKeyInput;
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

export type TranslationEntity = {
  __typename?: 'TranslationEntity';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  languageId: Scalars['String']['output'];
  machineTranslated: Scalars['Boolean']['output'];
  reviewNotes?: Maybe<Scalars['String']['output']>;
  status: TranslationStatus;
  translationKeyId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export type TranslationKeyEntity = {
  __typename?: 'TranslationKeyEntity';
  context?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  translations: TranslationsResponse;
  updatedAt: Scalars['DateTime']['output'];
};

export enum TranslationStatus {
  Approved = 'APPROVED',
  InReview = 'IN_REVIEW',
  MachineTranslated = 'MACHINE_TRANSLATED',
  Untranslated = 'UNTRANSLATED'
}

export type TranslationsResponse = {
  __typename?: 'TranslationsResponse';
  language: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  totalKeys: Scalars['Float']['output'];
  translatedKeys: Scalars['Float']['output'];
  translations: Scalars['JSON']['output'];
};

export type UpdateTranslationInput = {
  id: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTranslationKeyInput = {
  context?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
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

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'ProjectEntity', id: string, name: string, description?: string | null, slug: string, isActive: boolean, channelToken: string, createdAt: any, updatedAt: any } };

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

export type CreateTranslationMutationVariables = Exact<{
  input: CreateTranslationInput;
}>;


export type CreateTranslationMutation = { __typename?: 'Mutation', createTranslation: { __typename?: 'TranslationEntity', id: string, value: string, status: TranslationStatus, machineTranslated: boolean, reviewNotes?: string | null, translationKeyId: string, languageId: string, createdAt: any, updatedAt: any } };

export type UpdateTranslationMutationVariables = Exact<{
  input: UpdateTranslationInput;
}>;


export type UpdateTranslationMutation = { __typename?: 'Mutation', updateTranslation: { __typename?: 'TranslationEntity', id: string, value: string, status: TranslationStatus, machineTranslated: boolean, reviewNotes?: string | null, translationKeyId: string, languageId: string, createdAt: any, updatedAt: any } };

export type DeleteTranslationMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteTranslationMutation = { __typename?: 'Mutation', deleteTranslation: { __typename?: 'TranslationEntity', id: string, value: string, status: TranslationStatus, machineTranslated: boolean, reviewNotes?: string | null, translationKeyId: string, languageId: string, createdAt: any, updatedAt: any } };

export type UpdateTranslationKeyMutationVariables = Exact<{
  input: UpdateTranslationKeyInput;
}>;


export type UpdateTranslationKeyMutation = { __typename?: 'Mutation', updateTranslationKey: { __typename?: 'TranslationKeyEntity', id: string, key: string, description?: string | null, context?: string | null, isActive: boolean, projectId: string, createdAt: any, updatedAt: any } };

export type DeleteTranslationKeyMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteTranslationKeyMutation = { __typename?: 'Mutation', deleteTranslationKey: { __typename?: 'TranslationKeyEntity', id: string, key: string, description?: string | null, context?: string | null, isActive: boolean, projectId: string, createdAt: any, updatedAt: any } };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'ProjectEntity', id: string, name: string, description?: string | null, slug: string, isActive: boolean, channelToken: string, createdAt: any, updatedAt: any }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'ProjectEntity', id: string, name: string, description?: string | null, slug: string, isActive: boolean, channelToken: string, createdAt: any, updatedAt: any } | null };

export type GetProjectTranslationsQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
}>;


export type GetProjectTranslationsQuery = { __typename?: 'Query', translationKeys: Array<{ __typename?: 'TranslationKeyEntity', id: string, key: string, description?: string | null, context?: string | null, isActive: boolean, projectId: string, createdAt: any, updatedAt: any, translations: { __typename?: 'TranslationsResponse', language: string, totalKeys: number, translatedKeys: number, translations: any } }> };

export type GetTranslationsQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
  language: Scalars['String']['input'];
}>;


export type GetTranslationsQuery = { __typename?: 'Query', getTranslations: { __typename?: 'TranslationsResponse', language: string, projectId: string, totalKeys: number, translatedKeys: number, translations: any } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'User', id: string, name?: string | null, email: string, createdAt?: any | null, updatedAt?: any | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name?: string | null, email: string, createdAt?: any | null, updatedAt?: any | null } | null };


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
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
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
export type CreateTranslationKeyMutationFn = Apollo.MutationFunction<CreateTranslationKeyMutation, CreateTranslationKeyMutationVariables>;

/**
 * __useCreateTranslationKeyMutation__
 *
 * To run a mutation, you first call `useCreateTranslationKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTranslationKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTranslationKeyMutation, { data, loading, error }] = useCreateTranslationKeyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTranslationKeyMutation(baseOptions?: Apollo.MutationHookOptions<CreateTranslationKeyMutation, CreateTranslationKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTranslationKeyMutation, CreateTranslationKeyMutationVariables>(CreateTranslationKeyDocument, options);
      }
export type CreateTranslationKeyMutationHookResult = ReturnType<typeof useCreateTranslationKeyMutation>;
export type CreateTranslationKeyMutationResult = Apollo.MutationResult<CreateTranslationKeyMutation>;
export type CreateTranslationKeyMutationOptions = Apollo.BaseMutationOptions<CreateTranslationKeyMutation, CreateTranslationKeyMutationVariables>;
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
export type SyncTranslationsMutationFn = Apollo.MutationFunction<SyncTranslationsMutation, SyncTranslationsMutationVariables>;

/**
 * __useSyncTranslationsMutation__
 *
 * To run a mutation, you first call `useSyncTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncTranslationsMutation, { data, loading, error }] = useSyncTranslationsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSyncTranslationsMutation(baseOptions?: Apollo.MutationHookOptions<SyncTranslationsMutation, SyncTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncTranslationsMutation, SyncTranslationsMutationVariables>(SyncTranslationsDocument, options);
      }
export type SyncTranslationsMutationHookResult = ReturnType<typeof useSyncTranslationsMutation>;
export type SyncTranslationsMutationResult = Apollo.MutationResult<SyncTranslationsMutation>;
export type SyncTranslationsMutationOptions = Apollo.BaseMutationOptions<SyncTranslationsMutation, SyncTranslationsMutationVariables>;
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
export type ExportTranslationsMutationFn = Apollo.MutationFunction<ExportTranslationsMutation, ExportTranslationsMutationVariables>;

/**
 * __useExportTranslationsMutation__
 *
 * To run a mutation, you first call `useExportTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExportTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [exportTranslationsMutation, { data, loading, error }] = useExportTranslationsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExportTranslationsMutation(baseOptions?: Apollo.MutationHookOptions<ExportTranslationsMutation, ExportTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExportTranslationsMutation, ExportTranslationsMutationVariables>(ExportTranslationsDocument, options);
      }
export type ExportTranslationsMutationHookResult = ReturnType<typeof useExportTranslationsMutation>;
export type ExportTranslationsMutationResult = Apollo.MutationResult<ExportTranslationsMutation>;
export type ExportTranslationsMutationOptions = Apollo.BaseMutationOptions<ExportTranslationsMutation, ExportTranslationsMutationVariables>;
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
export type ImportTranslationsMutationFn = Apollo.MutationFunction<ImportTranslationsMutation, ImportTranslationsMutationVariables>;

/**
 * __useImportTranslationsMutation__
 *
 * To run a mutation, you first call `useImportTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImportTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [importTranslationsMutation, { data, loading, error }] = useImportTranslationsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useImportTranslationsMutation(baseOptions?: Apollo.MutationHookOptions<ImportTranslationsMutation, ImportTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ImportTranslationsMutation, ImportTranslationsMutationVariables>(ImportTranslationsDocument, options);
      }
export type ImportTranslationsMutationHookResult = ReturnType<typeof useImportTranslationsMutation>;
export type ImportTranslationsMutationResult = Apollo.MutationResult<ImportTranslationsMutation>;
export type ImportTranslationsMutationOptions = Apollo.BaseMutationOptions<ImportTranslationsMutation, ImportTranslationsMutationVariables>;
export const CreateTranslationDocument = gql`
    mutation CreateTranslation($input: CreateTranslationInput!) {
  createTranslation(input: $input) {
    id
    value
    status
    machineTranslated
    reviewNotes
    translationKeyId
    languageId
    createdAt
    updatedAt
  }
}
    `;
export type CreateTranslationMutationFn = Apollo.MutationFunction<CreateTranslationMutation, CreateTranslationMutationVariables>;

/**
 * __useCreateTranslationMutation__
 *
 * To run a mutation, you first call `useCreateTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTranslationMutation, { data, loading, error }] = useCreateTranslationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTranslationMutation(baseOptions?: Apollo.MutationHookOptions<CreateTranslationMutation, CreateTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTranslationMutation, CreateTranslationMutationVariables>(CreateTranslationDocument, options);
      }
export type CreateTranslationMutationHookResult = ReturnType<typeof useCreateTranslationMutation>;
export type CreateTranslationMutationResult = Apollo.MutationResult<CreateTranslationMutation>;
export type CreateTranslationMutationOptions = Apollo.BaseMutationOptions<CreateTranslationMutation, CreateTranslationMutationVariables>;
export const UpdateTranslationDocument = gql`
    mutation UpdateTranslation($input: UpdateTranslationInput!) {
  updateTranslation(input: $input) {
    id
    value
    status
    machineTranslated
    reviewNotes
    translationKeyId
    languageId
    createdAt
    updatedAt
  }
}
    `;
export type UpdateTranslationMutationFn = Apollo.MutationFunction<UpdateTranslationMutation, UpdateTranslationMutationVariables>;

/**
 * __useUpdateTranslationMutation__
 *
 * To run a mutation, you first call `useUpdateTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTranslationMutation, { data, loading, error }] = useUpdateTranslationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTranslationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTranslationMutation, UpdateTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTranslationMutation, UpdateTranslationMutationVariables>(UpdateTranslationDocument, options);
      }
export type UpdateTranslationMutationHookResult = ReturnType<typeof useUpdateTranslationMutation>;
export type UpdateTranslationMutationResult = Apollo.MutationResult<UpdateTranslationMutation>;
export type UpdateTranslationMutationOptions = Apollo.BaseMutationOptions<UpdateTranslationMutation, UpdateTranslationMutationVariables>;
export const DeleteTranslationDocument = gql`
    mutation DeleteTranslation($id: String!) {
  deleteTranslation(id: $id) {
    id
    value
    status
    machineTranslated
    reviewNotes
    translationKeyId
    languageId
    createdAt
    updatedAt
  }
}
    `;
export type DeleteTranslationMutationFn = Apollo.MutationFunction<DeleteTranslationMutation, DeleteTranslationMutationVariables>;

/**
 * __useDeleteTranslationMutation__
 *
 * To run a mutation, you first call `useDeleteTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTranslationMutation, { data, loading, error }] = useDeleteTranslationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTranslationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTranslationMutation, DeleteTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTranslationMutation, DeleteTranslationMutationVariables>(DeleteTranslationDocument, options);
      }
export type DeleteTranslationMutationHookResult = ReturnType<typeof useDeleteTranslationMutation>;
export type DeleteTranslationMutationResult = Apollo.MutationResult<DeleteTranslationMutation>;
export type DeleteTranslationMutationOptions = Apollo.BaseMutationOptions<DeleteTranslationMutation, DeleteTranslationMutationVariables>;
export const UpdateTranslationKeyDocument = gql`
    mutation UpdateTranslationKey($input: UpdateTranslationKeyInput!) {
  updateTranslationKey(input: $input) {
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
export type UpdateTranslationKeyMutationFn = Apollo.MutationFunction<UpdateTranslationKeyMutation, UpdateTranslationKeyMutationVariables>;

/**
 * __useUpdateTranslationKeyMutation__
 *
 * To run a mutation, you first call `useUpdateTranslationKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTranslationKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTranslationKeyMutation, { data, loading, error }] = useUpdateTranslationKeyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTranslationKeyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTranslationKeyMutation, UpdateTranslationKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTranslationKeyMutation, UpdateTranslationKeyMutationVariables>(UpdateTranslationKeyDocument, options);
      }
export type UpdateTranslationKeyMutationHookResult = ReturnType<typeof useUpdateTranslationKeyMutation>;
export type UpdateTranslationKeyMutationResult = Apollo.MutationResult<UpdateTranslationKeyMutation>;
export type UpdateTranslationKeyMutationOptions = Apollo.BaseMutationOptions<UpdateTranslationKeyMutation, UpdateTranslationKeyMutationVariables>;
export const DeleteTranslationKeyDocument = gql`
    mutation DeleteTranslationKey($id: String!) {
  deleteTranslationKey(id: $id) {
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
export type DeleteTranslationKeyMutationFn = Apollo.MutationFunction<DeleteTranslationKeyMutation, DeleteTranslationKeyMutationVariables>;

/**
 * __useDeleteTranslationKeyMutation__
 *
 * To run a mutation, you first call `useDeleteTranslationKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTranslationKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTranslationKeyMutation, { data, loading, error }] = useDeleteTranslationKeyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTranslationKeyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTranslationKeyMutation, DeleteTranslationKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTranslationKeyMutation, DeleteTranslationKeyMutationVariables>(DeleteTranslationKeyDocument, options);
      }
export type DeleteTranslationKeyMutationHookResult = ReturnType<typeof useDeleteTranslationKeyMutation>;
export type DeleteTranslationKeyMutationResult = Apollo.MutationResult<DeleteTranslationKeyMutation>;
export type DeleteTranslationKeyMutationOptions = Apollo.BaseMutationOptions<DeleteTranslationKeyMutation, DeleteTranslationKeyMutationVariables>;
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

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectsQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
      }
export function useGetProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
export function useGetProjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsSuspenseQueryHookResult = ReturnType<typeof useGetProjectsSuspenseQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
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

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProjectQuery(baseOptions: Apollo.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables> & ({ variables: GetProjectQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
      }
export function useGetProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export function useGetProjectSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectSuspenseQueryHookResult = ReturnType<typeof useGetProjectSuspenseQuery>;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetProjectTranslationsDocument = gql`
    query GetProjectTranslations($projectId: String!) {
  translationKeys(projectId: $projectId) {
    id
    key
    description
    context
    isActive
    projectId
    translations {
      language
      totalKeys
      translatedKeys
      translations
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetProjectTranslationsQuery__
 *
 * To run a query within a React component, call `useGetProjectTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectTranslationsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetProjectTranslationsQuery(baseOptions: Apollo.QueryHookOptions<GetProjectTranslationsQuery, GetProjectTranslationsQueryVariables> & ({ variables: GetProjectTranslationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectTranslationsQuery, GetProjectTranslationsQueryVariables>(GetProjectTranslationsDocument, options);
      }
export function useGetProjectTranslationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectTranslationsQuery, GetProjectTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectTranslationsQuery, GetProjectTranslationsQueryVariables>(GetProjectTranslationsDocument, options);
        }
export function useGetProjectTranslationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectTranslationsQuery, GetProjectTranslationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectTranslationsQuery, GetProjectTranslationsQueryVariables>(GetProjectTranslationsDocument, options);
        }
export type GetProjectTranslationsQueryHookResult = ReturnType<typeof useGetProjectTranslationsQuery>;
export type GetProjectTranslationsLazyQueryHookResult = ReturnType<typeof useGetProjectTranslationsLazyQuery>;
export type GetProjectTranslationsSuspenseQueryHookResult = ReturnType<typeof useGetProjectTranslationsSuspenseQuery>;
export type GetProjectTranslationsQueryResult = Apollo.QueryResult<GetProjectTranslationsQuery, GetProjectTranslationsQueryVariables>;
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

/**
 * __useGetTranslationsQuery__
 *
 * To run a query within a React component, call `useGetTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTranslationsQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useGetTranslationsQuery(baseOptions: Apollo.QueryHookOptions<GetTranslationsQuery, GetTranslationsQueryVariables> & ({ variables: GetTranslationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTranslationsQuery, GetTranslationsQueryVariables>(GetTranslationsDocument, options);
      }
export function useGetTranslationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTranslationsQuery, GetTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTranslationsQuery, GetTranslationsQueryVariables>(GetTranslationsDocument, options);
        }
export function useGetTranslationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTranslationsQuery, GetTranslationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTranslationsQuery, GetTranslationsQueryVariables>(GetTranslationsDocument, options);
        }
export type GetTranslationsQueryHookResult = ReturnType<typeof useGetTranslationsQuery>;
export type GetTranslationsLazyQueryHookResult = ReturnType<typeof useGetTranslationsLazyQuery>;
export type GetTranslationsSuspenseQueryHookResult = ReturnType<typeof useGetTranslationsSuspenseQuery>;
export type GetTranslationsQueryResult = Apollo.QueryResult<GetTranslationsQuery, GetTranslationsQueryVariables>;
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

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
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

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;