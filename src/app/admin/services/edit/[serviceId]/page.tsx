
"use client";

import { useState, useEffect, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, XCircle, Briefcase, IndianRupee, Tag, FileText, ClockIcon, ImageIcon, Lightbulb, Loader2 } from 'lucide-react'; // Replaced DollarSign
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AdminService {
  id: string;
  name: string;
  category: string;
  price: number;
  shortDescription: string; // Added for edit form
  longDescription: string; // Added for edit form
  deliveryTime: string; // Added for edit form
  status: 'Active' | 'Draft' | 'Archived';
  imageUrl?: string; // Added for edit form
  imageAiHint?: string; // Added for edit form
}

// This data would typically come from a store or API, using the list page's data for simulation
const initialServicesData: AdminService[] = [
  { id: 'svc001', name: 'Modern Logo Design', category: 'Logo Design', price: 199, shortDescription: 'Unique logo for your brand.', longDescription: 'Detailed logo design process.', deliveryTime: '5-7 days', status: 'Active', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'logo design' },
  { id: 'svc002', name: 'Social Media Post Pack', category: 'Social Media', price: 99, shortDescription: 'Engaging social media posts.', longDescription: 'Pack of 10 posts.', deliveryTime: '3-5 days', status: 'Active', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'social media' },
  { id: 'svc003', name: 'Professional Brochure Design', category: 'Print Design', price: 249, shortDescription: 'High-quality brochure.', longDescription: 'Tri-fold brochure design.', deliveryTime: '7-10 days', status: 'Draft', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'brochure design' },
  { id: 'svc004', name: 'UI/UX Web Design Mockup', category: 'UI/UX Design', price: 399, shortDescription: 'Web page mockup.', longDescription: 'User-friendly UI/UX.', deliveryTime: '10-14 days', status: 'Active', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'website mockup' },
  { id: 'svc005', name: 'Custom Illustration', category: 'Illustration', price: 149, shortDescription: 'Unique custom illustration.', longDescription: 'Illustration in any style.', deliveryTime: '4-6 days', status: 'Archived', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'character illustration' },
  { id: 'svc006', name: 'Animated Explainer Video', category: 'Video & Animation', price: 599, shortDescription: 'Short animated video.', longDescription: '30-second explainer.', deliveryTime: '14-21 days', status: 'Active', imageUrl: 'https://placehold.co/600x400.png', imageAiHint: 'explainer video' },
];


// Consistent with categories from /admin/services/categories/page.tsx
const serviceCategories = [
  { id: 'cat001', name: 'Logo Design' },
  { id: 'cat002', name: 'Web UI/UX' },
  { id: 'cat003', name: 'Print Materials' },
  { id: 'cat004', name: 'Custom Illustrations' },
  { id: 'cat005', name: 'Social Media Graphics' },
  { id: 'cat006', name: 'Video & Animation' }, // Added to match initialServicesData
  { id: 'cat007', name: 'Print Design' }, // Added to match initialServicesData
  { id: 'cat008', name: 'Social Media' }, // Added to match initialServicesData
  { id: 'cat009', name: 'UI/UX Design' }, // Added to match initialServicesData
  { id: 'cat010', name: 'Illustration' }, // Added to match initialServicesData
];

const serviceStatuses = ['Active', 'Draft', 'Archived'];

export default function AdminEditServicePage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<AdminService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Archived'>('Draft');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAiHint, setImageAiHint] = useState('');

  useEffect(() => {
    if (serviceId) {
      setIsLoading(true);
      // Simulate fetching service data
      const foundService = initialServicesData.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
        setServiceName(foundService.name);
        setCategory(foundService.category);
        setPrice(foundService.price.toString());
        setShortDescription(foundService.shortDescription || '');
        setLongDescription(foundService.longDescription || '');
        setDeliveryTime(foundService.deliveryTime || '');
        setStatus(foundService.status);
        setImageUrl(foundService.imageUrl || '');
        setImageAiHint(foundService.imageAiHint || '');
      } else {
        toast({
          title: "Error",
          description: "Service not found.",
          variant: "destructive",
          duration: 3000,
        });
        router.push('/admin/services');
      }
      setIsLoading(false);
    }
  }, [serviceId, router, toast]);

  const handleSaveChanges = () => {
    if (!serviceName.trim() || !category || !price || !shortDescription.trim() || !status) {
      toast({
        title: "Error",
        description: "Please fill in all required fields: Name, Category, Price, Short Description, and Status.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }
     if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      toast({
        title: "Error",
        description: "Price must be a valid positive number.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    const updatedService = { 
      id: serviceId,
      name: serviceName, 
      category, 
      price: parseFloat(price), 
      shortDescription, 
      longDescription, 
      deliveryTime, 
      status,
      imageUrl,
      imageAiHint
    };
    console.log("Saving updated service:", updatedService);
    
    setTimeout(() => {
      toast({
        title: "Service Updated (Simulated)",
        description: `Service "${serviceName}" has been successfully updated.`,
        duration: 3000,
      });
      setIsSaving(false);
      router.push('/admin/services');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return <p>Service not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Edit Service
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Update Service: {service.name}</CardTitle>
          <CardDescription>Modify the details for this service.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serviceName"><FileText className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Service Name*</Label>
              <Input 
                id="serviceName" 
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category"><Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Category*</Label>
              <Select value={category} onValueChange={(value) => setCategory(value)} disabled={isSaving}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price"><IndianRupee className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Price (INR)*</Label>
              <Input 
                id="price" 
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryTime"><ClockIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Estimated Delivery Time</Label>
              <Input 
                id="deliveryTime" 
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description (for cards)*</Label>
            <Textarea 
              id="shortDescription" 
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={3}
              maxLength={160} 
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Full Description (for service page)</Label>
            <Textarea 
              id="longDescription" 
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={6}
              disabled={isSaving}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="imageUrl"><ImageIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Image URL</Label>
              <Input 
                id="imageUrl" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isSaving}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="imageAiHint"><Lightbulb className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Image AI Hint</Label>
              <Input 
                id="imageAiHint" 
                value={imageAiHint}
                onChange={(e) => setImageAiHint(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status*</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as 'Active' | 'Draft' | 'Archived')} disabled={isSaving}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {serviceStatuses.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          <Button variant="outline" asChild disabled={isSaving}>
            <Link href="/admin/services">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
