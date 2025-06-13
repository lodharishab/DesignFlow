
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react'; // Changed from FileShield to Shield
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy | DesignFlow',
  description: 'Understand DesignFlow\'s refund policy for creative services. Learn about eligibility, processes, and our commitment to satisfaction.',
  openGraph: {
    title: 'Refund Policy | DesignFlow',
    description: 'Details on our refund and service guarantee.',
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-4">
                <Shield className="h-10 w-10 mr-3 text-primary" />
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Refund Policy</CardTitle>
            </div>
            <CardDescription>Last Updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2 className="font-headline text-xl">1. Our Commitment</h2>
            <p>At DesignFlow, we strive for client satisfaction and high-quality work from our designers. This policy outlines the conditions under which refunds may be considered.</p>
            
            <h2 className="font-headline text-xl mt-6">2. Eligibility for a Refund</h2>
            <p>Refunds are handled on a case-by-case basis and are generally considered under the following circumstances (this is a placeholder, replace with your actual policy):</p>
            <ul>
              <li>Non-delivery of service: If the designer fails to deliver the agreed-upon service within the specified timeframe without a valid reason.</li>
              <li>Service not as described: If the delivered service significantly deviates from the project brief and agreed scope, and revisions do not rectify the issue.</li>
              <li>Designer misconduct or violation of platform terms.</li>
            </ul>
            <p>Refunds are typically not provided for:</p>
            <ul>
              <li>Change of mind by the client after work has commenced.</li>
              <li>Issues arising from unclear or incomplete briefs provided by the client, where the designer has made reasonable efforts to interpret and deliver.</li>
              <li>Minor aesthetic disagreements if the service substantially meets the brief's functional requirements.</li>
            </ul>

            <h2 className="font-headline text-xl mt-6">3. Refund Process</h2>
            <p>To request a refund, please contact our support team via the <Link href="/contact-support" className="text-primary hover:underline">Contact Support</Link> page, providing your order ID and a detailed explanation of the issue.</p>
            <p>We will review your request and may mediate between you and the designer to find a resolution. Our decision on refunds will be final and binding.</p>
            
            <h2 className="font-headline text-xl mt-6">4. Partial Refunds</h2>
            <p>In some cases, a partial refund may be offered if some work has been completed and is usable by the client, or as a gesture of goodwill.</p>

            <h2 className="font-headline text-xl mt-6">5. Processing Time</h2>
            <p>If a refund is approved, it will typically be processed within 7-10 business days to the original payment method. This may vary depending on your bank or payment provider.</p>
            
            <h2 className="font-headline text-xl mt-6">6. Changes to This Policy</h2>
            <p>We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting on our website.</p>

            <p className="mt-8 text-sm text-muted-foreground">
              This is a placeholder Refund Policy page. Please replace this content with your own comprehensive policy, drafted or reviewed by a legal professional.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
