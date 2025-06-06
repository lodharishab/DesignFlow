
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Rubik } from 'next/font/google';
import { cn } from '@/lib/utils';
import { UIProvider } from '@/contexts/ui-context';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import Script from 'next/script';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
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
    <html lang="en" suppressHydrationWarning className={cn(rubik.variable)}>
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col pb-16 md:pb-0">
        <UIProvider>
          {children}
          <MobileBottomNav />
        </UIProvider>
        <Toaster />
      </body>
    </html>
  );
}
