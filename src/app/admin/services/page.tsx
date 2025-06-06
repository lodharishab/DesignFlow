
"use client";

import { useState, type ReactElement, useEffect, useMemo, Fragment } from 'react';
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
  ChevronUp, 
  CheckCircle2,
  ArchiveIcon,
  Eye,
  Tags as TagsIcon, 
  ListChecks,
  ArrowUpDown,
  ListFilter,
  BookOpenCheck,
  Archive,
  FileSignature
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
import { cn } from '@/lib/utils';

interface TierForList {
  id: string;
  name: string;
  price: number;
  description: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryTimeUnit: 'days' | 'business_days' | 'weeks';
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
  tiers: TierForList[];
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
    tags: ['branding', 'minimalist', 'corporate', 'startup'],
    tiers: [
      { id: 'tier1_1', name: 'Basic', price: 99, description: '1 Initial concept, 2 Rounds of revisions, Basic vector files (SVG, PNG).', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days' },
      { id: 'tier1_2', name: 'Standard', price: 199, description: '3 Initial concepts, 3 Rounds of revisions, Full vector files (AI, EPS, SVG, PNG, JPG), Basic brand guide (colors, fonts).', deliveryTimeMin: 5, deliveryTimeMax: 7, deliveryTimeUnit: 'days' },
      { id: 'tier1_3', name: 'Premium', price: 299, description: '5 Initial concepts, Unlimited revisions, Full vector & source files, Detailed brand guidelines, Social media kit.', deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'days' },
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
    tags: ['instagram', 'facebook', 'content creation'],
    tiers: [
      { id: 'tier2_1', name: 'Starter Pack', price: 49, description: '5 social media posts, 1 Platform choice, 1 Round of revisions.', deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'days' },
      { id: 'tier2_2', name: 'Growth Pack', price: 99, description: '10 social media posts, Up to 2 platforms, 2 Rounds of revisions, Source files.', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days' },
    ]
  },
  { 
    id: 'svc003', 
    name: 'Professional Brochure Design', 
    category: 'Print Design', 
    generalDescription: 'Stunning brochures to showcase your business.',
    status: 'Draft',
    tags: ['marketing collateral', 'print', 'corporate'],
    tiers: [
      { id: 'tier3_1', name: 'Standard', price: 249, description: 'Tri-fold or bi-fold options, print-ready files.', deliveryTimeMin: 7, deliveryTimeMax: 10, deliveryTimeUnit: 'business_days' },
    ]
  },
  { 
    id: 'svc004', 
    name: 'UI/UX Web Design Mockup', 
    category: 'UI/UX Design', 
    generalDescription: 'High-fidelity mockup for one key page.',
    status: 'Active',
    tags: ['website', 'app design', 'user experience'],
    tiers: [
      { id: 'tier4_1', name: 'Standard', price: 399, description: '1 Page, desktop and mobile views.', deliveryTimeMin: 10, deliveryTimeMax: 14, deliveryTimeUnit: 'days' },
      { id: 'tier4_2', name: 'Premium', price: 599, description: 'Up to 3 pages, interactive prototype.', deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'weeks' },
    ]
  },
  { 
    id: 'svc005', 
    name: 'Custom Illustration', 
    category: 'Illustration', 
    generalDescription: 'Unique vector or raster illustration.',
    status: 'Archived',
    tags: ['art', 'vector', 'character design'],
    tiers: [
      { id: 'tier5_1', name: 'Basic', price: 79, description: 'Simple icon or spot illustration.', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days' },
      { id: 'tier5_2', name: 'Standard', price: 149, description: 'Detailed character or small scene.', deliveryTimeMin: 5, deliveryTimeMax: 8, deliveryTimeUnit: 'days' },
    ]
  },
  { 
    id: 'svc006', 
    name: 'Animated Explainer Video', 
    category: 'Video & Animation', 
    generalDescription: 'Short animated video to explain your product.',
    status: 'Active',
    tags: ['2d animation', 'explainer', 'marketing video'],
    tiers: [
      { id: 'tier6_1', name: '30 Seconds', price: 599, description: 'Includes scriptwriting and voiceover.', deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'weeks' },
    ]
  },
];

type ServiceStatusFilter = 'All' | AdminServiceModified['status'];
const statusFilters: { label: string; value: ServiceStatusFilter; icon: React.ElementType }[] = [
  { label: 'All Services', value: 'All', icon: ListFilter },
  { label: 'Active', value: 'Active', icon: BookOpenCheck },
  { label: 'Draft', value: 'Draft', icon: FileSignature },
  { label: 'Archived', value: 'Archived', icon: Archive },
];

type SortableServiceKeys = 'name' | 'category' | 'status' | 'priceRange'; // 'priceRange' needs special handling

function formatStructuredDeliveryTime(min: number, max: number, unit: TierForList['deliveryTimeUnit']): string {
  const unitLabel = unit.replace('_', ' ');
  if (min === max) {
    return `${min} ${unitLabel}${min > 1 && unit !== 'weeks' ? 's' : (unit === 'weeks' && min === 1 ? '' : 's')}`;
  }
  return `${min}-${max} ${unitLabel}${max > 1 && unit !== 'weeks' ? 's' : (unit === 'weeks' && max === 1 ? '' : 's')}`;
}

export default function AdminServicesPage(): ReactElement {
  const [services, setServices] = useState<AdminServiceModified[]>(initialServicesData);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const [expandedServiceIds, setExpandedServiceIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<ServiceStatusFilter>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortableServiceKeys | null; direction: 'ascending' | 'descending' }>({
    key: 'name',
    direction: 'ascending',
  });
  const { toast } = useToast();

  useEffect(() => {
    if(services.length === 0 && initialServicesData.length > 0) {
      setServices(initialServicesData);
    }
  }, [services]);

  const getPriceRangeValue = (tiers: TierForList[]): number => {
    if (!tiers || tiers.length === 0) return 0;
    return Math.min(...tiers.map(t => t.price)); // Sort by min price for range
  };

  const displayedServices = useMemo(() => {
    let filteredServices = [...services];

    if (statusFilter !== 'All') {
      filteredServices = filteredServices.filter(service => service.status === statusFilter);
    }

    if (sortConfig.key) {
      filteredServices.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'priceRange') {
          valA = getPriceRangeValue(a.tiers);
          valB = getPriceRangeValue(b.tiers);
        } else {
          valA = a[sortConfig.key!];
          valB = b[sortConfig.key!];
        }

        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
          comparison = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
        }
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }
    return filteredServices;
  }, [services, statusFilter, sortConfig]);

  const requestSort = (key: SortableServiceKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortableServiceKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="ml-1 h-4 w-4" /> :
      <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedServiceIds(new Set(displayedServices.map(service => service.id)));
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
  
  const isAllDisplayedSelected = useMemo(() => {
    return displayedServices.length > 0 && selectedServiceIds.size === displayedServices.length && displayedServices.every(d => selectedServiceIds.has(d.id));
  }, [displayedServices, selectedServiceIds]);

  const isIndeterminate = useMemo(() => {
    const displayedSelectedCount = displayedServices.filter(d => selectedServiceIds.has(d.id)).length;
    return displayedSelectedCount > 0 && displayedSelectedCount < displayedServices.length;
  }, [displayedServices, selectedServiceIds]);

  const handleDeleteService = (serviceId: string, serviceName: string) => {
    setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
    setSelectedServiceIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      newSelected.delete(serviceId);
      return newSelected;
    });
    setExpandedServiceIds(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      newExpanded.delete(serviceId);
      return newExpanded;
    });
    toast({ title: "Service Deleted (Simulated)", description: `Service "${serviceName}" removed.`, variant: "destructive" });
  };

  const handleBulkDelete = () => {
    const count = selectedServiceIds.size;
    setServices(prevServices => prevServices.filter(service => !selectedServiceIds.has(service.id)));
    const newExpanded = new Set(expandedServiceIds);
    selectedServiceIds.forEach(id => newExpanded.delete(id));
    setExpandedServiceIds(newExpanded);
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

  const toggleExpandService = (serviceId: string) => {
    setExpandedServiceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) newSet.delete(serviceId);
      else newSet.add(serviceId);
      return newSet;
    });
  };

  const getStatusBadgeVariant = (status: AdminServiceModified['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Archived': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriceRange = (tiers: TierForList[]): string => {
    if (!tiers || tiers.length === 0) return 'N/A';
    const prices = tiers.map(t => t.price);
    const minPrice = Math.min(...prices);
    if (tiers.length === 1) return `₹${minPrice.toFixed(2)}`;
    const maxPrice = Math.max(...prices);
    return `₹${minPrice.toFixed(2)} - ₹${maxPrice.toFixed(2)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center"><Briefcase className="mr-3 h-8 w-8 text-primary" />Manage Services</h1>
        <Button asChild><Link href="/admin/services/new"><PlusCircle className="mr-2 h-4 w-4" /> Add New Service</Link></Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>View, add, edit, or remove design services. Services can have multiple tiers/variations.</CardDescription>
           <div className="pt-4 flex flex-wrap gap-2">
            {statusFilters.map(filter => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                onClick={() => setStatusFilter(filter.value)}
                size="sm"
              >
                <filter.icon className="mr-2 h-4 w-4" />
                {filter.label}
              </Button>
            ))}
          </div>
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
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Draft')} className="text-blue-600 dark:text-blue-500"><FileSignature className="mr-2 h-4 w-4" /> Set to Draft</DropdownMenuItem>
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
                <TableHead className="w-[50px]"><Checkbox checked={isIndeterminate ? "indeterminate" : isAllDisplayedSelected} onCheckedChange={handleSelectAll} aria-label="Select all" disabled={displayedServices.length === 0}/></TableHead>
                <TableHead className="w-[280px]">
                  <Button variant="ghost" onClick={() => requestSort('name')} className="px-1 text-xs sm:text-sm -ml-2">
                    Service Name {getSortIndicator('name')}
                  </Button>
                </TableHead>
                <TableHead>
                   <Button variant="ghost" onClick={() => requestSort('category')} className="px-1 text-xs sm:text-sm -ml-2">
                    <Tag className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Category {getSortIndicator('category')}
                  </Button>
                </TableHead>
                <TableHead><TagsIcon className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Tags</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('priceRange')} className="px-1 text-xs sm:text-sm -ml-2">
                    <IndianRupee className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Price Range {getSortIndicator('priceRange')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('status')} className="px-1 text-xs sm:text-sm -ml-2">
                    <Activity className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Status {getSortIndicator('status')}
                  </Button>
                </TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedServices.length === 0 && <TableRow><TableCell colSpan={7} className="text-center h-24">No services match filters.</TableCell></TableRow>}
              {displayedServices.map(service => (
                <Fragment key={service.id}>
                <TableRow data-state={selectedServiceIds.has(service.id) ? "selected" : ""}>
                  <TableCell><Checkbox checked={selectedServiceIds.has(service.id)} onCheckedChange={(checked) => handleSelectOne(service.id, checked)} aria-label={`Select ${service.name}`} /></TableCell>
                  <TableCell className="font-medium">
                     <div className="flex items-center">
                        <span>{service.name}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandService(service.id)}
                            aria-label={expandedServiceIds.has(service.id) ? "Collapse tiers" : "Expand tiers"}
                            className="ml-2 p-1 h-auto"
                        >
                            {expandedServiceIds.has(service.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{service.category}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(service.tags || []).slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {(service.tags || []).length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{ (service.tags || []).length - 2} more</Badge>
                      )}
                       {(service.tags || []).length === 0 && (
                        <span className="text-xs text-muted-foreground italic">No tags</span>
                      )}
                    </div>
                  </TableCell>
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
                {expandedServiceIds.has(service.id) && (
                    <TableRow className="bg-secondary/30 hover:bg-secondary/40">
                        <TableCell colSpan={7} className="p-0">
                            <div className="p-4 space-y-3">
                                <h4 className="font-semibold text-sm flex items-center">
                                    <ListChecks className="h-4 w-4 mr-2 text-primary" />
                                    Tiers for: <span className="italic mx-1">{service.name}</span>
                                </h4>
                                {service.tiers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {service.tiers.map(tier => (
                                        <Card key={tier.id} className="bg-card/70 shadow-sm">
                                            <CardHeader className="pb-2 pt-3 px-3">
                                                <CardTitle className="text-sm font-medium flex justify-between items-center">
                                                    <span>{tier.name}</span>
                                                    <Badge variant="default" className="text-xs">₹{tier.price.toFixed(2)}</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="px-3 pb-3 text-xs space-y-1">
                                                <p className="text-muted-foreground truncate" title={tier.description}>
                                                    {tier.description.substring(0, 60)}{tier.description.length > 60 ? '...' : ''}
                                                </p>
                                                <p className="text-muted-foreground">
                                                   Delivery: {formatStructuredDeliveryTime(tier.deliveryTimeMin, tier.deliveryTimeMax, tier.deliveryTimeUnit)}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">No tiers defined for this service.</p>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
