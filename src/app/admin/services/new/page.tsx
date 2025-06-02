
"use client";

import { useState, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, XCircle, Briefcase, IndianRupee, Tag, FileText, ClockIcon, ImageIcon, Lightbulb, Loader2 } from 'lucide-react'; // Added ClockIcon, ImageIcon, Lightbulb, Loader2, Replaced DollarSign
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

// Consistent with categories from /admin/services/categories/page.tsx
const serviceCategories = [
  { id: 'cat001', name: 'Logo Design' },
  { id: 'cat002', name: 'Web UI/UX' },
  { id: 'cat003', name: 'Print Materials' },
  { id: 'cat004', name: 'Custom Illustrations' },
  { id: 'cat005', name: 'Social Media Graphics' },
];

const serviceStatuses = ['Active', 'Draft', 'Archived'];

export default function AdminAddServicePage(): ReactElement {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [status, setStatus] = useState('Draft');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAiHint, setImageAiHint] = useState('');

  const handleSaveService = () => {
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
    // Simulate saving the service
    const newService = { 
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
    console.log("Saving new service:", newService);

    // Simulate API delay
    setTimeout(() => {
      toast({
        title: "Service Added (Simulated)",
        description: `Service "${serviceName}" has been successfully added.`,
        duration: 3000,
      });
      setIsSaving(false);
      router.push('/admin/services');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Briefcase className="mr-3 h-8 w-8 text-primary" />
          Add New Service
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Enter the information for the new service.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serviceName"><FileText className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Service Name*</Label>
              <Input 
                id="serviceName" 
                placeholder="e.g., Modern Logo Design Package" 
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category"><Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Category*</Label>
              <Select value={category} onValueChange={setCategory} disabled={isSaving}>
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
                placeholder="e.g., 199.00" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryTime"><ClockIcon className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Estimated Delivery Time</Label>
              <Input 
                id="deliveryTime" 
                placeholder="e.g., 5-7 Business Days" 
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
              placeholder="A brief, catchy description (max 150 characters recommended)."
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
              placeholder="Detailed information about what the service includes."
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
                placeholder="https://placehold.co/600x400.png" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isSaving}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="imageAiHint"><Lightbulb className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Image AI Hint</Label>
              <Input 
                id="imageAiHint" 
                placeholder="e.g., modern logo" 
                value={imageAiHint}
                onChange={(e) => setImageAiHint(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status*</Label>
            <Select value={status} onValueChange={setStatus} disabled={isSaving}>
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
          <Button onClick={handleSaveService} disabled={isSaving}>
             {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Service
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
