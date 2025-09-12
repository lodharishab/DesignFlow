
"use client";

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Save, Building, Globe, Users, Palette, Paintbrush, MessageCircle, FileText, Loader2, Info, UploadCloud, Link as LinkIcon, Eye, Font, MessageSquare as MessageSquareIcon, CheckSquare, Tag, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface BrandProfileFormData {
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: string;
  targetAudience: string;
  brandValues: string;
  tags: string[]; // Added for tags
  projectTypes: string[]; // Added for project types
  preferredDesignStyle: string;
  colorsToUse: string;
  colorsToAvoid: string;
  brandLogo?: File;
  brandFonts?: File[];
  communicationPreference: string;
  feedbackStyle: string;
  notesForDesigners: string;
  brandGuidelinesLink: string;
  existingAssetsLink: string;
}

const industryOptions = ["Technology", "Retail/E-commerce", "Healthcare", "Education", "Hospitality/Travel", "Real Estate", "Finance", "Manufacturing", "Non-profit", "Creative Arts", "Other"];
const companySizeOptions = ["Solo / Freelancer", "1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"];
const feedbackStyleOptions = ["Direct & Concise", "Detailed & Explanatory", "Collaborative Discussion", "Visual Examples Preferred"];
const suggestedTags = ["Minimal", "Luxury", "Fun", "Bold", "Elegant", "Professional", "Modern", "Classic", "Youthful"];
const projectTypeOptions = [
    { id: 'logo-branding', label: 'Logo & Branding' },
    { id: 'web-design', label: 'Websites & UI/UX' },
    { id: 'print-materials', label: 'Print Materials' },
    { id: 'social-media', label: 'Social Media' },
    { id: 'packaging', label: 'Packaging' },
    { id: 'illustration', label: 'Illustration' },
];


