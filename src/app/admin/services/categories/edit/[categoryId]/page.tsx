
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, XCircle, Tags, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  serviceCount: number; // Keep for consistency though not directly edited here
}

// This data would typically come from a store or API, using the list page's data for simulation
const initialCategoriesData: ServiceCategory[] = [
  { id: 'cat001', name: 'Logo Design', description: 'Services related to logo creation and branding identities.', serviceCount: 5 },
  { id: 'cat002', name: 'Web UI/UX', description: 'Designing user interfaces and experiences for websites and apps.', serviceCount: 3 },
  { id: 'cat003', name: 'Print Materials', description: 'Designs for printed materials like brochures, flyers, and business cards.', serviceCount: 7 },
  { id: 'cat004', name: 'Custom Illustrations', description: 'Unique illustrations and artwork for various purposes.', serviceCount: 4 },
  { id: 'cat005', name: 'Social Media Graphics', description: 'Graphics optimized for social media platforms.', serviceCount: 6 },
];

export default function AdminEditServiceCategoryPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (categoryId) {
      // Simulate fetching category data
      const foundCategory = initialCategoriesData.find(cat => cat.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        setCategoryName(foundCategory.name);
        setCategoryDescription(foundCategory.description);
      } else {
        toast({
          title: "Error",
          description: "Category not found.",
          variant: "destructive",
          duration: 3000,
        });
        router.push('/admin/services/categories');
      }
      setIsLoading(false);
    }
  }, [categoryId, router, toast]);

  const handleSaveChanges = () => {
    if (!categoryName.trim() || !categoryDescription.trim()) {
      toast({
        title: "Error",
        description: "Category Name and Description cannot be empty.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setIsSaving(true);
    // Simulate saving the category
    console.log("Saving updated category:", { id: categoryId, name: categoryName, description: categoryDescription });
    
    // Simulate API delay
    setTimeout(() => {
      toast({
        title: "Category Updated (Simulated)",
        description: `Category "${categoryName}" has been successfully updated.`,
        duration: 3000,
      });
      setIsSaving(false);
      router.push('/admin/services/categories');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading category details...</p>
      </div>
    );
  }

  if (!category) {
    // This case should ideally be handled by the redirect in useEffect,
    // but it's good practice to have a fallback.
    return <p>Category not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Tags className="mr-3 h-8 w-8 text-primary" />
          Edit Service Category
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Update Category: {category.name}</CardTitle>
          <CardDescription>Modify the name and description for this service category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input 
              id="categoryName" 
              placeholder="e.g., Web Design, Illustration" 
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryDescription">Description</Label>
            <Textarea 
              id="categoryDescription" 
              placeholder="A brief description of what this category includes."
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              rows={4}
              disabled={isSaving}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          <Button variant="outline" asChild disabled={isSaving}>
            <Link href="/admin/services/categories">
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
