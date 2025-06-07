
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Palette, Share2, Printer, Laptop, Brush as BrushIcon, Package as PackageIcon, Film, Presentation, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { designersData, type DesignerProfile } from '@/lib/designer-data';
import type { Icon as LucideIconType } from 'lucide-react';

// Hardcoded for prototype - replace with actual auth user ID
const CURRENT_DESIGNER_ID = 'des001'; 

interface ServiceCategoryOption {
  id: string;
  name: string;
  slug: string;
  icon: LucideIconType;
  description: string;
}

// Consistent with services page categories if possible
const availableServiceCategories: ServiceCategoryOption[] = [
  { id: 'cat001', name: 'Logo Design', slug: 'logo-design', icon: Palette, description: 'Get alerts for new logo and branding projects.' },
  { id: 'cat002', name: 'Web UI/UX', slug: 'web-ui-ux', icon: Laptop, description: 'Notifications for website and app interface design tasks.' },
  { id: 'cat003', name: 'Print Materials', slug: 'print-materials', icon: Printer, description: 'Stay updated on brochure, flyer, and other print design needs.' },
  { id: 'cat004', name: 'Custom Illustrations', slug: 'custom-illustrations', icon: BrushIcon, description: 'Receive notifications for illustration and artwork projects.' },
  { id: 'cat005', name: 'Social Media Graphics', slug: 'social-media-graphics', icon: Share2, description: 'Alerts for social media post, banner, and ad designs.' },
  { id: 'cat006', name: 'Packaging Design', slug: 'packaging', icon: PackageIcon, description: 'Notifications for product packaging design projects.' },
  { id: 'cat007', name: 'Motion Graphics', slug: 'motion-graphics', icon: Film, description: 'Alerts for animation and video editing projects.' },
  { id: 'cat008', name: 'Presentation Design', slug: 'presentations', icon: Presentation, description: 'Stay informed about pitch deck and presentation design tasks.' },
];

// Simulate designer's approved services/specialties and current notification preferences
// In a real app, this would come from the backend.
interface NotificationPreferences {
  [categorySlug: string]: boolean;
}

export default function DesignerServicesNotificationsPage() {
  const { toast } = useToast();
  const [designer, setDesigner] = useState<DesignerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({});

  useEffect(() => {
    const foundDesigner = designersData.find(d => d.id === CURRENT_DESIGNER_ID);
    if (foundDesigner) {
      setDesigner(foundDesigner);
      // Simulate loading saved preferences or initializing based on specialties
      const initialPrefs: NotificationPreferences = {};
      availableServiceCategories.forEach(cat => {
        // Example: auto-subscribe if the category name is among their specialties
        initialPrefs[cat.slug] = foundDesigner.specialties?.includes(cat.name) || false;
      });
      setNotificationPrefs(initialPrefs);
    }
    setIsLoading(false);
  }, []);

  const handlePreferenceChange = (categorySlug: string, isSubscribed: boolean) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [categorySlug]: isSubscribed,
    }));
    // Simulate instant save feedback for now, a real save button would be better for multiple changes
    toast({
      title: "Preference Updated (Simulated)",
      description: `Notifications for ${availableServiceCategories.find(c=>c.slug === categorySlug)?.name || 'this category'} ${isSubscribed ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleSaveAllPreferences = () => {
    setIsSaving(true);
    console.log("Saving notification preferences (simulated):", notificationPrefs);
    setTimeout(() => {
        toast({
            title: "Preferences Saved (Simulated)",
            description: "Your notification preferences have been updated.",
        });
        setIsSaving(false);
    }, 1000);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading service preferences...</p>
      </div>
    );
  }

  if (!designer) {
    return <p>Designer profile not found. Cannot manage service notifications.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Bell className="mr-3 h-8 w-8 text-primary" />
          My Service Alerts
        </h1>
        <Button onClick={handleSaveAllPreferences} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            {isSaving ? 'Saving...' : 'Save All Preferences'}
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Manage Project Notifications</CardTitle>
          <CardDescription>
            Subscribe to receive email notifications for new project opportunities in your preferred service categories. 
            Your approved specialties may pre-select some categories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {availableServiceCategories.map(category => (
            <div key={category.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-secondary/30 hover:shadow-sm transition-shadow">
              <div className="mb-3 sm:mb-0">
                <Label htmlFor={`switch-${category.slug}`} className="text-lg font-semibold flex items-center">
                  <category.icon className="mr-3 h-6 w-6 text-primary" />
                  {category.name}
                </Label>
                <p className="text-sm text-muted-foreground mt-1 pl-9">{category.description}</p>
              </div>
              <div className="flex items-center space-x-2 shrink-0 ml-auto sm:ml-4">
                <Switch
                  id={`switch-${category.slug}`}
                  checked={notificationPrefs[category.slug] || false}
                  onCheckedChange={(checked) => handlePreferenceChange(category.slug, checked)}
                  disabled={isSaving}
                />
                <Label htmlFor={`switch-${category.slug}`} className="text-sm cursor-pointer">
                  {notificationPrefs[category.slug] ? 'Subscribed' : 'Unsubscribed'}
                </Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
