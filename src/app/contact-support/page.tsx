
"use client";

import { Navbar } from '@/components/layout/navbar';
import { CategoriesNavbar } from '@/components/layout/categories-navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, User, Mail, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function ContactSupportPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to send your message.",
        variant: "destructive",
      });
      return;
    }
    setIsSending(true);
    // Simulate API call
    console.log("Support message:", { name, email, subject, message });
    setTimeout(() => {
      toast({
        title: "Message Sent (Simulated)",
        description: "Thank you for contacting us! We'll get back to you shortly.",
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSending(false);
    }, 1500);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategoriesNavbar />
      <main className="flex-grow container mx-auto py-12 px-5">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
             <MessageSquare className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold font-headline">Contact Support</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Have questions or need help? Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Your Name</Label>
                  <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={isSending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Your Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSending} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Subject</Label>
                <Input id="subject" placeholder="e.g., Issue with my order, Payment query" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isSending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-muted-foreground"/>Your Message</Label>
                <Textarea id="message" rows={5} placeholder="Please describe your issue or question in detail..." value={message} onChange={(e) => setMessage(e.target.value)} disabled={isSending} />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isSending}>
                {isSending ? "Sending..." : <><Send className="mr-2 h-5 w-5"/>Send Message</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
