
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Rubik } from 'next/font/google'; // Changed from Poppins and Playfair_Display
import { cn } from '@/lib/utils';
import { UIProvider } from '@/contexts/ui-context';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import Script from 'next/script';

const rubik = Rubik({ // Changed to Rubik
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Added a range of weights for Rubik
  variable: '--font-rubik', // Changed variable name
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
    <html lang="en" suppressHydrationWarning className={cn(rubik.variable)}> {/* Used Rubik variable */}
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col pb-16 md:pb-0"> {/* font-body will now use Rubik from Tailwind config */}
        <UIProvider>
          {children}
          <MobileBottomNav />
        </UIProvider>
        <Toaster />
      </body>
    </html>
  );
}
