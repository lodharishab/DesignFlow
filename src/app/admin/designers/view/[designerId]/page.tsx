
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail, Link as LinkIconLucide, CalendarDays, Activity, Loader2, Edit3, ArrowLeft, Image as ImageIcon, Camera } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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


const getStatusBadgeVariant = (status: Designer['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending Approval':
        return 'secondary';
      case 'Suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

export default function AdminViewDesignerPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const designerId = params.designerId as string;

  const [designer, setDesigner] = useState<Designer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (designerId) {
      setIsLoading(true);
      // Simulate fetching designer data
      const foundDesigner = initialDesignersData.find(d => d.id === designerId);
      if (foundDesigner) {
        setDesigner(foundDesigner);
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
          View Designer Profile
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint={designer.avatarHint} />
              <AvatarFallback>{designer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="font-headline text-2xl">{designer.name}</CardTitle>
                <CardDescription>Viewing profile details for this designer.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 text-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground flex items-center mb-1"><Users className="inline-block mr-2 h-4 w-4" />Full Name</p>
              <p className="font-medium text-base">{designer.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground flex items-center mb-1"><Mail className="inline-block mr-2 h-4 w-4" />Email Address</p>
              <p className="font-medium text-base">{designer.email}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground flex items-center mb-1"><Activity className="inline-block mr-2 h-4 w-4" />Account Status</p>
              <Badge variant={getStatusBadgeVariant(designer.status)} className="text-base px-3 py-1">{designer.status}</Badge>
            </div>
             <div>
              <p className="text-muted-foreground flex items-center mb-1"><LinkIconLucide className="inline-block mr-2 h-4 w-4" />Portfolio Link</p>
              {designer.portfolioLink ? (
                <Link href={designer.portfolioLink} target="_blank" rel="noopener noreferrer" className="font-medium text-base text-primary hover:underline">
                  {designer.portfolioLink}
                </Link>
              ) : (
                <p className="font-medium text-base italic text-muted-foreground">Not Provided</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <p className="text-muted-foreground flex items-center mb-1"><Camera className="inline-block mr-2 h-4 w-4" />Avatar URL</p>
                <p className="font-medium text-base break-all">{designer.avatarUrl}</p>
            </div>
            <div>
                <p className="text-muted-foreground flex items-center mb-1"><ImageIcon className="inline-block mr-2 h-4 w-4" />Avatar AI Hint</p>
                <p className="font-medium text-base">{designer.avatarHint}</p>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <p className="text-muted-foreground flex items-center mb-1"><CalendarDays className="inline-block mr-2 h-4 w-4" />Join Date</p>
                <p className="font-medium text-base">{format(designer.joinDate, 'PPpp')}</p>
            </div>
            <div>
                <p className="text-muted-foreground flex items-center mb-1"><Activity className="inline-block mr-2 h-4 w-4" />Services Approved</p>
                 <p className="font-medium text-base">{designer.servicesApproved}</p>
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end space-x-3 pt-6">
          <Button asChild>
            <Link href={`/admin/designers/edit/${designer.id}`}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
