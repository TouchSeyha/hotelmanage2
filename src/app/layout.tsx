import '~/styles/globals.css';

import { type Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
  title: 'Hotel Name | Luxury Accommodation',
  description:
    'Experience luxury and comfort at our beautiful hotel. Exceptional service, stunning views, and unforgettable memories await.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
