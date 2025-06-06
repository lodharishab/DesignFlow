
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, XCircle, Briefcase, IndianRupee, Tag, FileText, ClockIcon, ImageIcon, Lightbulb, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

interface ServiceTierAdmin {
  id: string; // Can be a temporary ID for new tiers before saving
  name: string;
  price: number;
  description: string;
  deliveryTime: string;
}

interface AdminServiceModified {
  id: string;
  name: string;
  category: string;
  generalDescription: string;
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
    generalDescription: 'High-quality, modern logo designs tailored to your brand. We offer various packages to suit your needs.',
    status: 'Active', 
    imageUrl: 'https://placehold.co/600x400.png', 
    imageAiHint: 'logo design',
    tiers: [
      { id: 'tier1_1', name: 'Basic', price: 99, description: '1 Initial concept, 2 Rounds of revisions, Basic vector files (SVG, PNG).', deliveryTime: '3-5 days' },
      { id: 'tier1_2', name: 'Standard', price: 199, description: '3 Initial concepts, 3 Rounds of revisions, Full vector files (AI, EPS, SVG, PNG, JPG), Basic brand guide (colors, fonts).', deliveryTime: '5-7 days' },
      { id: 'tier1_3', name: 'Premium', price: 299, description: '5 Initial concepts, Unlimited revisions, Full vector & source files, Detailed brand guidelines, Social media kit.', deliveryTime: '7-10 days' },
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
    tiers: [
      { id: 'tier2_1', name: 'Starter Pack', price: 49, description: '5 social media posts, 1 Platform choice, 1 Round of revisions.', deliveryTime: '2-3 days' },
      { id: 'tier2_2', name: 'Growth Pack', price: 99, description: '10 social media posts, Up to 2 platforms, 2 Rounds of revisions, Source files.', deliveryTime: '3-5 days' },
    ]
  },
  // Add more services with tiers as needed
];

const serviceCategories = [
  { id: 'cat001', name: 'Logo Design' },
  { id: 'cat002', name: 'Web UI/UX' },
  { id: 'cat003', name: 'Print Materials' },
  { id: 'cat004', name: 'Custom Illustrations' },
  { id: 'cat005', name: 'Social Media Graphics' },
  { id: 'cat006', name: 'Video & Animation' },
  { id: 'cat007', name: 'Print Design' }, // Ensure this matches categories in initialServicesData
  { id: 'cat008', name: 'Social Media' }, // Ensure this matches categories in initialServicesData
  { id: 'cat009', name: 'UI/UX Design' }, // Ensure this matches categories in initialServicesData
  { id: 'cat010', name: 'Illustration' }, // Ensure this matches categories in initialServicesData
  { id: 'cat011', name: 'Packaging' }, // Ensure this matches categories in initialServicesData
];

const serviceStatuses = ['Active', 'Draft', 'Archived'];

export default function AdminEditServicePage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<AdminServiceModified | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for general service details
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [generalDescription, setGeneralDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Archived'>('Draft');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAiHint, setImageAiHint] = useState('');
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
        setTiers(foundService.tiers.map(t => ({...t, price: Number(t.price)}))); // Ensure price is number
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

  const handleTierChange = (index: number, field: keyof ServiceTierAdmin, value: string | number) => {
    const newTiers = [...tiers];
    if (field === 'price' && typeof value === 'string') {
        newTiers[index] = { ...newTiers[index], [field]: parseFloat(value) || 0 };
    } else {
        newTiers[index] = { ...newTiers[index], [field]: value };
    }
    setTiers(newTiers);
  };

  const addTier = () => {
    setTiers([...tiers, { id: `new_${Date.now()}`, name: '', price: 0, description: '', deliveryTime: '' }]);
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
    if (tiers.some(t => !t.name.trim() || t.price <= 0 || !t.description.trim() || !t.deliveryTime.trim())) {
      toast({ title: "Error", description: "Please complete all fields for each tier, ensuring price is positive.", variant: "destructive" });
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
      tiers
    };
    console.log("Saving updated service:", updatedService);
    
    setTimeout(() => {
      toast({ title: "Service Updated (Simulated)", description: `Service "${serviceName}" has been successfully updated.` });
      setIsSaving(false);
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
              <Input id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} disabled={isSaving} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category"><Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Category*</Label>
              <Select value={category} onValueChange={(value) => setCategory(value)} disabled={isSaving}>
                <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{serviceCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="generalDescription">General Description (for service page)*</Label>
            <Textarea id="generalDescription" value={generalDescription} onChange={(e) => setGeneralDescription(e.target.value)} rows={4} disabled={isSaving} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="imageUrl"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Image URL</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={isSaving} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="imageAiHint"><Lightbulb className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Image AI Hint</Label>
              <Input id="imageAiHint" value={imageAiHint} onChange={(e) => setImageAiHint(e.target.value)} disabled={isSaving} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status*</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as 'Active' | 'Draft' | 'Archived')} disabled={isSaving}>
              <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>{serviceStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
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
                disabled={isSaving || tiers.length <= 1}
                aria-label="Remove tier"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold text-primary">Tier {index + 1}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`tierName-${index}`}>Tier Name* (e.g., Basic, Standard)</Label>
                  <Input id={`tierName-${index}`} value={tier.name} onChange={(e) => handleTierChange(index, 'name', e.target.value)} disabled={isSaving} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`tierPrice-${index}`}><IndianRupee className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Price (INR)*</Label>
                  <Input id={`tierPrice-${index}`} type="number" value={tier.price.toString()} onChange={(e) => handleTierChange(index, 'price', e.target.value)} disabled={isSaving} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`tierDescription-${index}`}>Tier Description/Scope*</Label>
                <Textarea id={`tierDescription-${index}`} value={tier.description} onChange={(e) => handleTierChange(index, 'description', e.target.value)} rows={3} disabled={isSaving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`tierDeliveryTime-${index}`}><ClockIcon className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Delivery Time*</Label>
                <Input id={`tierDeliveryTime-${index}`} value={tier.deliveryTime} onChange={(e) => handleTierChange(index, 'deliveryTime', e.target.value)} disabled={isSaving} />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addTier} disabled={isSaving}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Another Tier
          </Button>
        </CardContent>
      </Card>

      <CardFooter className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" asChild disabled={isSaving}>
          <Link href="/admin/services"><XCircle className="mr-2 h-4 w-4" />Cancel</Link>
        </Button>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </CardFooter>
    </div>
  );
}

    