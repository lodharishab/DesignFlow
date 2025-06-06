
"use client";

import { useState, type ReactElement, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Briefcase, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  IndianRupee, // Replaced DollarSign
  Tag, 
  Activity, 
  ChevronDown,
  CheckCircle2,
  ArchiveIcon
} from 'lucide-react';
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
  const [services, setServices] = useState<AdminService[]>(initialServicesData);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch services from an API
    // For now, we ensure initialServicesData is loaded if services array becomes empty due to previous state
    if(services.length === 0 && initialServicesData.length > 0) {
      setServices(initialServicesData);
    }
  }, [services]);


  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedServiceIds(new Set(services.map(service => service.id)));
    } else {
      setSelectedServiceIds(new Set());
    }
  };

  const handleSelectOne = (serviceId: string, checked: boolean | 'indeterminate') => {
    setSelectedServiceIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (checked === true) {
        newSelected.add(serviceId);
      } else {
        newSelected.delete(serviceId);
      }
      return newSelected;
    });
  };
  
  const isAllSelected = useMemo(() => {
    return services.length > 0 && selectedServiceIds.size === services.length;
  }, [services, selectedServiceIds]);

  const isIndeterminate = useMemo(() => {
    return selectedServiceIds.size > 0 && selectedServiceIds.size < services.length;
  }, [services, selectedServiceIds]);


  const handleDeleteService = (serviceId: string, serviceName: string) => {
    setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
    setSelectedServiceIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      newSelected.delete(serviceId);
      return newSelected;
    });
    toast({
      title: "Service Deleted (Simulated)",
      description: `Service "${serviceName}" has been removed.`,
      variant: "destructive",
      duration: 3000,
    });
  };

  const handleBulkDelete = () => {
    const selectedCount = selectedServiceIds.size;
    setServices(prevServices => prevServices.filter(service => !selectedServiceIds.has(service.id)));
    setSelectedServiceIds(new Set());
    toast({
      title: "Bulk Delete (Simulated)",
      description: `${selectedCount} service(s) have been removed.`,
      variant: "destructive",
      duration: 3000,
    });
  };

  const handleBulkStatusChange = (status: 'Active' | 'Archived') => {
    const selectedCount = selectedServiceIds.size;
    // In a real app, you'd update these on the backend
    setServices(prevServices => 
      prevServices.map(service => 
        selectedServiceIds.has(service.id) ? { ...service, status: status } : service
      )
    );
    setSelectedServiceIds(new Set());
    toast({
      title: `Bulk Status Change (Simulated)`,
      description: `${selectedCount} service(s) have been set to "${status}".`,
      duration: 3000,
    });
  };


  const getStatusBadgeVariant = (status: AdminService['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
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
          {selectedServiceIds.size > 0 && (
            <div className="mb-4 p-3 bg-secondary/50 rounded-md flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedServiceIds.size} service{selectedServiceIds.size > 1 ? 's' : ''} selected
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Apply to selected</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Active')} className="text-green-600 dark:text-green-500">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Activate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Archived')} className="text-yellow-600 dark:text-yellow-500">
                    <ArchiveIcon className="mr-2 h-4 w-4" /> Archive Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedServiceIds.size} selected service(s)? This action cannot be undone. (Simulated)
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isIndeterminate ? "indeterminate" : isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                    disabled={services.length === 0}
                  />
                </TableHead>
                <TableHead className="w-[250px]">Service Name</TableHead>
                <TableHead><Tag className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Category</TableHead>
                <TableHead><IndianRupee className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Price</TableHead>
                <TableHead><Activity className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Status</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No services found.
                  </TableCell>
                </TableRow>
              )}
              {services.map(service => (
                <TableRow 
                  key={service.id}
                  data-state={selectedServiceIds.has(service.id) ? "selected" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedServiceIds.has(service.id)}
                      onCheckedChange={(checked) => handleSelectOne(service.id, checked)}
                      aria-label={`Select row for ${service.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell>₹{service.price.toFixed(2)}</TableCell>
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
                          <AlertDialogAction onClick={() => handleDeleteService(service.id, service.name)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
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

