
"use client";

import { useState, type ReactElement, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tags as TagsIcon, Edit3, Trash2, PackageSearch, Eye } from 'lucide-react'; // Renamed Tags to TagsIcon
import Link from 'next/link';
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
import { Badge } from '@/components/ui/badge';

// Duplicating relevant parts of AdminServiceModified and initialServicesData
// for this standalone page example. In a real app, this data would come from a shared service/store or API.
interface ServiceTierAdmin {
  id: string;
  name: string;
  price: number;
  description: string;
  deliveryTime: string;
}

interface AdminServiceModified {
  id: string;
  name: string;
  category: string;
  generalDescription: string;
  status: 'Active' | 'Draft' | 'Archived';
  imageUrl?: string;
  imageAiHint?: string;
  tags?: string[];
  tiers: ServiceTierAdmin[];
}

const initialServicesDataForTags: AdminServiceModified[] = [
  {
    id: 'svc001',
    name: 'Modern Logo Design',
    category: 'Logo Design',
    generalDescription: 'High-quality, modern logo designs tailored to your brand.',
    status: 'Active',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'logo design',
    tags: ['branding', 'minimalist', 'corporate', 'startup'],
    tiers: [ { id: 'tier1_1', name: 'Standard', price: 199, description: '...', deliveryTime: '5-7 days' }]
  },
  {
    id: 'svc002',
    name: 'Social Media Post Pack',
    category: 'Social Media',
    generalDescription: 'Engaging posts for your social media channels.',
    status: 'Active',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'social media',
    tags: ['instagram', 'facebook', 'content creation', 'marketing'],
    tiers: [ { id: 'tier2_1', name: 'Starter Pack', price: 49, description: '...', deliveryTime: '2-3 days' }]
  },
  {
    id: 'svc003',
    name: 'Professional Brochure Design',
    category: 'Print Design',
    generalDescription: 'Stunning brochures to showcase your business.',
    status: 'Draft',
    tags: ['marketing collateral', 'print', 'corporate', 'brochure'],
    tiers: [ { id: 'tier3_1', name: 'Standard', price: 249, description: '...', deliveryTime: '7-10 days' }]
  },
   {
    id: 'svc004',
    name: 'UI/UX Web Design Mockup',
    category: 'UI/UX Design',
    generalDescription: 'High-fidelity mockup for one key page.',
    status: 'Active',
    tags: ['website', 'app design', 'user experience', 'minimalist'],
    tiers: [ { id: 'tier4_1', name: 'Standard', price: 399, description: '...', deliveryTime: '10-14 days' }]
  },
  {
    id: 'svc005',
    name: 'Custom Illustration',
    category: 'Illustration',
    generalDescription: 'Unique vector or raster illustration.',
    status: 'Archived',
    tags: ['art', 'vector', 'character design', 'branding'],
    tiers: [ { id: 'tier5_1', name: 'Basic', price: 79, description: '...', deliveryTime: '3-5 days' }]
  },
];


interface TagWithCount {
  name: string;
  count: number;
}

export default function AdminServiceTagsPage(): ReactElement {
  const [tagsWithCounts, setTagsWithCounts] = useState<TagWithCount[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const getUniqueTagsWithCounts = (services: AdminServiceModified[]): TagWithCount[] => {
      const tagCounts: Record<string, number> = {};
      services.forEach(service => {
        service.tags?.forEach(tag => {
          const normalizedTag = tag.trim().toLowerCase(); // Normalize for better counting
          if (normalizedTag) {
            tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
          }
        });
      });
      return Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count); // Sort by count desc
    };

    setTagsWithCounts(getUniqueTagsWithCounts(initialServicesDataForTags));
  }, []);

  const handleDeleteTag = (tagName: string) => {
    // Simulate API call for deletion
    // This is complex because it would involve removing the tag from all services
    toast({
      title: "Delete Tag (Simulated)",
      description: `Tag "${tagName}" would be removed from all services. This action is not fully implemented.`,
      variant: "destructive",
      duration: 4000,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <TagsIcon className="mr-3 h-8 w-8 text-primary" />
          Manage Service Tags
        </h1>
        {/* Future: Button to add a new global tag or manage tag aliases */}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Unique Service Tags</CardTitle>
          <CardDescription>View all tags currently used across services and how many services use each tag. Edit/Delete actions are placeholders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Tag Name</TableHead>
                <TableHead className="w-[150px] text-center"><PackageSearch className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Service Count</TableHead>
                <TableHead className="text-right w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tagsWithCounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    No tags found. Add tags to your services.
                  </TableCell>
                </TableRow>
              )}
              {tagsWithCounts.map(tag => (
                <TableRow key={tag.name}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary" className="text-sm capitalize">{tag.name}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{tag.count}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" disabled className="hover:text-primary" aria-label={`View services with tag ${tag.name}`}>
                      <Eye className="mr-2 h-4 w-4" /> View Services (Soon)
                    </Button>
                    <Button variant="outline" size="icon" disabled className="hover:text-primary" aria-label={`Edit tag ${tag.name}`}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" disabled className="hover:text-destructive" aria-label={`Delete tag ${tag.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action would permanently delete the tag "{tag.name}" from all associated services.
                            This is a simulation and not fully implemented.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTag(tag.name)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
