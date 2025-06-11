
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-4">
              <FileText className="h-10 w-10 mr-3 text-primary" />
              <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Terms of Service</CardTitle>
            </div>
            <CardDescription>Last Updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2 className="font-headline text-xl">1. Introduction</h2>
            <p>Welcome to DesignFlow! These terms and conditions outline the rules and regulations for the use of DesignFlow's Website, located at [Your Website URL].</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use DesignFlow if you do not agree to take all of the terms and conditions stated on this page.</p>

            <h2 className="font-headline text-xl mt-6">2. Intellectual Property Rights</h2>
            <p>Other than the content you own, under these Terms, DesignFlow and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
            
            <h2 className="font-headline text-xl mt-6">3. User Accounts</h2>
            <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

            <h2 className="font-headline text-xl mt-6">4. Service Usage</h2>
            <p>Our platform connects clients with designers for design services. We facilitate these connections but are not a party to the direct agreements between clients and designers beyond the scope of platform usage.</p>
            <p>[More detailed placeholder text about service agreements, payments, disputes, etc., needs to be added here by a legal professional.]</p>


            <h2 className="font-headline text-xl mt-6">5. Limitations of Liability</h2>
            <p>In no event shall DesignFlow, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. DesignFlow, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

            <h2 className="font-headline text-xl mt-6">6. Governing Law</h2>
            <p>These Terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.</p>
            
            <p className="mt-8 text-sm text-muted-foreground">
              This is a placeholder Terms of Service page. Please replace this content with your own comprehensive terms, drafted or reviewed by a legal professional.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