export default function BrandProfilePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BrandProfileFormData>({
    companyName: "",
    companyWebsite: "",
    industry: "",
    companySize: "",
    targetAudience: "",
    brandValues: "",
    tags: [],
    projectTypes: [],
    preferredDesignStyle: "",
    colorsToUse: "",
    colorsToAvoid: "",
    communicationPreference: "Platform Chat",
    feedbackStyle: "",
    notesForDesigners: "",
    brandGuidelinesLink: "",
    existingAssetsLink: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [currentTagInput, setCurrentTagInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof Omit<BrandProfileFormData, 'tags' | 'projectTypes'>, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleTagClick = (tag: string) => {
    setFormData(prev => {
        const newTags = new Set(prev.tags);
        if (newTags.has(tag)) {
            newTags.delete(tag);
        } else {
            newTags.add(tag);
        }
        return { ...prev, tags: Array.from(newTags) };
    });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTagInput.trim()) {
        e.preventDefault();
        const newTag = currentTagInput.trim();
        if (!formData.tags.includes(newTag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
        }
        setCurrentTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleProjectTypeChange = (projectTypeId: string, checked: boolean) => {
    setFormData(prev => {
        const newProjectTypes = new Set(prev.projectTypes);
        if (checked) {
            newProjectTypes.add(projectTypeId);
        } else {
            newProjectTypes.delete(projectTypeId);
        }
        return { ...prev, projectTypes: Array.from(newProjectTypes) };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (files) {
        if (id === 'brandLogo') {
            setFormData(prev => ({ ...prev, brandLogo: files[0] }));
        } else if (id === 'brandFonts') {
            setFormData(prev => ({ ...prev, brandFonts: Array.from(files) }));
        }
    }
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.industry) {
        toast({ title: "Missing Information", description: "Please fill in at least Company Name and Industry.", variant: "destructive"});
        return;
    }
    setIsSaving(true);
    // Simulate saving the form data
    console.log("Saving brand profile data (simulated):", formData);
    setTimeout(() => {
        toast({ title: "Profile Saved (Simulated)", description: "Your brand profile has been successfully saved." });
        setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Sparkles className="mr-3 h-8 w-8 text-primary" />
          My Brand Profile
        </h1>
        <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Tell Us About Your Brand</CardTitle>
            <CardDescription>
              The more details you provide, the better our designers can understand your vision.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Company & Industry */}
            <section>
              <h2 className="text-xl font-semibold font-headline mb-4 flex items-center"><Building className="mr-2 h-5 w-5 text-primary" />Company & Industry</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Brand/Company Name*</Label>
                  <Input id="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g., My Awesome Startup" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
                  <Input id="companyWebsite" type="url" value={formData.companyWebsite} onChange={handleChange} placeholder="https://example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleSelectChange('industry', value)}>
                    <SelectTrigger id="industry"><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>{industryOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={formData.companySize} onValueChange={(value) => handleSelectChange('companySize', value)}>
                    <SelectTrigger id="companySize"><SelectValue placeholder="Select company size" /></SelectTrigger>
                    <SelectContent>{companySizeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Separator />

            {/* Brand Identity & Style */}
            <section>
              <h2 className="text-xl font-semibold font-headline mb-4 flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" />Brand Identity & Style</h2>
              <div className="grid md:grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea id="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Describe your typical customers/users..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandValues">Brand Values (comma-separated)</Label>
                  <Input id="brandValues" value={formData.brandValues} onChange={handleChange} placeholder="e.g., Innovation, Trust, Community" />
                </div>
                 <div className="space-y-2">
                    <Label>Brand Tags</Label>
                    <div className="p-3 border rounded-md bg-muted/50 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {suggestedTags.map(tag => (
                                <Badge 
                                    key={tag}
                                    variant={formData.tags.includes(tag) ? "default" : "secondary"}
                                    onClick={() => handleTagClick(tag)}
                                    className="cursor-pointer"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                             <Input 
                                id="tag-input" 
                                placeholder="Add a custom tag..."
                                value={currentTagInput}
                                onChange={(e) => setCurrentTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                            />
                            <Button type="button" onClick={() => handleTagInputKeyDown({ key: 'Enter', preventDefault: () => {} } as React.KeyboardEvent<HTMLInputElement>)}>Add</Button>
                        </div>
                         {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {formData.tags.map(tag => (
                                     <Badge key={tag} variant="outline" className="pr-1">
                                        {tag}
                                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 rounded-full p-0.5 hover:bg-destructive/20 text-destructive">
                                            <X className="h-3 w-3"/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredDesignStyle">Preferred Brand Design Style</Label>
                  <Textarea id="preferredDesignStyle" value={formData.preferredDesignStyle} onChange={handleChange} placeholder="Describe the look and feel (e.g., modern & minimalist, vintage & rustic, fun & playful)..." rows={3} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="colorsToUse">Preferred Colors (comma-separated)</Label>
                        <Input id="colorsToUse" value={formData.colorsToUse} onChange={handleChange} placeholder="e.g., #007bff, Dark Blue, Gold" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="colorsToAvoid">Colors to Avoid (comma-separated)</Label>
                        <Input id="colorsToAvoid" value={formData.colorsToAvoid} onChange={handleChange} placeholder="e.g., Bright Pink, Neon Green" />
                    </div>
                </div>
              </div>
            </section>

            <Separator />
            
            {/* Brand Assets */}
            <section>
              <h2 className="text-xl font-semibold font-headline mb-4 flex items-center"><UploadCloud className="mr-2 h-5 w-5 text-primary" />Brand Assets</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="brandLogo">Brand Logo</Label>
                    <Input id="brandLogo" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, .svg, .ai, .eps" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="brandFonts">Brand Fonts</Label>
                    <Input id="brandFonts" type="file" onChange={handleFileChange} multiple accept=".ttf, .otf, .woff, .woff2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandGuidelinesLink">Brand Guidelines Link (Optional)</Label>
                  <Input id="brandGuidelinesLink" type="url" value={formData.brandGuidelinesLink} onChange={handleChange} placeholder="https://example.com/brand-guidelines.pdf" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="existingAssetsLink">Existing Assets Folder Link (Optional)</Label>
                  <Input id="existingAssetsLink" type="url" value={formData.existingAssetsLink} onChange={handleChange} placeholder="e.g., Google Drive, Dropbox link" />
                </div>
              </div>
            </section>

            <Separator />

             {/* Project and Communication Preferences */}
            <section>
              <h2 className="text-xl font-semibold font-headline mb-4 flex items-center"><CheckSquare className="mr-2 h-5 w-5 text-primary" />Project & Communication Preferences</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Preferred Communication Method</Label>
                  <RadioGroup defaultValue="Platform Chat" id="communicationPreference" value={formData.communicationPreference} onValueChange={(value) => handleSelectChange('communicationPreference', value)} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Platform Chat" id="comm-chat" />
                      <Label htmlFor="comm-chat">Platform Chat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Email" id="comm-email" />
                      <Label htmlFor="comm-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Scheduled Calls" id="comm-calls" />
                      <Label htmlFor="comm-calls">Scheduled Calls</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedbackStyle">Typical Feedback Style</Label>
                  <Select value={formData.feedbackStyle} onValueChange={(value) => handleSelectChange('feedbackStyle', value)}>
                    <SelectTrigger id="feedbackStyle"><SelectValue placeholder="Select your feedback style" /></SelectTrigger>
                    <SelectContent>{feedbackStyleOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                 <div className="md:col-span-2 space-y-3">
                    <Label>Typical Project Types</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-md bg-muted/50">
                        {projectTypeOptions.map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox 
                                id={item.id}
                                checked={formData.projectTypes.includes(item.id)}
                                onCheckedChange={(checked) => handleProjectTypeChange(item.id, !!checked)}
                            />
                            <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
               <div className="space-y-2 mt-6">
                  <Label htmlFor="notesForDesigners">General Notes for Designers</Label>
                  <Textarea id="notesForDesigners" value={formData.notesForDesigners} onChange={handleChange} placeholder="Any other important info? (e.g., 'We prefer to receive updates every 2 days', 'Please avoid using cursive fonts')" />
                </div>
            </section>


          </CardContent>
          <CardFooter className="border-t pt-6">
             <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
