import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { AppKitNetwork } from '@reown/appkit/networks'
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// Set up Project ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) {
  throw new Error('Project ID is not defined. Please set NEXT_PUBLIC_PROJECT_ID in your environment variables.')
}
// Set up Networks
export const networks: AppKitNetwork[] = [sepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [sepolia.id]: http()
  }
})
// Export the Wagmi Config
export const config = wagmiAdapter.wagmiConfig