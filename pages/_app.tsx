import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet,sepolia, localhost,hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    sepolia,
    hardhat,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'MarketplaceNessdoge',
  projectId: 'a15ddf057071fa3c8a92c62b9beef422',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Header/>
        <Component {...pageProps} />
        <Footer/>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
