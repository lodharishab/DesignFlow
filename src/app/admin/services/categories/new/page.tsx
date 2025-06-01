
"use client";

import { useState, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save, XCircle, Tags } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function AdminAddServiceCategoryPage(): ReactElement {
  const router = useRouter();
  const { toast } = useToast();
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleSaveCategory = () => {
    if (!categoryName.trim() || !categoryDescription.trim()) {
      toast({
        title: "Error",
        description: "Category Name and Description cannot be empty.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Simulate saving the category
    console.log("Saving new category:", { name: categoryName, description: categoryDescription });
    toast({
      title: "Category Added (Simulated)",
      description: `Category "${categoryName}" has been successfully added.`,
      duration: 3000,
    });
    router.push('/admin/services/categories');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Tags className="mr-3 h-8 w-8 text-primary" />
          Add New Service Category
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Enter the name and description for the new service category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input 
              id="categoryName" 
              placeholder="e.g., Web Design, Illustration" 
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          <Button variant="outline" asChild>
            <Link href="/admin/services/categories">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSaveCategory}>
            <Save className="mr-2 h-4 w-4" />
            Save Category
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
