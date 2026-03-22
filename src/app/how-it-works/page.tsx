
import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PackageSearch, FileText, Users, Award, Briefcase, IndianRupee, Lightbulb, Wand2, Bell as BellIcon, UserPlus as UserPlusIcon } from 'lucide-react'; // Import actual icons
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How HYPE Works - Simple Steps for Clients & Designers',
  description: 'Learn how HYPE makes it easy to get great design work done. Step-by-step guides for clients and designers in India.',
  openGraph: {
    title: 'How HYPE Works',
    description: 'Your streamlined process for creative design services.',
  },
};

const clientSteps = [
  {
    icon: PackageSearch,
    title: "1. Find Your Service",
    description: "Browse our extensive catalog of fixed-price design services. Use filters to narrow down by category, style, or budget. Each service clearly outlines scope and deliverables.",
  },
  {
    icon: FileText,
    title: "2. Submit Your Brief",
    description: "Once you've chosen a service and tier, fill out our guided project brief. Provide details about your brand, target audience, preferences, and any specific requirements.",
  },
  {
    icon: Users,
    title: "3. Designer Matching",
    description: "Our platform matches your project with approved, skilled designers, or you may have the option to choose from available designers for that service.",
  },
  {
    icon: Briefcase,
    title: "4. Collaborate & Review",
    description: "Work directly with your assigned designer. Provide feedback on drafts, request revisions (as per your service tier), and track progress through your dashboard.",
  },
  {
    icon: Award,
    title: "5. Approve & Receive Files",
    description: "Once you're happy with the final design, approve the work. You'll receive all the final files as specified in your service package, ready to use.",
  },
];

// Define UserPlus and Bell before they are used in designerSteps
// Ensure these are actual Lucide icons or your custom components
const UserPlus = UserPlusIcon; 
const Bell = BellIcon;

const designerSteps = [
  {
    icon: UserPlus, 
    title: "1. Apply & Get Approved",
    description: "Showcase your skills by applying to join HYPE. Our team reviews your portfolio and experience to ensure quality for our clients.",
  },
  {
    icon: Bell, 
    title: "2. Get Notified of Projects",
    description: "Once approved for specific service categories, you'll receive notifications for new client projects that match your expertise and preferences.",
  },
  {
    icon: Briefcase,
    title: "3. Accept & Deliver",
    description: "Review project briefs, accept orders you're confident in, and deliver high-quality design work within the agreed timelines. Communicate with clients for clarifications.",
  },
  {
    icon: IndianRupee, 
    title: "4. Get Paid Securely",
    description: "Upon successful project completion and client approval, receive your payment securely through our platform, minus standard platform fees.",
  },
  {
    icon: Wand2, 
    title: "5. Build Your Reputation",
    description: "Deliver great work consistently to receive positive reviews, enhance your portfolio, and get access to more exciting projects.",
  },
];


export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-5 text-center">
            <Lightbulb className="mx-auto h-16 w-16 mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-bold font-headline">
              How HYPE Works
            </h1>
            <p className="text-lg md:text-xl mt-4 max-w-3xl mx-auto opacity-90">
              A simple, transparent, and efficient process for getting high-quality design work done.
            </p>
          </div>
        </section>

        {/* For Clients Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
              For Clients: Your Path to Great Design
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clientSteps.map((step, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 inline-flex">
                       <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm text-center">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-16">
                <Button size="lg" asChild>
                    <Link href="/design-services">Start Your Project Now</Link>
                </Button>
            </div>
          </div>
        </section>

        {/* For Designers Section */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
              For Designers: Showcase Your Talent
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {designerSteps.map((step, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <CardHeader className="items-center text-center">
                     <div className="p-4 bg-primary/10 rounded-full mb-4 inline-flex">
                       <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm text-center">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
             <div className="text-center mt-16">
                <Button size="lg" variant="outline" asChild>
                    <Link href="/signup/designer">Join as a Designer</Link>
                </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
