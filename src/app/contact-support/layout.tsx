import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support',
  description: 'Get help from the DesignFlow India support team. Reach out with questions about orders, services, or your account.',
};

export default function ContactSupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
