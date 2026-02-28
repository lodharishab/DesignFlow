import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice',
  description: 'View your order invoice details on DesignFlow India.',
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
