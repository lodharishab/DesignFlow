
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
  IndianRupee,
  Tag, 
  Activity, 
  ChevronDown,
  CheckCircle2,
  ArchiveIcon,
  Eye // Added for view details
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
  generalDescription: string; // For brief display on list
  status: 'Active' | 'Draft' | 'Archived';
  imageUrl?: string;
  imageAiHint?: string;
  tiers: ServiceTierAdmin[];
}

const initialServicesData: AdminServiceModified[] = [
  { 
    id: 'svc001', 
    name: 'Modern Logo Design', 
    category: 'Logo Design', 
    generalDescription: 'High-quality, modern logo designs tailored to your brand.',
    status: 'Active', 
    imageUrl: 'https://placehold.co/600x400.png', 
    imageAiHint: 'logo design',
    tiers: [
      { id: 'tier1_1', name: 'Basic', price: 99, description: '1 Concept...', deliveryTime: '3-5 days' },
      { id: 'tier1_2', name: 'Standard', price: 199, description: '3 Concepts...', deliveryTime: '5-7 days' },
      { id: 'tier1_3', name: 'Premium', price: 299, description: '5 Concepts...', deliveryTime: '7-10 days' },
    ]
  },
  { 
    id: 'svc002', 
    name: 'Social Media Post Pack', 
    category: 'Social Media', 
    generalDescription: 'Engaging posts for your social media channels.',
    status: 'Active', 
    imageUrl: 'https://placehold.co/600x400.png', 
    imageAiHint: 'social media',
    tiers: [
      { id: 'tier2_1', name: 'Starter Pack', price: 49, description: '5 posts...', deliveryTime: '2-3 days' },
      { id: 'tier2_2', name: 'Growth Pack', price: 99, description: '10 posts...', deliveryTime: '3-5 days' },
    ]
  },
  { 
    id: 'svc003', 
    name: 'Professional Brochure Design', 
    category: 'Print Design', 
    generalDescription: 'Stunning brochures to showcase your business.',
    status: 'Draft',
    tiers: [
      { id: 'tier3_1', name: 'Standard', price: 249, description: 'Tri-fold...', deliveryTime: '7-10 days' },
    ]
  },
  { 
    id: 'svc004', 
    name: 'UI/UX Web Design Mockup', 
    category: 'UI/UX Design', 
    generalDescription: 'High-fidelity mockup for one key page.',
    status: 'Active',
    tiers: [
      { id: 'tier4_1', name: 'Standard', price: 399, description: '1 Page...', deliveryTime: '10-14 days' },
      { id: 'tier4_2', name: 'Premium', price: 599, description: 'Up to 3 pages...', deliveryTime: '14-21 days' },
    ]
  },
  { 
    id: 'svc005', 
    name: 'Custom Illustration', 
    category: 'Illustration', 
    generalDescription: 'Unique vector or raster illustration.',
    status: 'Archived',
    tiers: [
      { id: 'tier5_1', name: 'Basic', price: 79, description: 'Simple icon...', deliveryTime: '3-5 days' },
      { id: 'tier5_2', name: 'Standard', price: 149, description: 'Detailed char...', deliveryTime: '5-8 days' },
    ]
  },
  { 
    id: 'svc006', 
    name: 'Animated Explainer Video', 
    category: 'Video & Animation', 
    generalDescription: 'Short animated video to explain your product.',
    status: 'Active',
    tiers: [
      { id: 'tier6_1', name: '30 Seconds', price: 599, description: 'Animated video...', deliveryTime: '14-21 days' },
    ]
  },
];

