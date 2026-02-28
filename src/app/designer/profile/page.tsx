
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Save, UserCircle, Mail, Globe, Link as LinkIcon, MapPin, Briefcase, Loader2, Star, Languages, Clock, UserCog, Phone, AtSign, Camera, Wand2, Sparkles, AlertCircle, Tag, X, Calendar, Power, Bell, ShieldCheck, KeyRound, Smartphone, Monitor, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getDesignerById, type DesignerProfile } from '@/lib/designer-db';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { generateDesignerBio } from '@/ai/flows/designer-bio-flow';
import type { DesignerBioResponse } from '@/ai/flows/designer-bio-types';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


// Hardcoded for prototype - replace with actual auth user ID
const CURRENT_DESIGNER_ID = 'des001'; 

interface SocialLink {
  platform: string;
  url: string;
}

interface DaySchedule {
    available: boolean;
    from: string;
    to: string;
}

interface WeeklySchedule {
    [day: string]: DaySchedule;
}

type NotificationChannel = 'inApp' | 'email' | 'push';
type NotificationType = 'newOrder' | 'paymentAlerts' | 'disputeUpdates' | 'reviewAlerts' | 'milestoneUpdates';

type NotificationPreferences = Record<NotificationType, Record<NotificationChannel, boolean>>;

interface LoginActivity {
    ip: string;
    device: string;
    location: string;
    timestamp: Date;
}

