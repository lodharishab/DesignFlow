
"use client";

import { useState, type ReactElement, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase, PlusCircle, Edit3, Trash2, DollarSign, Tag, Activity } from 'lucide-react';
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

interface AdminService {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'Active' | 'Draft' | 'Archived';
}

const initialServicesData: AdminService[] = [
  { id: 'svc001', name: 'Modern Logo Design', category: 'Logo Design', price: 199, status: 'Active' },
  { id: 'svc002', name: 'Social Media Post Pack', category: 'Social Media', price: 99, status: 'Active' },
  { id: 'svc003', name: 'Professional Brochure Design', category: 'Print Design', price: 249, status: 'Draft' },
  { id: 'svc004', name: 'UI/UX Web Design Mockup', category: 'UI/UX Design', price: 399, status: 'Active' },
  { id: 'svc005', name: 'Custom Illustration', category: 'Illustration', price: 149, status: 'Archived' },
  { id: 'svc006', name: 'Animated Explainer Video', category: 'Video & Animation', price: 599, status: 'Active' },
];

export default function AdminServicesPage(): ReactElement {
  const [services, setServices] = useState<AdminService[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch services from an API
    setServices(initialServicesData);
  }, []);

  const handleDeleteService = (serviceId: string, serviceName: string) => {
    // Simulate API call for deletion
    setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
    toast({
      title: "Service Deleted (Simulated)",
      description: `Service "${serviceName}" has been removed.`,
      variant: "destructive",
      duration: 3000,
    });
  };

  const getStatusBadgeVariant = (status: AdminService['status']) => {
    switch (status) {
      case 'Active':
        return 'default'; // Corresponds to primary color
      case 'Draft':
        return 'secondary';
      case 'Archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Manage Services
        </h1>
        <Button asChild>
          <Link href="/admin/services/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>View, add, edit, or remove design services offered on the platform. Deletions are simulated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Service Name</TableHead>
                <TableHead><Tag className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Category</TableHead>
                <TableHead><DollarSign className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Price</TableHead>
                <TableHead><Activity className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Status</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No services found.
                  </TableCell>
                </TableRow>
              )}
              {services.map(service => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell>${service.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(service.status)}>{service.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/admin/services/edit/${service.id}`} aria-label={`Edit ${service.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="hover:text-destructive" aria-label={`Delete ${service.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service
                            "{service.name}". (This is a simulation).
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteService(service.id, service.name)}>
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