export default function AdminServicesPage(): ReactElement {
  const [services, setServices] = useState<AdminServiceModified[]>(initialServicesData);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching or re-validating data if needed
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
      if (checked === true) newSelected.add(serviceId);
      else newSelected.delete(serviceId);
      return newSelected;
    });
  };
  
  const isAllSelected = useMemo(() => services.length > 0 && selectedServiceIds.size === services.length, [services, selectedServiceIds]);
  const isIndeterminate = useMemo(() => selectedServiceIds.size > 0 && selectedServiceIds.size < services.length, [services, selectedServiceIds]);

  const handleDeleteService = (serviceId: string, serviceName: string) => {
    setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
    setSelectedServiceIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      newSelected.delete(serviceId);
      return newSelected;
    });
    toast({ title: "Service Deleted (Simulated)", description: `Service "${serviceName}" removed.`, variant: "destructive" });
  };

  const handleBulkDelete = () => {
    const count = selectedServiceIds.size;
    setServices(prevServices => prevServices.filter(service => !selectedServiceIds.has(service.id)));
    setSelectedServiceIds(new Set());
    toast({ title: "Bulk Delete (Simulated)", description: `${count} service(s) removed.`, variant: "destructive" });
  };

  const handleBulkStatusChange = (status: 'Active' | 'Archived' | 'Draft') => {
    const count = selectedServiceIds.size;
    setServices(prevServices => 
      prevServices.map(service => 
        selectedServiceIds.has(service.id) ? { ...service, status: status } : service
      )
    );
    setSelectedServiceIds(new Set());
    toast({ title: `Bulk Status Change (Simulated)`, description: `${count} service(s) set to "${status}".` });
  };

  const getStatusBadgeVariant = (status: AdminServiceModified['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Archived': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriceRange = (tiers: ServiceTierAdmin[]): string => {
    if (!tiers || tiers.length === 0) return 'N/A';
    const prices = tiers.map(t => t.price);
    const minPrice = Math.min(...prices);
    if (tiers.length === 1) return `₹${minPrice.toFixed(2)}`;
    const maxPrice = Math.max(...prices);
    return `₹${minPrice.toFixed(2)} - ₹${maxPrice.toFixed(2)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center"><Briefcase className="mr-3 h-8 w-8 text-primary" />Manage Services</h1>
        <Button asChild><Link href="/admin/services/new"><PlusCircle className="mr-2 h-4 w-4" /> Add New Service</Link></Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>View, add, edit, or remove design services. Services can have multiple tiers/variations.</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedServiceIds.size > 0 && (
            <div className="mb-4 p-3 bg-secondary/50 rounded-md flex items-center justify-between">
              <p className="text-sm font-medium">{selectedServiceIds.size} service(s) selected</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline">Bulk Actions <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Apply to selected</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Active')} className="text-green-600 dark:text-green-500"><CheckCircle2 className="mr-2 h-4 w-4" /> Activate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Draft')} className="text-blue-600 dark:text-blue-500"><Activity className="mr-2 h-4 w-4" /> Set to Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Archived')} className="text-yellow-600 dark:text-yellow-500"><ArchiveIcon className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle><AlertDialogDescription>Delete {selectedServiceIds.size} service(s)? (Simulated)</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"><Checkbox checked={isIndeterminate ? "indeterminate" : isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all" disabled={services.length === 0}/></TableHead>
                <TableHead className="w-[250px]">Service Name</TableHead>
                <TableHead><Tag className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Category</TableHead>
                <TableHead><IndianRupee className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Price Range</TableHead>
                <TableHead><Activity className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Status</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 && <TableRow><TableCell colSpan={6} className="text-center h-24">No services found.</TableCell></TableRow>}
              {services.map(service => (
                <TableRow key={service.id} data-state={selectedServiceIds.has(service.id) ? "selected" : ""}>
                  <TableCell><Checkbox checked={selectedServiceIds.has(service.id)} onCheckedChange={(checked) => handleSelectOne(service.id, checked)} aria-label={`Select ${service.name}`} /></TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell><Badge variant="outline">{service.category}</Badge></TableCell>
                  <TableCell>{getPriceRange(service.tiers)}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(service.status)}>{service.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/services/${service.id}`} target="_blank" aria-label={`View ${service.name} on frontend`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/admin/services/edit/${service.id}`} aria-label={`Edit ${service.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="outline" size="icon" className="hover:text-destructive" aria-label={`Delete ${service.name}`}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Delete "{service.name}"? (Simulated)</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteService(service.id, service.name)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
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

    