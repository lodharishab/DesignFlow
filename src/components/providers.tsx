'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { UIProvider } from '@/contexts/ui-context';
import { useRouter } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <HeroUIProvider navigate={router.push}>
        <UIProvider>
          {children}
        </UIProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
