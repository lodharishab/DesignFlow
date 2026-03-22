import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Kit | HYPE',
  description: 'View and manage your brand kit — logos, colors, fonts, and brand guidelines.',
};

export default function BrandKitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
