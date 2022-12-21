import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </ChakraProvider>
)
