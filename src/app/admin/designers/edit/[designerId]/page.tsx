
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, XCircle, Users, Mail, Link as LinkIconLucide, CalendarDays, Activity, Loader2, Camera, Image as ImageIcon } from 'lucide-react'; // Renamed LinkIcon to LinkIconLucide
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';


interface Designer {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarHint: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  joinDate: Date;
  servicesApproved: number;
  portfolioLink?: string;
}

// Using the same initial data source for consistency from admin designers list page
const initialDesignersData: Designer[] = [
  { id: 'des001', name: 'Priya Sharma', email: 'priya.sharma@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman designer', status: 'Active', joinDate: new Date(2023, 5, 15), servicesApproved: 7, portfolioLink: 'https://example.com/priyasharma' },
  { id: 'des002', name: 'Rohan Kapoor', email: 'rohan.kapoor@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man architect', status: 'Pending Approval', joinDate: new Date(2023, 8, 20), servicesApproved: 0, portfolioLink: 'https://example.com/rohankapoor' },
  { id: 'des003', name: 'Aisha Khan', email: 'aisha.khan@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman creative', status: 'Active', joinDate: new Date(2022, 11, 1), servicesApproved: 10 },
  { id: 'des004', name: 'Vikram Singh', email: 'vikram.singh@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man artist', status: 'Suspended', joinDate: new Date(2023, 1, 10), servicesApproved: 3, portfolioLink: 'https://example.com/vikramsingh' },
  { id: 'des005', name: 'Sunita Reddy', email: 'sunita.reddy@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman professional', status: 'Pending Approval', joinDate: new Date(2024, 0, 5), servicesApproved: 0 },
  { id: 'des006', name: 'Arjun Mehta', email: 'arjun.mehta@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man photographer', status: 'Active', joinDate: new Date(2023, 3, 12), servicesApproved: 5, portfolioLink: 'https://example.com/arjunmehta' },
  { id: 'des007', name: 'Neha Joshi', email: 'neha.joshi@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman fashion designer', status: 'Active', joinDate: new Date(2022, 7, 25), servicesApproved: 8 },
  { id: 'des008', name: 'Karan Verma', email: 'karan.verma@example.in', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man developer', status: 'Pending Approval', joinDate: new Date(2024, 2, 1), servicesApproved: 0 },
];

const designerStatuses: Designer['status'][] = ['Active', 'Pending Approval', 'Suspended'];

export default function AdminEditDesignerPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const designerId = params.designerId as string;

  const [designer, setDesigner] = useState<Designer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Designer['status']>('Pending Approval');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarHint, setAvatarHint] = useState('');


  useEffect(() => {
    if (designerId) {
      setIsLoading(true);
      // Simulate fetching designer data
      const foundDesigner = initialDesignersData.find(d => d.id === designerId);
      if (foundDesigner) {
        setDesigner(foundDesigner);
        setName(foundDesigner.name);
        setEmail(foundDesigner.email);
        setStatus(foundDesigner.status);
        setPortfolioLink(foundDesigner.portfolioLink || '');
        setAvatarUrl(foundDesigner.avatarUrl);
        setAvatarHint(foundDesigner.avatarHint);
      } else {
        toast({
          title: "Error",
          description: "Designer not found.",
          variant: "destructive",
          duration: 3000,
        });
        router.push('/admin/designers');
      }
      setIsLoading(false);
    }
  }, [designerId, router, toast]);

  const handleSaveChanges = () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Name and Email cannot be empty.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setIsSaving(true);
    // Simulate saving the designer
    console.log("Saving updated designer:", { id: designerId, name, email, status, portfolioLink, avatarUrl, avatarHint });
    
    // In a real app, you'd update your data store here.
    // For simulation, we can update the `initialDesignersData` if desired, but it won't persist across page loads
    // without a proper state management or backend.

    setTimeout(() => {
      toast({
        title: "Designer Updated (Simulated)",
        description: `Designer "${name}" has been successfully updated.`,
        duration: 3000,
      });
      setIsSaving(false);
      router.push('/admin/designers'); // Redirect back to the list
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading designer details...</p>
      </div>
    );
  }

  if (!designer) {
    return <p>Designer not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Edit Designer Profile
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} alt={name} data-ai-hint={avatarHint} />
              <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle>Update: {designer.name}</CardTitle>
                <CardDescription>Modify the profile details for this designer.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name"><Users className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Full Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email"><Mail className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status"><Activity className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Account Status</Label>
              <Select value={status} onValueChange={(value: Designer['status']) => setStatus(value)} disabled={isSaving}>
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
              <Label htmlFor="portfolioLink"><LinkIconLucide className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Portfolio Link</Label>
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

          <Separator className="my-6" />
          
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
                <span className="text-muted-foreground flex items-center"><CalendarDays className="inline-block mr-2 h-4 w-4" />Join Date:</span>
                <p className="font-medium">{format(designer.joinDate, 'PPpp')}</p>
            </div>
            <div className="space-y-1">
                <span className="text-muted-foreground">Services Approved:</span>
                 <p className="font-medium">{designer.servicesApproved}</p>
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
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
