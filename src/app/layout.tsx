
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Oswald, Onest } from 'next/font/google';
import { cn } from '@/lib/utils';
import { UIProvider } from '@/contexts/ui-context';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import Script from 'next/script';
import { ClientOnly } from '@/components/shared/client-only';

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

export const metadata: Metadata = {
  title: 'DesignFlow - Creative Services Marketplace',
  description: 'Your Vision, Our Expertise. Simplified.',
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
      <body className="antialiased min-h-screen flex flex-col pb-16 md:pb-0">
        <UIProvider>
          {children}
          <ClientOnly><MobileBottomNav /></ClientOnly>
        </UIProvider>
        <ClientOnly><Toaster /></ClientOnly>
      </body>
    </html>
  );
}
