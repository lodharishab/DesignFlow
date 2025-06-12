
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageSquare } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | DesignFlow',
  description: 'Find answers to common questions about DesignFlow services, how it works for clients and designers, payments, and more.',
  openGraph: {
    title: 'FAQ | DesignFlow',
    description: 'Get answers to your questions about DesignFlow.',
  },
};

const generalFaqs = [
  {
    question: 'What is DesignFlow?',
    answer: 'DesignFlow is a creative services marketplace connecting clients with expert designers, primarily focused on the Indian market. We offer a streamlined process for various design needs with transparent pricing.',
  },
  {
    question: 'How is DesignFlow different from other platforms?',
    answer: 'DesignFlow emphasizes fixed-scope services, transparent pricing, and a curated community of designers to ensure quality and a smooth experience for both clients and designers.',
  },
];

const clientFaqs = [
  {
    question: 'How do I order a service?',
    answer: 'Browse our services, select the one you need, choose a tier, and proceed to checkout. You\'ll then be guided to submit a project brief.',
  },
  {
    question: 'What if I need revisions?',
    answer: 'Most service tiers include a specific number of revision rounds. You can communicate your feedback directly to the designer through the platform.',
  },
  {
    question: 'How does payment work?',
    answer: 'Payments are typically made upfront when you order a service. We use secure payment gateways like Razorpay. Funds are held until milestones are met or the project is completed to your satisfaction (as per our policies).',
  },
];

const designerFaqs = [
  {
    question: 'How can I join DesignFlow as a designer?',
    answer: 'You can apply by signing up as a designer on our platform. We review applications to ensure a high standard of quality and professionalism.',
  },
  {
    question: 'How do I get paid?',
    answer: 'Once a project is completed and approved by the client, funds (minus platform fees) are transferred to your designated account. Details are available in your designer dashboard.',
  },
];


export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="text-4xl font-bold font-headline">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Find answers to common questions about DesignFlow.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-3xl mx-auto">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold font-headline mb-6 text-center">General Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {generalFaqs.map((faq, index) => (
                  <AccordionItem key={`general-${index}`} value={`general-item-${index}`}>
                    <AccordionTrigger className="text-lg hover:text-primary text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold font-headline mb-6 text-center">For Clients</h2>
              <Accordion type="single" collapsible className="w-full">
                {clientFaqs.map((faq, index) => (
                  <AccordionItem key={`client-${index}`} value={`client-item-${index}`}>
                    <AccordionTrigger className="text-lg hover:text-primary text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold font-headline mb-6 text-center">For Designers</h2>
              <Accordion type="single" collapsible className="w-full">
                {designerFaqs.map((faq, index) => (
                  <AccordionItem key={`designer-${index}`} value={`designer-item-${index}`}>
                    <AccordionTrigger className="text-lg hover:text-primary text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="text-center mt-12 border-t pt-8">
                <h3 className="text-xl font-semibold mb-3">Can't find your answer?</h3>
                <p className="text-muted-foreground mb-4">Our support team is here to help.</p>
                <Button asChild size="lg">
                    <Link href="/contact-support">
                        <MessageSquare className="mr-2 h-5 w-5" /> Contact Support
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
