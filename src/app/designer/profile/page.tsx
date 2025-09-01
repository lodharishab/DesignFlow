
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Save, UserCircle, Mail, Globe, Link as LinkIcon, MapPin, Briefcase, Loader2, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { designersData, type DesignerProfile } from '@/lib/designer-data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Hardcoded for prototype - replace with actual auth user ID
const CURRENT_DESIGNER_ID = 'des001'; 

interface SocialLink {
  platform: string;
  url: string;
}
export default function DesignerProfilePage() {
  const { toast } = useToast();
  const [designer, setDesigner] = useState<DesignerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: 'Behance', url: '' },
    { platform: 'Dribbble', url: '' },
    { platform: 'LinkedIn', url: '' },
  ]);

  // New state for review settings
  const [autoRequestReviews, setAutoRequestReviews] = useState(true);
  const [reviewRequestDelay, setReviewRequestDelay] = useState('24h');
  const [isSavingReviewSettings, setIsSavingReviewSettings] = useState(false);


  useEffect(() => {
    const foundDesigner = designersData.find(d => d.id === CURRENT_DESIGNER_ID);
    if (foundDesigner) {
      setDesigner(foundDesigner);
      setBio(foundDesigner.bio || '');
      setLocation(foundDesigner.location || '');
      setWebsite(foundDesigner.website || '');
      
      // Initialize social links from data or defaults
      const BehanceLink = foundDesigner.socialLinks?.find(l => l.platform === 'Behance')?.url || '';
      const DribbbleLink = foundDesigner.socialLinks?.find(l => l.platform === 'Dribbble')?.url || '';
      const LinkedInLink = foundDesigner.socialLinks?.find(l => l.platform === 'LinkedIn')?.url || '';
      setSocialLinks([
        { platform: 'Behance', url: BehanceLink },
        { platform: 'Dribbble', url: DribbbleLink },
        { platform: 'LinkedIn', url: LinkedInLink },
      ]);

    }
    setIsLoading(false);
  }, []);

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index].url = value;
    setSocialLinks(newLinks);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    console.log("Saving profile data:", { bio, location, website, socialLinks });
    setTimeout(() => {
      toast({
        title: "Profile Updated (Simulated)",
        description: "Your profile information has been saved.",
      });
      setIsSaving(false);
    }, 1000);
  };
  
   const handleReviewSettingsSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSavingReviewSettings(true);
    console.log("Saving review settings:", { autoRequestReviews, reviewRequestDelay });
    setTimeout(() => {
        toast({
            title: "Review Settings Saved",
            description: `Review requests will be sent ${reviewRequestDelay === 'immediate' ? 'immediately' : `after ${reviewRequestDelay}`}.`
        });
        setIsSavingReviewSettings(false);
    }, 1000);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!designer) {
    return <p>Designer profile not found.</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Settings className="mr-3 h-8 w-8 text-primary" />
        Profile & Settings
      </h1>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint={designer.imageHint} />
                <AvatarFallback>{designer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <CardTitle className="font-headline text-2xl">{designer.name}</CardTitle>
                <CardDescription className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1.5 h-4 w-4" /> {designer.email || 'N/A'} 
                </CardDescription>
                <Button variant="outline" size="sm" className="mt-3" disabled>Change Avatar (Soon)</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <Label htmlFor="bio" className="flex items-center mb-1"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />Your Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                placeholder="Tell clients about yourself, your experience, and your design philosophy..."
                disabled={isSaving}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location" className="flex items-center mb-1"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., City, Country"
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="website" className="flex items-center mb-1"><Globe className="mr-2 h-4 w-4 text-muted-foreground" />Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  disabled={isSaving}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center"><LinkIcon className="mr-2 h-5 w-5 text-primary" />Social Media Links</h3>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={link.platform}>
                    <Label htmlFor={`social-${link.platform.toLowerCase()}`}>{link.platform}</Label>
                    <Input
                      id={`social-${link.platform.toLowerCase()}`}
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                      placeholder={`Your ${link.platform} profile URL`}
                      disabled={isSaving}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" />Specialties</h3>
              {designer.specialties && designer.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {designer.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No specialties listed. These are often derived from services you're approved for.</p>
              )}
               <p className="text-xs text-muted-foreground mt-2">Specialties are typically managed by admins based on your approved services.</p>
            </div>

          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </CardFooter>
        </Card>
      </form>
       
      <form onSubmit={handleReviewSettingsSubmit}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Star className="mr-2 h-5 w-5 text-muted-foreground" />Automated Review Requests</CardTitle>
            <CardDescription>Automate asking clients for reviews after an order is completed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <Label htmlFor="auto-review-switch" className="flex flex-col space-y-1">
                <span>Auto-send review requests</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  When enabled, we'll automatically email clients to ask for a review after you mark an order as complete.
                </span>
              </Label>
              <Switch
                id="auto-review-switch"
                checked={autoRequestReviews}
                onCheckedChange={setAutoRequestReviews}
                disabled={isSavingReviewSettings}
              />
            </div>
            {autoRequestReviews && (
              <div className="space-y-2 pl-4 border-l-2 ml-2">
                <Label htmlFor="review-delay">Send Request After</Label>
                 <Select
                  value={reviewRequestDelay}
                  onValueChange={setReviewRequestDelay}
                  disabled={isSavingReviewSettings}
                >
                  <SelectTrigger className="w-[180px]" id="review-delay">
                    <SelectValue placeholder="Select delay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediately</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="3d">3 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
              <Button type="submit" disabled={isSavingReviewSettings}>
                {isSavingReviewSettings ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSavingReviewSettings ? 'Saving...' : 'Save Review Settings'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
