
"use client";

import { useState, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, XCircle, Users, Mail, Link as LinkIconLucide, Activity, PlusCircle, Loader2, Camera, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

type DesignerStatus = 'Active' | 'Pending Approval' | 'Suspended';
const designerStatuses: DesignerStatus[] = ['Active', 'Pending Approval', 'Suspended'];

export default function AdminAddDesignerPage(): ReactElement {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<DesignerStatus>('Pending Approval');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://placehold.co/100x100.png');
  const [avatarHint, setAvatarHint] = useState('person avatar');

  const handleSaveDesigner = () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Name and Email cannot be empty.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    // Basic email validation
    if (!email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    // Simulate saving the new designer
    const newDesigner = { 
      id: `des_${Date.now()}`, // Simulated ID
      name, 
      email, 
      status, 
      portfolioLink,
      avatarUrl,
      avatarHint,
      joinDate: new Date(),
      servicesApproved: 0,
    };
    console.log("Saving new designer:", newDesigner);
    
    // In a real app, you'd add this to your data store (e.g., initialDesignersData on the list page, or a backend)

    setTimeout(() => {
      toast({
        title: "Designer Added (Simulated)",
        description: `Designer "${name}" has been successfully added.`,
        duration: 3000,
      });
      setIsSaving(false);
      router.push('/admin/designers'); // Redirect back to the list
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <PlusCircle className="mr-3 h-8 w-8 text-primary" />
          Add New Designer
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>New Designer Profile</CardTitle>
          <CardDescription>Enter the details for the new designer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name"><Users className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Full Name*</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email"><Mail className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Email Address*</Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSaving}
                placeholder="e.g., designer@example.com"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status"><Activity className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Account Status*</Label>
              <Select value={status} onValueChange={(value: DesignerStatus) => setStatus(value)} disabled={isSaving}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {designerStatuses.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="portfolioLink"><LinkIconLucide className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Portfolio Link (Optional)</Label>
              <Input 
                id="portfolioLink" 
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                disabled={isSaving}
                placeholder="https://example.com/portfolio"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="avatarUrl"><Camera className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Avatar URL</Label>
                <Input 
                    id="avatarUrl" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    disabled={isSaving}
                    placeholder="https://placehold.co/100x100.png"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="avatarHint"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Avatar AI Hint</Label>
                <Input 
                    id="avatarHint" 
                    value={avatarHint}
                    onChange={(e) => setAvatarHint(e.target.value)}
                    disabled={isSaving}
                    placeholder="e.g., woman avatar"
                />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" asChild disabled={isSaving}>
            <Link href="/admin/designers">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSaveDesigner} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Designer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
