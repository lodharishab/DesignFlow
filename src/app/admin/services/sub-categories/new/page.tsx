
"use client";

import { useState, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, XCircle, Network, Tags, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

// Mock data for parent categories (consistent with service categories page)
const parentCategoriesData = [
  { id: 'cat001', name: 'Logo Design' },
  { id: 'cat002', name: 'Web UI/UX' },
  { id: 'cat003', name: 'Print Materials' },
  { id: 'cat004', name: 'Custom Illustrations' },
  { id: 'cat005', name: 'Social Media Graphics' },
];

export default function AdminAddServiceSubCategoryPage(): ReactElement {
  const router = useRouter();
  const { toast } = useToast();
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryDescription, setSubCategoryDescription] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSubCategory = () => {
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
    console.log("Saving new sub-category:", { name: subCategoryName, description: subCategoryDescription, parentCategoryId });
    
    setTimeout(() => {
      toast({
        title: "Sub-category Added (Simulated)",
        description: `Sub-category "${subCategoryName}" has been successfully added.`,
        duration: 3000,
      });
      setIsSaving(false);
      router.push('/admin/services/sub-categories');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Network className="mr-3 h-8 w-8 text-primary" />
          Add New Service Sub-category
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sub-category Details</CardTitle>
          <CardDescription>Enter the information for the new service sub-category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subCategoryName">Sub-category Name</Label>
            <Input 
              id="subCategoryName" 
              placeholder="e.g., Minimalist Logos, Mobile App UI" 
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
              placeholder="A brief description of what this sub-category includes."
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
          <Button onClick={handleSaveSubCategory} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Sub-category
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
