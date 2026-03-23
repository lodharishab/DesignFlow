
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Oswald, Onest } from 'next/font/google';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { Providers } from '@/components/providers';
import { ClientOnly } from '@/components/shared/client-only';
import { FloatingKiraButton } from '@/components/shared/floating-kira-button';
import { AiChatSidebar } from '@/components/ai/ai-chat-sidebar';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Toaster } from 'sonner';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-oswald',
});

const onest = Onest({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-onest',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.REPLIT_DEV_DOMAIN || 'designhype.in'}`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HYPE - Creative Services Marketplace for India',
    template: '%s | HYPE India',
  },
  description: 'Connect with expert Indian designers for logos, UI/UX, branding, and more. Transparent pricing and streamlined process on HYPE India.',
  openGraph: {
    title: 'HYPE - Creative Services Marketplace for India',
    description: 'Your Vision, Our Expertise. Simplified for the Indian market.',
    url: SITE_URL,
    siteName: 'HYPE India',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'HYPE India - Creative Services Marketplace',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HYPE - Creative Services Marketplace for India',
    description: 'Expert Indian designers for logos, UI/UX, branding, and more.',
  },
  robots: {
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
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HYPE',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Creative Services Marketplace for India. Connect with expert Indian designers for logos, UI/UX, branding, and more.',
  email: 'hello@designhype.in',
  areaServed: 'IN',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HYPE',
  url: SITE_URL,
  description: 'Creative Services Marketplace for India',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/design-services?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(oswald.variable, onest.variable, 'dark')}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground pb-16 md:pb-0" suppressHydrationWarning>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Providers>
          {children}
          <ClientOnly><MobileBottomNav /></ClientOnly>
          <ClientOnly><FloatingKiraButton /></ClientOnly>
          <ClientOnly><AiChatSidebar /></ClientOnly>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
