
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kira AI Assistant | DesignFlow',
  description: 'Chat with Kira, your personal AI design assistant on DesignFlow. Get help with project briefs, finding services, and more.',
};

export default function AiAssistantPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
             <Sparkles className="mx-auto h-16 w-16 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold font-headline">Kira - Your AI Assistant</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              This feature is currently under development.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
                Soon, you'll be able to chat with Kira to get help finding the right design service, crafting the perfect project brief, or getting answers to your questions about the platform.
            </p>
            <p className="font-semibold text-primary">Stay tuned!</p>
            <div className="pt-4">
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
