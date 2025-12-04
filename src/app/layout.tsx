import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Layout Component
import Layout from "@/components/shared/Layout";
// Connection Provider Context
import { headers } from 'next/headers';
import ConnectionProvider from "@/context/connect.provider";
// Vercel Speed Insights
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Mindchain',
  description: "A decentralized application for Mindchain protocol.",
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://mindchain-dapp-p2v6pftdw-inceptiontech.vercel.app')
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers()
  const cookies = headersList.get('cookie')
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
      <ConnectionProvider cookies={cookies}>      
          <Layout>
            {children}
          </Layout>
      </ConnectionProvider>
      <SpeedInsights />
      </body>
    </html>
  );
}
