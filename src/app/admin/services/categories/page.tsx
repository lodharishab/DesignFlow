
"use client";

import { useState, type ReactElement, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tags, PlusCircle, Edit3, Trash2, PackageSearch } from 'lucide-react';
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

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  serviceCount: number;
}

const initialCategoriesData: ServiceCategory[] = [
  { id: 'cat001', name: 'Logo Design', description: 'Services related to logo creation and branding identities.', serviceCount: 5 },
  { id: 'cat002', name: 'Web UI/UX', description: 'Designing user interfaces and experiences for websites and apps.', serviceCount: 3 },
  { id: 'cat003', name: 'Print Materials', description: 'Designs for printed materials like brochures, flyers, and business cards.', serviceCount: 7 },
  { id: 'cat004', name: 'Custom Illustrations', description: 'Unique illustrations and artwork for various purposes.', serviceCount: 4 },
  { id: 'cat005', name: 'Social Media Graphics', description: 'Graphics optimized for social media platforms.', serviceCount: 6 },
];

export default function AdminServiceCategoriesPage(): ReactElement {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch categories from an API
    setCategories(initialCategoriesData);
  }, []);

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    // Simulate API call for deletion
    setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
    toast({
      title: "Category Deleted (Simulated)",
      description: `Category "${categoryName}" has been removed.`,
      variant: "destructive",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Tags className="mr-3 h-8 w-8 text-primary" />
          Manage Service Categories
        </h1>
        <Button asChild>
          <Link href="/admin/services/categories/new"> 
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Service Categories</CardTitle>
          <CardDescription>View, add, edit, or remove service categories. Add/Edit pages are not yet implemented. Deletions are simulated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]"><PackageSearch className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Services</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
              {categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{category.description}</TableCell>
                  <TableCell className="text-center">{category.serviceCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/admin/services/categories/edit/${category.id}`} aria-label={`Edit ${category.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="hover:text-destructive" aria-label={`Delete ${category.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category
                            "{category.name}". (This is a simulation).
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(category.id, category.name)}>
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