// TODO: Replace with a real login_activity DB table when available
const mockLoginActivity: LoginActivity[] = [
    { ip: '103.22.201.12', device: 'Chrome on macOS', location: 'Mumbai, IN', timestamp: new Date() },
    { ip: '45.112.88.210', device: 'Firefox on Windows', location: 'Delhi, IN', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { ip: '15.206.110.15', device: 'Safari on iPhone', location: 'Bangalore, IN', timestamp: new Date(new Date().setDate(new Date().getDate() - 5)) },
];


const allAvailableSpecialties = [
    'Logo Design', 'Web UI/UX', 'Branding', 'Illustration', 'Icon Design',
    'App Design', 'Packaging Design', '3D Modeling', 'Print Design',
    'Social Media Graphics', 'Motion Graphics', 'Video Editing', 'Content Creation',
    'Presentation Design', 'Typography', 'Layout Design', 'Corporate Branding',
    'User Research', 'Prototyping', 'Figma', 'Digital Art', 'Cultural Design',
    'Sustainable Design', 'Label Design', 'Data Visualization', 'Photography', 'Photo Editing'
].sort();

const notificationTypes: {id: NotificationType, label: string, description: string, disabled?: boolean}[] = [
    { id: 'newOrder', label: 'New Order Assignments', description: 'Alerts when a new project is assigned to you.', disabled: true },
    { id: 'paymentAlerts', label: 'Payment & Payout Alerts', description: 'Notifications about successful payouts or payment issues.' },
    { id: 'disputeUpdates', label: 'Dispute Updates', description: 'Alerts regarding new or updated disputes on your orders.' },
    { id: 'reviewAlerts', label: 'New Client Reviews', description: 'Get notified when a client leaves you a new review.' },
    { id: 'milestoneUpdates', label: 'Project Milestone Updates', description: 'Updates on milestone approvals and upcoming deadlines.' },
];

const badgeData = [
  { name: 'Top Rated', icon: Award, criteria: 'Maintain a 4.8+ rating over 20+ reviews.' },
  { name: 'Rising Talent', icon: TrendingUp, criteria: 'Complete your first 5 orders with positive feedback.' },
  { name: 'On-Time Delivery', icon: CheckCircle2, criteria: 'Consistently deliver projects before the deadline.' },
  { name: 'Verified', icon: ShieldCheck, criteria: 'Complete identity and payment verification.' },
];

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
  const [initialState, setInitialState] = useState<any | null>(null); // For resetting the form
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Consolidated form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [language, setLanguage] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([{ platform: 'Behance', url: '' },{ platform: 'Dribbble', url: '' },{ platform: 'LinkedIn', url: '' },]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  const [isAvailableForOrders, setIsAvailableForOrders] = useState(true);
  const [maxActiveOrders, setMaxActiveOrders] = useState(5);
  const [autoRequestReviews, setAutoRequestReviews] = useState(true);
  const [reviewRequestDelay, setReviewRequestDelay] = useState('immediate');
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    newOrder: { inApp: true, email: true, push: false },
    paymentAlerts: { inApp: true, email: true, push: false },
    disputeUpdates: { inApp: true, email: true, push: false },
    reviewAlerts: { inApp: true, email: false, push: false },
    milestoneUpdates: { inApp: true, email: false, push: false },
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  const captureInitialState = (designerProfile: DesignerProfile) => {
    const initialStateData = {
      name: designerProfile.name,
      username: designerProfile.slug,
      bio: designerProfile.bio || '',
      location: designerProfile.location || '',
      website: designerProfile.website || '',
      timeZone: 'Asia/Kolkata',
      language: 'en-IN',
      socialLinks: [
        { platform: 'Behance', url: designerProfile.socialLinks?.find(l => l.platform === 'Behance')?.url || '' },
        { platform: 'Dribbble', url: designerProfile.socialLinks?.find(l => l.platform === 'Dribbble')?.url || '' },
        { platform: 'LinkedIn', url: designerProfile.socialLinks?.find(l => l.platform === 'LinkedIn')?.url || '' },
      ],
      specialties: designerProfile.specialties || [],
      skills: designerProfile.specialties || [],
      isAvailableForOrders: true,
      maxActiveOrders: 5,
      autoRequestReviews: true,
      reviewRequestDelay: 'immediate',
      notificationPrefs: { /* Default prefs */ },
      isTwoFactorEnabled: false,
    };
    setInitialState(initialStateData);
    resetForm(initialStateData, false); // Don't show toast on initial load
  };
  
  const resetForm = (stateToResetTo = initialState, showToast = true) => {
    if (!stateToResetTo) return;
    setName(stateToResetTo.name);
    setUsername(stateToResetTo.username);
    setBio(stateToResetTo.bio);
    setLocation(stateToResetTo.location);
    setWebsite(stateToResetTo.website);
    setTimeZone(stateToResetTo.timeZone);
    setLanguage(stateToResetTo.language);
    setSocialLinks(stateToResetTo.socialLinks);
    setSpecialties(stateToResetTo.specialties);
    setSkills(stateToResetTo.skills);
    setIsAvailableForOrders(stateToResetTo.isAvailableForOrders);
    setMaxActiveOrders(stateToResetTo.maxActiveOrders);
    setAutoRequestReviews(stateToResetTo.autoRequestReviews);
    setReviewRequestDelay(stateToResetTo.reviewRequestDelay);
    // setNotificationPrefs(stateToResetTo.notificationPrefs);
    setIsTwoFactorEnabled(stateToResetTo.isTwoFactorEnabled);
    setNewPassword('');
    setConfirmPassword('');
    if(showToast) {
        toast({ title: "Changes Reverted", description: "Your unsaved changes have been discarded." });
    }
  };


  useEffect(() => {
    getDesignerById(CURRENT_DESIGNER_ID).then(foundDesigner => {
      if (foundDesigner) {
        setDesigner(foundDesigner);
        captureInitialState(foundDesigner);
      }
      setIsLoading(false);
    });
  }, []);

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index].url = value;
    setSocialLinks(newLinks);
  };
  
  const handleAcceptAiContent = (content: DesignerBioResponse) => {
    setBio(content.bio);
  };

  const handleSpecialtyToggle = (specialtyToToggle: string) => {
    setSpecialties(prev => {
        const newSpecialties = new Set(prev);
        if (newSpecialties.has(specialtyToToggle)) {
            newSpecialties.delete(specialtyToToggle);
        } else {
            newSpecialties.add(specialtyToToggle);
        }
        return Array.from(newSpecialties);
    });
  };

  const addSkillFromInput = () => {
    const newSkill = currentSkillInput.trim();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
    }
    setCurrentSkillInput(''); 
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      addSkillFromInput();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleNotificationPrefChange = (type: NotificationType, channel: NotificationChannel, checked: boolean) => {
    setNotificationPrefs(prev => ({
        ...prev,
        [type]: {
            ...prev[type],
            [channel]: checked
        }
    }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (newPassword && newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      setIsSaving(false);
      return;
    }
    if (newPassword && newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters long.", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    // Simulate saving all data
    const allData = {
        name, username, bio, location, website, timeZone, language, socialLinks, specialties, skills,
        isAvailableForOrders, maxActiveOrders,
        autoRequestReviews, reviewRequestDelay,
        notificationPrefs,
        newPassword: newPassword ? '******' : '', isTwoFactorEnabled
    };
    console.log("Saving all profile settings (simulated):", allData);

    setTimeout(() => {
      toast({
        title: "Profile Updated Successfully!",
        description: "Your settings have been saved.",
        variant: 'default',
      });
      setIsSaving(false);
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
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
    <form onSubmit={handleFormSubmit}>
        <div className="space-y-8 pb-28"> {/* Add padding-bottom for sticky footer */}
        <h1 className="text-3xl font-bold font-headline flex items-center">
            <Settings className="mr-3 h-8 w-8 text-primary" />
            Profile & Settings
        </h1>

        <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full space-y-6">

             {/* Personal Info Accordion Item */}
             <AccordionItem value="item-1" className="border rounded-lg shadow-md bg-card">
                <AccordionTrigger className="px-6 py-4 text-xl font-headline hover:no-underline">
                    <div className="flex items-center"><UserCog className="mr-3 h-5 w-5 text-muted-foreground" /> Personal Info</div>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                    <div className="pt-2 space-y-6">
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
                                <Input id="phone" value="9876543210" disabled />
                                <p className="text-xs text-muted-foreground">Phone number is your primary login.</p>
                            </div>
                            <div className="space-y-2">
                                <TooltipProvider>
                                <Tooltip>
                                <TooltipTrigger asChild>
                                    <Label htmlFor="timezone" className="flex items-center"><Clock className="mr-2 h-4 w-4"/>Time Zone</Label>
                                </TooltipTrigger>
                                <TooltipContent><p>This affects when deadlines and communications are displayed to you.</p></TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
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
                    </div>
                </AccordionContent>
            </AccordionItem>
            
             {/* Professional Info Accordion Item */}
            <AccordionItem value="item-2" className="border rounded-lg shadow-md bg-card">
                 <AccordionTrigger className="px-6 py-4 text-xl font-headline hover:no-underline">
                    <div className="flex items-center"><Briefcase className="mr-3 h-5 w-5 text-muted-foreground" /> Professional Info</div>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                    <div className="pt-2 space-y-6">
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
                        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={5} maxLength={300} placeholder="Tell clients about yourself..." disabled={isSaving}/>
                        <p className="text-xs text-muted-foreground text-right">{bio.length} / 300 characters</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="location" className="flex items-center mb-1"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Location</Label>
                            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., City, Country" disabled={isSaving}/>
                        </div>
                        <div>
                            <Label htmlFor="website" className="flex items-center mb-1"><Globe className="mr-2 h-4 w-4 text-muted-foreground" />Website URL</Label>
                            <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourportfolio.com" disabled={isSaving}/>
                        </div>
                        </div>
                        
                        <Separator />

                        <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center"><Star className="mr-2 h-5 w-5 text-primary" />Your Specialties</h3>
                        <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-secondary/30">
                                {allAvailableSpecialties.map(specialty => {
                                    const isSelected = specialties.includes(specialty);
                                    return (
                                        <Button key={specialty} type="button" variant={isSelected ? "default" : "outline"} onClick={() => handleSpecialtyToggle(specialty)} disabled={isSaving} size="sm">
                                            {specialty}
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>

                        <Separator />
                        
                        <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" />Your Skills</h3>
                        <div className="space-y-2">
                            <Input id="skillInput" placeholder="Add a skill (e.g., Figma, Photoshop) and press Enter" value={currentSkillInput} onChange={(e) => setCurrentSkillInput(e.target.value)} onKeyDown={handleSkillInputKeyDown} disabled={isSaving} className="flex-grow"/>
                            <div className="flex flex-wrap gap-2 mt-2 min-h-[2.5rem] p-2 border rounded-md bg-muted/50">
                                {skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1 pr-1 py-1 text-sm">
                                    {skill}
                                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="rounded-full hover:bg-muted-foreground/20 p-0.5 focus:outline-none focus:ring-1 focus:ring-ring" aria-label={`Remove skill ${skill}`} disabled={isSaving}>
                                    <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                                ))}
                                {skills.length === 0 && (
                                <p className="text-xs text-muted-foreground py-1 px-1">No skills added yet.</p>
                                )}
                            </div>
                        </div>
                        </div>

                        <Separator />

                        <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center"><LinkIcon className="mr-2 h-5 w-5 text-primary" />Social Media Links</h3>
                        <div className="space-y-4">
                            {socialLinks.map((link, index) => (
                            <div key={link.platform}>
                                <Label htmlFor={`social-${link.platform.toLowerCase()}`}>{link.platform}</Label>
                                <Input id={`social-${link.platform.toLowerCase()}`} value={link.url} onChange={(e) => handleSocialLinkChange(index, e.target.value)} placeholder={`Your ${link.platform} profile URL`} disabled={isSaving}/>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            {/* Achievements Accordion Item */}
            <AccordionItem value="item-3" className="border rounded-lg shadow-md bg-card">
                 <AccordionTrigger className="px-6 py-4 text-xl font-headline hover:no-underline">
                    <div className="flex items-center"><Award className="mr-3 h-5 w-5 text-muted-foreground" /> Achievements</div>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                    <div className="pt-2">
                        <TooltipProvider>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {badgeData.map(badge => {
                                const hasBadge = designer.badges?.includes(badge.name as typeof designer.badges[number]);
                                return (
                                <Tooltip key={badge.name}>
                                    <TooltipTrigger asChild>
                                    <Card className={cn(
                                        "text-center p-4 flex flex-col items-center justify-center gap-2 transition-all",
                                        hasBadge ? 'border-primary/40 bg-primary/10' : 'bg-muted/50'
                                    )}>
                                        <badge.icon className={cn("h-10 w-10", hasBadge ? 'text-primary' : 'text-muted-foreground/60')} />
                                        <p className={cn("font-semibold text-sm", hasBadge ? 'text-primary' : 'text-muted-foreground')}>{badge.name}</p>
                                    </Card>
                                    </TooltipTrigger>
                                    {!hasBadge && (
                                    <TooltipContent>
                                        <p className="text-xs">{badge.criteria}</p>
                                    </TooltipContent>
                                    )}
                                </Tooltip>
                                );
                            })}
                            </div>
                        </TooltipProvider>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            {/* Availability Accordion Item */}
            <AccordionItem value="item-4" className="border rounded-lg shadow-md bg-card">
                 <AccordionTrigger className="px-6 py-4 text-xl font-headline hover:no-underline">
                    <div className="flex items-center"><Power className="mr-3 h-5 w-5 text-muted-foreground" /> Availability</div>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                    <div className="pt-2 space-y-6">
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                            <Label htmlFor="availability-switch" className="flex flex-col space-y-1">
                                <span>Available for new orders</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                Turn this off to temporarily stop receiving new project assignments.
                                </span>
                            </Label>
                            <Switch id="availability-switch" checked={isAvailableForOrders} onCheckedChange={setIsAvailableForOrders} disabled={isSaving}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="max-orders">Maximum Active Orders</Label>
                            <Input id="max-orders" type="number" className="w-32" value={maxActiveOrders} onChange={(e) => setMaxActiveOrders(Number(e.target.value))} min="1" max="20" disabled={isSaving}/>
                            <p className="text-xs text-muted-foreground">The maximum number of projects you want to work on at one time.</p>
                        </div>
                         <div className="space-y-6">
                            <h3 className="font-semibold">Automated Review Requests</h3>
                            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                                <Label htmlFor="auto-review-switch" className="flex flex-col space-y-1">
                                    <span>Auto-send review requests</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                    When enabled, we'll automatically email clients to ask for a review after you mark an order as complete.
                                    </span>
                                </Label>
                                <Switch id="auto-review-switch" checked={autoRequestReviews} onCheckedChange={setAutoRequestReviews} disabled={isSaving}/>
                            </div>
                            {autoRequestReviews && (
                            <div className="space-y-2 pl-4 border-l-2 ml-2">
                                <Label htmlFor="review-delay">Send Request After</Label>
                                <Select value={reviewRequestDelay} onValueChange={setReviewRequestDelay} disabled={isSaving}>
                                    <SelectTrigger className="w-[180px]" id="review-delay">
                                        <SelectValue placeholder="Select delay" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="immediate">Immediately</SelectItem>
                                        <SelectItem value="12h">12 Hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            )}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            {/* Notifications Accordion Item */}
            <AccordionItem value="item-5" className="border rounded-lg shadow-md bg-card">
                 <AccordionTrigger className="px-6 py-4 text-xl font-headline hover:no-underline">
                    <div className="flex items-center"><Bell className="mr-3 h-5 w-5 text-muted-foreground" /> Notifications</div>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                    <div className="pt-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Notification Type</TableHead>
                                    <TableHead className="text-center">In-App</TableHead>
                                    <TableHead className="text-center">Email</TableHead>
                                    <TableHead className="text-center">Push</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notificationTypes.map(type => (
                                    <TableRow key={type.id}>
                                        <TableCell>
                                            <p className="font-medium">{type.label}</p>
                                            <p className="text-xs text-muted-foreground">{type.description}</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox checked={notificationPrefs[type.id]?.inApp} onCheckedChange={(checked) => handleNotificationPrefChange(type.id, 'inApp', !!checked)} disabled={type.disabled || isSaving}/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox checked={notificationPrefs[type.id]?.email} onCheckedChange={(checked) => handleNotificationPrefChange(type.id, 'email', !!checked)} disabled={type.disabled || isSaving}/>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox checked={notificationPrefs[type.id]?.push} onCheckedChange={(checked) => handleNotificationPrefChange(type.id, 'push', !!checked)} disabled={isSaving}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            {/* Security Accordion Item */}
            <AccordionItem value="item-6" className="border rounded-lg shadow-md bg-card">
                 <AccordionTrigger className="px-6 py-4 text-xl font-headline hover:no-underline">
                    <div className="flex items-center"><ShieldCheck className="mr-3 h-5 w-5 text-muted-foreground" /> Security</div>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                    <div className="pt-2 space-y-8">
                        <div>
                        <h3 className="font-semibold mb-2">Change Password</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isSaving} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isSaving} />
                            </div>
                        </div>
                        </div>

                        <Separator />

                        <div>
                        <h3 className="font-semibold mb-2">Two-Factor Authentication (2FA)</h3>
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                            <Label htmlFor="2fa-switch" className="flex flex-col space-y-1">
                                <span>Enable Two-Factor Authentication</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                Add an extra layer of security to your account.
                                </span>
                            </Label>
                            <Switch id="2fa-switch" checked={isTwoFactorEnabled} onCheckedChange={setIsTwoFactorEnabled} disabled={isSaving}/>
                        </div>
                        </div>
                        <Separator />
                        <div>
                        <h3 className="font-semibold mb-2">Recent Login Activity</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockLoginActivity.map((activity, index) => (
                                    <TableRow key={index}>
                                    <TableCell className="flex items-center">
                                        {activity.device.includes('iPhone') ? <Smartphone className="h-4 w-4 mr-2 text-muted-foreground"/> : <Monitor className="h-4 w-4 mr-2 text-muted-foreground"/>}
                                        {activity.device}
                                    </TableCell>
                                    <TableCell>{activity.location}</TableCell>
                                    <TableCell className="font-mono text-xs">{activity.ip}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
      </div>

       <div className="fixed bottom-0 left-0 md:left-[var(--sidebar-width)] right-0 z-40">
            <div className="container mx-auto px-6">
                <Card className="shadow-2xl border-t-2 rounded-b-none p-4">
                    <div className="flex justify-end items-center gap-4">
                        <Button variant="outline" type="button" onClick={() => resetForm(initialState)} disabled={isSaving}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                            {isSaving ? 'Saving All Changes...' : 'Save All Changes'}
                        </Button>
                    </div>
                </Card>
            </div>
       </div>
    </form>
  );
}
