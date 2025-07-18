// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { GraphQLClient } from 'graphql-request'

type User = {
  id: string
  email: string
  accessToken: string
}

// GraphQL response types
type LoginSuccess = {
  __typename: 'LoginSuccess'
  user: {
    id: string
    email: string
  }
  token: string
}

type InvalidCredentialsError = {
  __typename: 'InvalidCredentialsError'
  errorCode: string
  message: string
}

type LoginResponse = {
  loginUser: LoginSuccess | InvalidCredentialsError
}

// Type guard to check if response is LoginSuccess
function isLoginSuccess(
  response: any,
): response is LoginResponse & { loginUser: LoginSuccess } {
  console.log({ response })
  return Boolean(response?.loginUser?.token)
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log({ credentials })
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const authApiClient = new GraphQLClient(
          'http://localhost:3000/admin-api',
        )

        try {
          const loginMutation = `
            mutation LoginUser($input: LoginUserInput!) {
              loginUser(loginUserInput: $input) {
                token
                user {
                  id
                  email
                  name
                }
              }
            }
          `

          const response = await authApiClient.request<LoginResponse>(
            loginMutation,
            {
              input: {
                email: credentials.email,
                password: credentials.password,
              },
            },
          )

          console.log({ response })

          if (isLoginSuccess(response)) {
            return {
              id: response.loginUser.user.id,
              email: response.loginUser.user.email,
              accessToken: response.loginUser.token,
            }
          }

          return null
        } catch (error) {
          console.error('Authorize error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Session yönetimi için JWT stratejisini kullanıyoruz
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as User)?.accessToken
        token.id = (user as User)?.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const newSession = {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            email: token.email as string,
          },
        }
        return newSession
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
