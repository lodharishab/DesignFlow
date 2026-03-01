
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | DesignFlow',
  description: 'DesignFlow privacy policy — how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Card className="shadow-lg">
          <CardHeader>
             <div className="flex items-center mb-4">
                <Shield className="h-10 w-10 mr-3 text-primary" />
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Privacy Policy</CardTitle>
            </div>
            <CardDescription>Last Updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2 className="font-headline text-xl">1. Introduction</h2>
            <p>DesignFlow ("us", "we", or "our") operates the [Your Website URL] website (the "Service").</p>
            <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

            <h2 className="font-headline text-xl mt-6">2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, your name, email address, phone number, company information, payment details (processed via third-party gateways), and usage data.</p>

            <h2 className="font-headline text-xl mt-6">3. Use of Data</h2>
            <p>DesignFlow uses the collected data for various purposes such as:</p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
            
            <h2 className="font-headline text-xl mt-6">4. Data Security</h2>
            <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
            <p>[More detailed placeholder text about data storage, third-party services, cookies, user rights, etc., needs to be added here by a legal professional.]</p>

            <h2 className="font-headline text-xl mt-6">5. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
            
            <p className="mt-8 text-sm text-muted-foreground">
              This is a placeholder Privacy Policy page. Please replace this content with your own comprehensive policy, drafted or reviewed by a legal professional.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
