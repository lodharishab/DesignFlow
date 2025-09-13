
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, PlusCircle, Edit, Trash2, PackageSearch, Heart, Share2, Mail, Copy, Send, MessageSquare } from 'lucide-react';
import { getBrandKits, deleteBrandKit, toggleFavoriteBrandKit, type BrandProfileFormData } from '@/lib/brand-profile-db';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useUI } from '@/contexts/ui-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ShareBrandKitDialog({ kit }: { kit: BrandProfileFormData }) {
  const { toast } = useToast();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Ensure window is defined (runs only on client)
    setBaseUrl(window.location.origin);
  }, []);

  const shareUrl = `${baseUrl}/brand-kit/${kit.id}`;
  const whatsappText = encodeURIComponent(`Check out our brand kit for ${kit.companyName}: ${shareUrl}`);
  const emailSubject = encodeURIComponent(`Brand Kit: ${kit.companyName}`);
  const emailBody = encodeURIComponent(`Hi,\n\nPlease find our brand kit here: ${shareUrl}\n\nThank you`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link Copied!", description: "The shareable link has been copied to your clipboard." });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share "{kit.companyName}"</DialogTitle>
        <DialogDescription>
          Share this brand kit with your team, designers, or partners.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="share-link">Public Share Link</Label>
          <div className="flex gap-2">
            <Input id="share-link" value={shareUrl} readOnly />
            <Button onClick={copyToClipboard} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" asChild>
            <a href={`mailto:?subject=${emailSubject}&body=${emailBody}`} target="_blank" rel="noopener noreferrer">
              <Mail className="mr-2 h-4 w-4" /> Email
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
            </a>
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Share with a Designer on DesignFlow</Label>
          <div className="flex gap-2">
            <Input placeholder="Enter designer's username or email..." disabled />
            <Button disabled><Send className="h-4 w-4" /></Button>
          </div>
          <p className="text-xs text-muted-foreground">This feature is coming soon.</p>
        </div>
      </div>
    </DialogContent>
  );
}


export default function BrandProfilesPage() {
  const { brandKits, loadBrandKits } = useUI(); // Use context
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      await loadBrandKits();
      setIsLoading(false);
    }
    loadData();
  }, [loadBrandKits]);

  const handleDelete = async (kitId: string, kitName: string) => {
    const success = await deleteBrandKit(kitId);
    if (success) {
      await loadBrandKits(); // Reload data into context
      toast({
        title: "Brand Kit Deleted",
        description: `"${kitName}" has been successfully removed.`,
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

  const handleToggleFavorite = async (kitId: string, kitName: string, isCurrentlyFavorite: boolean) => {
    const updatedKit = await toggleFavoriteBrandKit(kitId);
    if (updatedKit) {
      await loadBrandKits(); // Reload data into context
      toast({
        title: `Brand Kit ${isCurrentlyFavorite ? 'Unfavorited' : 'Favorited'}`,
        description: `"${kitName}" has been ${isCurrentlyFavorite ? 'removed from' : 'added to'} your favorites.`,
      });
    }
  };

  const sortedBrandKits = [...brandKits].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return (a.companyName || '').localeCompare(b.companyName || '');
  });


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

      {sortedBrandKits.length === 0 ? (
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
          {sortedBrandKits.map((kit) => (
            <Card key={kit.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow relative">
              {kit.isFavorite && (
                <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 z-10">
                  <Heart className="h-3.5 w-3.5 fill-current" />
                </div>
              )}
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
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleToggleFavorite(kit.id, kit.companyName, !!kit.isFavorite)}
                    className={cn(kit.isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500")}
                  >
                    <Heart className={cn("h-4 w-4", kit.isFavorite && "fill-current")} />
                  </Button>
                <Dialog>
                  <DialogTrigger asChild>
                     <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                  </DialogTrigger>
                  <ShareBrandKitDialog kit={kit} />
                </Dialog>
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
                      <AlertDialogAction onClick={() => handleDelete(kit.id, kit.companyName)}>Delete</AlertDialogAction>
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
