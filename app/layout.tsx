import type { Metadata } from 'next';
import { Chakra_Petch, Geist, Geist_Mono, Oxanium } from 'next/font/google';
import './globals.css';
import './reference.css';
import './compact.css';
import './material.css';
import './story.css';
import './portal-system.css';
import './hero-refinement.css';
import './participant-flow.css';
// Round-specific public and participant rulebook styles.
import './rules-system.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const chakraPetch = Chakra_Petch({
  variable: '--font-prompthon-technical',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

const oxanium = Oxanium({
  variable: '--font-prompthon-year',
  subsets: ['latin'],
  weight: ['200', '300'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://prompthon-2026-eec.harishjayasri.chatgpt.site'),
  title: 'PROMPTHON 2026 — AI Prompt Engineering Hackathon',
  description: 'The official AI Prompt Engineering Hackathon by the Department of Computer Science and Business Systems, Easwari Engineering College.',
  openGraph: {
    title: 'PROMPTHON 2026 — AI Prompt Engineering Hackathon',
    description: 'Three rounds. Three ways to think. One skill — precision.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PROMPTHON 2026 — AI Prompt Engineering Hackathon',
    description: 'Three rounds. Three ways to think. One skill — precision.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${chakraPetch.variable} ${oxanium.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
