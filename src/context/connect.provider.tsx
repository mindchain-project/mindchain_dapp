'use client';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
// Wagmi & Reown AppKit
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { wagmiAdapter, projectId } from '@/config/connect.config'
import { createAppKit } from '@reown/appkit/react'
import { sepolia } from '@reown/appkit/networks'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Mindchain',
  description: 'Mindchain Dapp using Reown AppKit',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['/logo_brain_gradient.png'],
}


// Create the modal
const modal = createAppKit({ // Eslint-disable-line no-unused-vars
  adapters: [wagmiAdapter],
  projectId,
  networks: [sepolia],
  defaultNetwork: sepolia,
  metadata: metadata,
  features: {
    connectMethodsOrder: ["wallet", "social"],
    analytics: true,
    swaps: false,
    legalCheckbox: true,
    },
})

function ConnectionProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ConnectionProvider