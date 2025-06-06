
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, XCircle, Briefcase, IndianRupee, Tag, FileText, ClockIcon, ImageIcon, Lightbulb, Loader2, PlusCircle, Trash2, Tags, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
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
  tiers: ServiceTierAdmin[];
}

const initialServicesData: AdminServiceModified[] = [
  { 
    id: 'svc001', 
    name: 'Modern Logo Design', 
    category: 'Logo Design', 
    generalDescription: 'High-quality, modern logo designs tailored to your brand. We offer various packages to suit your needs.',
    status: 'Active', 
    imageUrl: 'https://placehold.co/600x400.png', 
    imageAiHint: 'logo design',
    tags: ['branding', 'minimalist', 'corporate'],
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
    generalDescription: 'Engaging posts designed for your social media channels. Choose the pack size that fits your campaign.',
    status: 'Active', 
    imageUrl: 'https://placehold.co/600x400.png', 
    imageAiHint: 'social media',
    tags: ['instagram', 'facebook', 'marketing'],
    tiers: [
      { id: 'tier2_1', name: 'Starter Pack', price: 49, description: '5 social media posts, 1 Platform choice, 1 Round of revisions.', deliveryTimeMin: 2, deliveryTimeMax: 3, deliveryTimeUnit: 'days' },
      { id: 'tier2_2', name: 'Growth Pack', price: 99, description: '10 social media posts, Up to 2 platforms, 2 Rounds of revisions, Source files.', deliveryTimeMin: 3, deliveryTimeMax: 5, deliveryTimeUnit: 'days' },
    ]
  },
];

const serviceCategories = [
  { id: 'cat001', name: 'Logo Design' },
  { id: 'cat002', name: 'Web UI/UX' },
  { id: 'cat003', name: 'Print Materials' },
  { id: 'cat004', name: 'Custom Illustrations' },
  { id: 'cat005', name: 'Social Media Graphics' },
  { id: 'cat006', name: 'Video & Animation' },
  { id: 'cat007', name: 'Print Design' },
  { id: 'cat008', name: 'Social Media' },
  { id: 'cat009', name: 'UI/UX Design' },
  { id: 'cat010', name: 'Illustration' },
  { id: 'cat011', name: 'Packaging' },
];

const serviceStatuses: AdminServiceModified['status'][] = ['Active', 'Draft', 'Archived'];
const deliveryTimeUnits: { value: ServiceTierAdmin['deliveryTimeUnit']; label: string }[] = [
  { value: 'days', label: 'Days' },
  { value: 'business_days', label: 'Business Days' },
  { value: 'weeks', label: 'Weeks' },
];

