
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Save, UserCircle, Mail, Globe, Link as LinkIcon, MapPin, Briefcase, Loader2, Star, Languages, Clock, UserCog, Phone, AtSign, Camera, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { designersData, type DesignerProfile } from '@/lib/designer-data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { generateDesignerBio } from '@/ai/flows/designer-bio-flow';
import type { DesignerBioResponse } from '@/ai/flows/designer-bio-types';

// Hardcoded for prototype - replace with actual auth user ID
const CURRENT_DESIGNER_ID = 'des001'; 

interface SocialLink {
  platform: string;
  url: string;
}

function AiAssistDialog({ onAccept, designer }: { onAccept: (content: DesignerBioResponse) => void; designer: DesignerProfile }) {
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<DesignerBioResponse | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const result = await generateDesignerBio({
        name: designer.name,
        specialties: designer.specialties.join(', '),
        tone: tone,
      });
      setGeneratedContent(result);
    } catch (error) {
      console.error(error);
      toast({ title: "AI Generation Failed", description: "Could not generate content. Please try again.", variant: "destructive" });
    }
    setIsGenerating(false);
  };
  
  const handleAccept = () => {
    if (generatedContent) {
      onAccept(generatedContent);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl flex items-center"><Wand2 className="mr-3 h-6 w-6 text-primary"/> AI Bio Assistant</DialogTitle>
        <DialogDescription>Let AI help you craft a professional bio based on your skills and preferred tone.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
            <Label htmlFor="ai-tone">Select a Tone</Label>
            <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="ai-tone">
                    <SelectValue placeholder="Select a tone..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Friendly & Approachable">Friendly & Approachable</SelectItem>
                    <SelectItem value="Creative & Artistic">Creative & Artistic</SelectItem>
                    <SelectItem value="Formal & Corporate">Formal & Corporate</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
          {isGenerating ? 'Generating...' : 'Generate Bio'}
        </Button>
        
        {generatedContent && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Suggested Bio:</h3>
            <div className="p-3 border rounded-md bg-muted text-sm whitespace-pre-wrap">
              {generatedContent.bio}
            </div>
          </div>
        )}
         <p className="text-xs text-muted-foreground flex items-center pt-2">
            <AlertCircle className="h-3 w-3 mr-1.5"/>Powered by AI — please review carefully before saving.
        </p>
      </div>
       <DialogFooter className="sm:justify-between gap-2">
        <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>Regenerate</Button>
          <DialogClose asChild>
            <Button onClick={handleAccept} disabled={!generatedContent}>Accept & Insert</Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}

export default function DesignerProfilePage() {
  const { toast } = useToast();
  const [designer, setDesigner] = useState<DesignerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [language, setLanguage] = useState('');
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
      setName(foundDesigner.name);
      setUsername(foundDesigner.slug);
      setBio(foundDesigner.bio || '');
      setLocation(foundDesigner.location || '');
      setWebsite(foundDesigner.website || '');
      setTimeZone('Asia/Kolkata'); // Example Default
      setLanguage('en-IN'); // Example Default
      
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
  
  const handleAcceptAiContent = (content: DesignerBioResponse) => {
    setBio(content.bio);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    console.log("Saving profile data:", { name, username, bio, location, website, socialLinks, timeZone, language });
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
        {/* Personal Info Card */}
        <Card className="shadow-lg mb-8">
            <CardHeader>
                <CardTitle className="flex items-center"><UserCog className="mr-2 h-5 w-5 text-muted-foreground" /> Personal Info</CardTitle>
                <CardDescription>Manage your personal details and account settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint={designer.imageHint} />
                            <AvatarFallback>{designer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button size="icon" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full" disabled>
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Change Avatar</span>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground flex-grow">Avatar uploads are coming soon. Your current avatar is shown.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center"><UserCircle className="mr-2 h-4 w-4"/>Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username" className="flex items-center"><AtSign className="mr-2 h-4 w-4"/>Username</Label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isSaving} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4"/>Email Address</Label>
                        <Input id="email" type="email" value={designer.email || ''} disabled />
                        <p className="text-xs text-muted-foreground">Email cannot be changed. Please contact support.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center"><Phone className="mr-2 h-4 w-4"/>Phone Number</Label>
                        <Input id="phone" value="9876543210" disabled /> {/* Placeholder value */}
                        <p className="text-xs text-muted-foreground">Phone number is your primary login.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timezone" className="flex items-center"><Clock className="mr-2 h-4 w-4"/>Time Zone</Label>
                         <Select value={timeZone} onValueChange={setTimeZone} disabled={isSaving}>
                            <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="language" className="flex items-center"><Languages className="mr-2 h-4 w-4"/>Language/Locale</Label>
                         <Select value={language} onValueChange={setLanguage} disabled={isSaving}>
                            <SelectTrigger id="language"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en-IN">English (India)</SelectItem>
                                <SelectItem value="en-US">English (US)</SelectItem>
                                <SelectItem value="hi-IN" disabled>Hindi (coming soon)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        {/* Professional Info Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />Professional Information</CardTitle>
            <CardDescription>This information is visible on your public profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="bio" className="flex items-center"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />Your Bio</Label>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button type="button" variant="secondary" size="sm"><Wand2 className="mr-1.5 h-4 w-4"/> AI Assist</Button>
                    </DialogTrigger>
                    <AiAssistDialog onAccept={handleAcceptAiContent} designer={designer} />
                </Dialog>
              </div>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                maxLength={300}
                placeholder="Tell clients about yourself, your experience, and your design philosophy..."
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length} / 300 characters</p>
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
