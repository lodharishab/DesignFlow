
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, XCircle, Network, Tags, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface ServiceSubCategory {
  id: string;
  name: string;
  description: string;
  parentCategoryId: string;
  parentCategoryName?: string; // For display, but not directly edited
  serviceCount?: number; // For consistency, not edited here
}

// Mock data for parent categories (consistent with service categories page)
const parentCategoriesData = [
  { id: 'cat001', name: 'Logo Design' },
  { id: 'cat002', name: 'Web UI/UX' },
  { id: 'cat003', name: 'Print Materials' },
  { id: 'cat004', name: 'Custom Illustrations' },
  { id: 'cat005', name: 'Social Media Graphics' },
];

// This data would typically come from a store or API, using the list page's data for simulation
const initialSubCategoriesData: ServiceSubCategory[] = [
  { id: 'subcat001', name: 'Minimalist Logos', description: 'Clean and modern logo styles.', parentCategoryId: 'cat001' },
  { id: 'subcat002', name: 'Vintage Logos', description: 'Retro and classic logo aesthetics.', parentCategoryId: 'cat001' },
  { id: 'subcat003', name: 'Mobile App UI', description: 'User interfaces for mobile applications.', parentCategoryId: 'cat002' },
  { id: 'subcat004', name: 'Landing Page UX', description: 'User experience design for landing pages.', parentCategoryId: 'cat002' },
  { id: 'subcat005', name: 'Business Cards', description: 'Designs for professional business cards.', parentCategoryId: 'cat003' },
];


export default function AdminEditServiceSubCategoryPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const subCategoryId = params.subCategoryId as string;

  const [subCategory, setSubCategory] = useState<ServiceSubCategory | null>(null);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryDescription, setSubCategoryDescription] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (subCategoryId) {
      setIsLoading(true);
      // Simulate fetching sub-category data
      const foundSubCategory = initialSubCategoriesData.find(subcat => subcat.id === subCategoryId);
      if (foundSubCategory) {
        setSubCategory(foundSubCategory);
        setSubCategoryName(foundSubCategory.name);
        setSubCategoryDescription(foundSubCategory.description);
        setParentCategoryId(foundSubCategory.parentCategoryId);
      } else {
        toast({
          title: "Error",
          description: "Sub-category not found.",
          variant: "destructive",
          duration: 3000,
        });
        router.push('/admin/services/sub-categories');
      }
      setIsLoading(false);
    }
  }, [subCategoryId, router, toast]);

  const handleSaveChanges = () => {
    if (!subCategoryName.trim() || !subCategoryDescription.trim() || !parentCategoryId) {
      toast({
        title: "Error",
        description: "Sub-category Name, Description, and Parent Category cannot be empty.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setIsSaving(true);
    // Simulate saving the sub-category
    console.log("Saving updated sub-category:", { id: subCategoryId, name: subCategoryName, description: subCategoryDescription, parentCategoryId });
    
    setTimeout(() => {
      toast({
        title: "Sub-category Updated (Simulated)",
        description: `Sub-category "${subCategoryName}" has been successfully updated.`,
        duration: 3000,
      });
      setIsSaving(false);
      router.push('/admin/services/sub-categories');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading sub-category details...</p>
      </div>
    );
  }

  if (!subCategory) {
    return <p>Sub-category not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Network className="mr-3 h-8 w-8 text-primary" />
          Edit Service Sub-category
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Update Sub-category: {subCategory.name}</CardTitle>
          <CardDescription>Modify the details for this service sub-category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subCategoryName">Sub-category Name</Label>
            <Input 
              id="subCategoryName" 
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              disabled={isSaving}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="parentCategory"><Tags className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Parent Category*</Label>
            <Select value={parentCategoryId} onValueChange={setParentCategoryId} disabled={isSaving}>
              <SelectTrigger id="parentCategory">
                <SelectValue placeholder="Select a parent category" />
              </SelectTrigger>
              <SelectContent>
                {parentCategoriesData.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subCategoryDescription">Description</Label>
            <Textarea 
              id="subCategoryDescription" 
              value={subCategoryDescription}
              onChange={(e) => setSubCategoryDescription(e.target.value)}
              rows={4}
              disabled={isSaving}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          <Button variant="outline" asChild disabled={isSaving}>
            <Link href="/admin/services/sub-categories">
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
