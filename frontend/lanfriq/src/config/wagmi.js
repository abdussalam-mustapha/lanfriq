import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { defineChain } from 'viem'

// Camp Network (Basecamp Testnet) configuration
export const campTestnet = defineChain({
  id: 123420001114,
  name: 'Basecamp Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CAMP',
    symbol: 'CAMP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.basecamp.t.raas.gelato.cloud'],
    },
    public: {
      http: ['https://rpc-campnetwork.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Basecamp Explorer',
      url: 'https://basecamp.cloud.blockscout.com',
    },
  },
  testnet: true,
})

export const config = getDefaultConfig({
  appName: 'Lanfriq',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [campTestnet, mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
})
