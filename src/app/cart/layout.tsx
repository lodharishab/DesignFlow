import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected design services and proceed to checkout on DesignFlow India.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
