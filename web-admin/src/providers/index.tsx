import { AuthProvider } from '@/app/auth-provider'
import { RoutesProvider } from '@/contexts/routes-context'
import { ApolloProvider } from '@/lib/apollo/apollo-provider'
import React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ApolloProvider>
        <RoutesProvider>{children}</RoutesProvider>
      </ApolloProvider>
    </AuthProvider>
  )
}
