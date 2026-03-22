import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Failed',
  description: 'There was an issue processing your order on HYPE India. Please try again.',
};

export default function OrderFailedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
