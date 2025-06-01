
"use client";

import { useState, type ReactElement, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network, PlusCircle, Edit3, Trash2, PackageSearch, Tags } from 'lucide-react';
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

interface ServiceSubCategory {
  id: string;
  name: string;
  description: string;
  parentCategoryId: string;
  parentCategoryName: string; 
  serviceCount: number;
}

// Mock data for parent categories (consistent with service categories page)
const parentCategoriesData = [
  { id: 'cat001', name: 'Logo Design' },
  { id: 'cat002', name: 'Web UI/UX' },
  { id: 'cat003', name: 'Print Materials' },
  { id: 'cat004', name: 'Custom Illustrations' },
  { id: 'cat005', name: 'Social Media Graphics' },
];

const initialSubCategoriesData: ServiceSubCategory[] = [
  { id: 'subcat001', name: 'Minimalist Logos', description: 'Clean and modern logo styles.', parentCategoryId: 'cat001', parentCategoryName: 'Logo Design', serviceCount: 2 },
  { id: 'subcat002', name: 'Vintage Logos', description: 'Retro and classic logo aesthetics.', parentCategoryId: 'cat001', parentCategoryName: 'Logo Design', serviceCount: 1 },
  { id: 'subcat003', name: 'Mobile App UI', description: 'User interfaces for mobile applications.', parentCategoryId: 'cat002', parentCategoryName: 'Web UI/UX', serviceCount: 2 },
  { id: 'subcat004', name: 'Landing Page UX', description: 'User experience design for landing pages.', parentCategoryId: 'cat002', parentCategoryName: 'Web UI/UX', serviceCount: 1 },
  { id: 'subcat005', name: 'Business Cards', description: 'Designs for professional business cards.', parentCategoryId: 'cat003', parentCategoryName: 'Print Materials', serviceCount: 3 },
];

export default function AdminServiceSubCategoriesPage(): ReactElement {
  const [subCategories, setSubCategories] = useState<ServiceSubCategory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch sub-categories from an API
    setSubCategories(initialSubCategoriesData);
  }, []);

  const handleDeleteSubCategory = (subCategoryId: string, subCategoryName: string) => {
    setSubCategories(prevSubCategories => prevSubCategories.filter(subCategory => subCategory.id !== subCategoryId));
    toast({
      title: "Sub-category Deleted (Simulated)",
      description: `Sub-category "${subCategoryName}" has been removed.`,
      variant: "destructive",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Network className="mr-3 h-8 w-8 text-primary" />
          Manage Service Sub-categories
        </h1>
        <Button asChild>
          <Link href="/admin/services/sub-categories/new"> 
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Sub-category
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Service Sub-categories</CardTitle>
          <CardDescription>View, add, edit, or remove service sub-categories. Deletions are simulated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Sub-category Name</TableHead>
                <TableHead className="w-[200px]"><Tags className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Parent Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]"><PackageSearch className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Services</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No sub-categories found.
                  </TableCell>
                </TableRow>
              )}
              {subCategories.map(subCategory => (
                <TableRow key={subCategory.id}>
                  <TableCell className="font-medium">{subCategory.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subCategory.parentCategoryName}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{subCategory.description}</TableCell>
                  <TableCell className="text-center">{subCategory.serviceCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/admin/services/sub-categories/edit/${subCategory.id}`} aria-label={`Edit ${subCategory.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="hover:text-destructive" aria-label={`Delete ${subCategory.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the sub-category
                            "{subCategory.name}". (This is a simulation).
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteSubCategory(subCategory.id, subCategory.name)}>
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
