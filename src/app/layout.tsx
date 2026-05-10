import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'Echo Nomads | Post-Apocalyptic Web3 Survival Game',
  description: 'A serene yet tense atmospheric survival-exploration game on Base Network.',
  other: {
    'base:app_id': '68f52e728c4fe3f562003e76'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
