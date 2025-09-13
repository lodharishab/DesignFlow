
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, PlusCircle, Edit, Trash2, PackageSearch } from 'lucide-react';
import { getBrandKits, deleteBrandKit, type BrandProfileFormData } from '@/lib/brand-profile-db';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';

export default function BrandProfilesPage() {
  const [brandKits, setBrandKits] = useState<BrandProfileFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      const data = await getBrandKits();
      setBrandKits(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleDelete = async (kitId: string) => {
    const success = await deleteBrandKit(kitId);
    if (success) {
      setBrandKits(prev => prev.filter(kit => kit.id !== kitId));
      toast({
        title: "Brand Kit Deleted",
        description: "The brand kit has been successfully removed.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Error",
        description: "Could not delete the brand kit.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Loading brand profiles...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Sparkles className="mr-3 h-8 w-8 text-primary" />
          My Brand Profiles
        </h1>
        <Button asChild>
          <Link href="/client/brand-profile/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Brand
          </Link>
        </Button>
      </div>

      {brandKits.length === 0 ? (
        <Card className="text-center py-16 shadow-lg border-dashed">
          <CardHeader>
            <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
            <CardTitle className="mt-6 text-2xl font-semibold">No Brand Profiles Found</CardTitle>
            <CardDescription className="mt-2">
              Get started by creating your first brand profile to streamline your design projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button size="lg" asChild>
              <Link href="/client/brand-profile/new">Create Your First Brand Profile</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandKits.map((kit) => (
            <Card key={kit.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex-row items-center gap-4">
                 {kit.logoUrl && (
                    <div className="relative h-14 w-14 shrink-0 bg-muted rounded-md flex items-center justify-center">
                        <Image src={kit.logoUrl} alt={`${kit.companyName} logo`} layout="fill" objectFit="contain" className="p-1" />
                    </div>
                )}
                <div>
                  <CardTitle>{kit.companyName || 'Untitled Brand'}</CardTitle>
                  <CardDescription>{kit.industry || 'No industry specified'}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground line-clamp-2">
                    {kit.targetAudience || 'No target audience described.'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the brand profile for "{kit.companyName}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(kit.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button asChild>
                  <Link href={`/client/brand-profile/${kit.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
