import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been successfully placed on DesignFlow India.',
};

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
