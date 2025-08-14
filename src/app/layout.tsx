
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Oswald, Onest } from 'next/font/google';
import { cn } from '@/lib/utils';
import { UIProvider } from '@/contexts/ui-context';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import Script from 'next/script';
import { ClientOnly } from '@/components/shared/client-only';
import { FloatingKiraButton } from '@/components/shared/floating-kira-button';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['600'], // Oswald 600 weight for headings
  variable: '--font-oswald',
});

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'], // Common weights for body font
  variable: '--font-onest',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'; // Fallback for local dev

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DesignFlow - Creative Services Marketplace for India',
    template: '%s | DesignFlow India',
  },
  description: 'Connect with expert Indian designers for logos, UI/UX, branding, and more. Transparent pricing and streamlined process on DesignFlow India.',
  openGraph: {
    title: 'DesignFlow - Creative Services Marketplace for India',
    description: 'Your Vision, Our Expertise. Simplified for the Indian market.',
    url: SITE_URL,
    siteName: 'DesignFlow India',
    images: [
      {
        url: `${SITE_URL}/og-image.png`, // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'DesignFlow India - Creative Services Marketplace',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DesignFlow - Creative Services Marketplace for India',
    description: 'Expert Indian designers for logos, UI/UX, branding, and more.',
    // images: [`${SITE_URL}/twitter-image.png`], // Replace with your actual Twitter image URL
    // creator: '@yourTwitterHandle', // Optional: Add your Twitter handle
  },
  robots: { // Basic robots meta tag
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Optional: Add icons, manifest, etc.
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: `${SITE_URL}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(oswald.variable, onest.variable)}>
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="antialiased min-h-screen flex flex-col pb-16 md:pb-0" suppressHydrationWarning>
        <UIProvider>
          {children}
          <ClientOnly><MobileBottomNav /></ClientOnly>
          <ClientOnly><FloatingKiraButton /></ClientOnly>
        </UIProvider>
        <ClientOnly><Toaster /></ClientOnly>
      </body>
    </html>
  );
}