export default function AdminEditServicePage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<AdminServiceModified | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state for general service details
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [generalDescription, setGeneralDescription] = useState('');
  const [status, setStatus] = useState<AdminServiceModified['status']>('Draft');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAiHint, setImageAiHint] = useState('');
  
  // Tags management
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [tagsArray, setTagsArray] = useState<string[]>([]);

  const [tiers, setTiers] = useState<ServiceTierAdmin[]>([]);

  useEffect(() => {
    if (serviceId) {
      setIsLoading(true);
      const foundService = initialServicesData.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
        setServiceName(foundService.name);
        setCategory(foundService.category);
        setGeneralDescription(foundService.generalDescription || '');
        setStatus(foundService.status);
        setImageUrl(foundService.imageUrl || '');
        setImageAiHint(foundService.imageAiHint || '');
        setTagsArray(foundService.tags || []);
        setTiers(foundService.tiers.map(t => ({
          ...t, 
          price: Number(t.price), 
          deliveryTimeMin: Number(t.deliveryTimeMin) || 1, 
          deliveryTimeMax: Number(t.deliveryTimeMax) || 1,
          deliveryTimeUnit: t.deliveryTimeUnit || 'days'
        })));
      } else {
        toast({
          title: "Error",
          description: "Service not found.",
          variant: "destructive",
        });
        router.push('/admin/services');
      }
      setIsLoading(false);
    }
  }, [serviceId, router, toast]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTagInput(e.target.value);
  };

  const addTagFromInput = () => {
    const newTag = currentTagInput.trim();
    if (newTag && !tagsArray.includes(newTag)) {
      setTagsArray([...tagsArray, newTag]);
    }
    setCurrentTagInput(''); 
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      addTagFromInput();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsArray(tagsArray.filter(tag => tag !== tagToRemove));
  };

  const handleTierChange = (index: number, field: keyof ServiceTierAdmin, value: string | number) => {
    const newTiers = [...tiers];
    const currentTier = newTiers[index];

    if (field === 'price' || field === 'deliveryTimeMin' || field === 'deliveryTimeMax') {
      currentTier[field as 'price' | 'deliveryTimeMin' | 'deliveryTimeMax'] = parseFloat(value as string) || 0;
    } else if (field === 'deliveryTimeUnit') {
      currentTier[field] = value as ServiceTierAdmin['deliveryTimeUnit'];
    }
     else {
      currentTier[field as 'name' | 'description' | 'id'] = value as string;
    }
    setTiers(newTiers);
  };

  const addTier = () => {
    setTiers([...tiers, { id: `new_${Date.now()}`, name: '', price: 0, description: '', deliveryTimeMin: 1, deliveryTimeMax: 1, deliveryTimeUnit: 'days' }]);
  };

  const removeTier = (index: number) => {
    if (tiers.length <= 1) {
      toast({ title: "Cannot Remove", description: "A service must have at least one tier.", variant: "destructive"});
      return;
    }
    const newTiers = tiers.filter((_, i) => i !== index);
    setTiers(newTiers);
  };

  const handleSaveChanges = () => {
    if (!serviceName.trim() || !category || !generalDescription.trim() || !status) {
      toast({ title: "Error", description: "Please fill in all general service details.", variant: "destructive" });
      return;
    }
    if (tiers.some(t => !t.name.trim() || t.price <= 0 || !t.description.trim() || t.deliveryTimeMin <= 0 || t.deliveryTimeMax <= 0 || t.deliveryTimeMin > t.deliveryTimeMax || !t.deliveryTimeUnit )) {
      toast({ title: "Error", description: "Please complete all fields for each tier. Ensure price and delivery times are positive, and min delivery time is not greater than max.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const updatedService: AdminServiceModified = { 
      id: serviceId,
      name: serviceName, 
      category, 
      generalDescription,
      status,
      imageUrl,
      imageAiHint,
      tags: tagsArray,
      tiers
    };
    console.log("Saving updated service:", updatedService);
    
    setTimeout(() => {
      toast({ title: "Service Updated (Simulated)", description: `Service "${serviceName}" has been successfully updated.` });
      setIsSaving(false);
      router.push('/admin/services');
    }, 1000);
  };

  const handleDeleteService = () => {
    setIsDeleting(true);
    // Simulate API call for deletion
    console.log("Deleting service:", serviceId, serviceName);
    setTimeout(() => {
      toast({
        title: "Service Deleted (Simulated)",
        description: `Service "${serviceName}" has been deleted.`,
        variant: "destructive",
      });
      setIsDeleting(false);
      router.push('/admin/services');
    }, 1000);
  };


  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2 text-muted-foreground">Loading...</p></div>;
  }
  if (!service) return <p>Service not found.</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center"><Briefcase className="mr-3 h-8 w-8 text-primary" />Edit Service</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>General Service Details</CardTitle>
          <CardDescription>Modify the core information for the service: {service.name}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serviceName"><FileText className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Service Name*</Label>
              <Input id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} disabled={isSaving || isDeleting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category"><Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Category*</Label>
              <Select value={category} onValueChange={(value) => setCategory(value)} disabled={isSaving || isDeleting}>
                <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{serviceCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="generalDescription">General Description (for service page)*</Label>
            <Textarea id="generalDescription" value={generalDescription} onChange={(e) => setGeneralDescription(e.target.value)} rows={4} disabled={isSaving || isDeleting} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="imageUrl"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Image URL</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={isSaving || isDeleting} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="imageAiHint"><Lightbulb className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Image AI Hint</Label>
              <Input id="imageAiHint" value={imageAiHint} onChange={(e) => setImageAiHint(e.target.value)} disabled={isSaving || isDeleting} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as AdminServiceModified['status'])} disabled={isSaving || isDeleting}>
                <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>{serviceStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagInput"><Tags className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Tags</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="tagInput" 
                  placeholder="Add a tag and press Enter" 
                  value={currentTagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  disabled={isSaving || isDeleting}
                  className="flex-grow"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2 min-h-[2.5rem]">
                {tagsArray.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 pr-1 py-0.5">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-full hover:bg-muted-foreground/20 p-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
                      aria-label={`Remove tag ${tag}`}
                      disabled={isSaving || isDeleting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {tagsArray.length === 0 && !currentTagInput && (
                  <p className="text-xs text-muted-foreground py-1">No tags added yet.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Service Tiers</CardTitle>
          <CardDescription>Define different variations or packages for this service.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tiers.map((tier, index) => (
            <div key={tier.id} className="p-4 border rounded-md space-y-4 relative bg-secondary/30">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                onClick={() => removeTier(index)}
                disabled={isSaving || isDeleting || tiers.length <= 1}
                aria-label="Remove tier"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold text-primary">Tier {index + 1}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`tierName-${index}`}>Tier Name* (e.g., Basic, Standard)</Label>
                  <Input id={`tierName-${index}`} value={tier.name} onChange={(e) => handleTierChange(index, 'name', e.target.value)} disabled={isSaving || isDeleting} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`tierPrice-${index}`}><IndianRupee className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Price (INR)*</Label>
                  <Input id={`tierPrice-${index}`} type="number" value={tier.price.toString()} onChange={(e) => handleTierChange(index, 'price', e.target.value)} disabled={isSaving || isDeleting} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`tierDescription-${index}`}>Tier Description/Scope*</Label>
                <Textarea id={`tierDescription-${index}`} value={tier.description} onChange={(e) => handleTierChange(index, 'description', e.target.value)} rows={3} disabled={isSaving || isDeleting} />
              </div>
              <div className="space-y-2">
                <Label><ClockIcon className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Delivery Time*</Label>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-end">
                    <div className="space-y-1">
                        <Label htmlFor={`tierDeliveryTimeMin-${index}`} className="text-xs">Min Value</Label>
                        <Input id={`tierDeliveryTimeMin-${index}`} type="number" value={tier.deliveryTimeMin.toString()} onChange={(e) => handleTierChange(index, 'deliveryTimeMin', e.target.value)} disabled={isSaving || isDeleting} placeholder="e.g., 3"/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`tierDeliveryTimeMax-${index}`} className="text-xs">Max Value</Label>
                        <Input id={`tierDeliveryTimeMax-${index}`} type="number" value={tier.deliveryTimeMax.toString()} onChange={(e) => handleTierChange(index, 'deliveryTimeMax', e.target.value)} disabled={isSaving || isDeleting} placeholder="e.g., 5"/>
                    </div>
                    <div className="space-y-1 md:col-span-1">
                         <Label htmlFor={`tierDeliveryTimeUnit-${index}`} className="text-xs">Unit</Label>
                        <Select value={tier.deliveryTimeUnit} onValueChange={(value) => handleTierChange(index, 'deliveryTimeUnit', value)} disabled={isSaving || isDeleting}>
                            <SelectTrigger id={`tierDeliveryTimeUnit-${index}`}><SelectValue placeholder="Unit" /></SelectTrigger>
                            <SelectContent>{deliveryTimeUnits.map(unit => <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addTier} disabled={isSaving || isDeleting}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Another Tier
          </Button>
        </CardContent>
      </Card>

      <CardFooter className="flex justify-between items-center pt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isSaving || isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete Service
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the service "{serviceName}"
                and all of its tiers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteService} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Yes, delete service
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="flex space-x-3">
          <Button variant="outline" asChild disabled={isSaving || isDeleting}>
            <Link href="/admin/services"><XCircle className="mr-2 h-4 w-4" />Cancel</Link>
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving || isDeleting}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </CardFooter>
    </div>
  );
}
