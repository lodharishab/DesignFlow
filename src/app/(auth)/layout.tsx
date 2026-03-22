import { Brush } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-background p-4">
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <Brush className="h-8 w-8 text-primary" />
        <span className="font-bold font-headline text-3xl">HYPE</span>
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
