
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersRound, ArrowLeft, PackageSearch, User } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { initialUsersData, type User as UserData } from '@/app/admin/users/users-data';

function DesignerViewContent() {
  const params = useParams();
  const router = useRouter();
  const designerId = params.designerId as string;

  const [designer, setDesigner] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (designerId) {
      // Simulate data fetching
      const foundDesigner = initialUsersData.find(u => u.id === designerId && u.roles.includes('Designer'));
      setDesigner(foundDesigner || null);
      setIsLoading(false);
    }
  }, [designerId]);

  if (isLoading) {
    return <div className="container mx-auto py-12 px-5 text-center">Loading designer details...</div>;
  }

  if (!designer) {
     return (
      <div className="container mx-auto py-12 px-5 text-center">
        <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h1 className="mt-6 text-2xl font-semibold">Designer Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The designer (ID: {designerId}) you are looking for does not exist or is not a designer.
        </p>
        <Button asChild className="mt-6" onClick={() => router.back()}>
            <span><ArrowLeft className="mr-2 h-4 w-4" /> Back</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-headline flex items-center">
            <User className="mr-3 h-8 w-8 text-primary" />
            View Designer Details
            </h1>
            <Button variant="outline" asChild>
                <Link href="/admin/designers">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Designers List
                </Link>
            </Button>
       </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Designer: {designer.name} (ID: {designer.id})</CardTitle>
          <CardDescription>
            This page is a placeholder for viewing detailed designer information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><span className="font-semibold">Email:</span> {designer.email}</p>
          <p><span className="font-semibold">Roles:</span> {designer.roles.join(', ')}</p>
          <p><span className="font-semibold">Status:</span> {designer.status}</p>
          
          <div className="pt-6">
            <h3 className="font-semibold text-lg mb-2">Placeholder Sections:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Assigned Projects</li>
                <li>Portfolio Link</li>
                <li>Approval Status</li>
                <li>Payment Information</li>
            </ul>
          </div>
           <Button asChild className="mt-6">
            <Link href={`/admin/designers/edit/${designer.id}`}>Edit Designer</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminViewDesignerPage() {
    return (
        <Suspense fallback={<div className="flex-grow container mx-auto py-12 px-5 text-center">Loading designer...</div>}>
            <DesignerViewContent />
        </Suspense>
    )
}
