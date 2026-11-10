import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Base Mainnet upgraded to Denim (200ms canonical blocks, Flashblocks deprecated)
export const config = createConfig({
  chains: [base],
  connectors: [
    injected()
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
    }),
  },
});

