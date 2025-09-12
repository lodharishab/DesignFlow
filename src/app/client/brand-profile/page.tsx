

"use client";

import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Save, Building, Globe, Users, Palette, Paintbrush, FileText, Loader2, UploadCloud, Link as LinkIcon, Eye, Font, MessageSquare as MessageSquareIcon, CheckSquare, Tag, X, Check, CheckboxIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { BrandProfileFormData, getBrandKits, saveBrandKits } from '@/lib/brand-profile-db';
import { Checkbox } from '@/components/ui/checkbox';


// Re-usable component for the preview
function BrandProfilePreview({ profile }: { profile: BrandProfileFormData }) {
  const parseColors = (colorString: string): string[] => {
    if (!colorString) return [];
    return colorString.split(',').map(color => color.trim()).filter(Boolean);
  };

  const preferredColors = parseColors(profile.colorsToUse);
  const avoidedColors = parseColors(profile.colorsToAvoid);

  return (
    <Card className="shadow-lg sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center"><Eye className="mr-2 h-5 w-5 text-primary"/> Live Preview</CardTitle>
        <CardDescription>This is how designers will see your brand essence.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          {profile.logoUrl && (
            <div className="relative h-20 w-20 shrink-0">
                <Image src={profile.logoUrl} alt="Brand Logo Preview" layout="fill" objectFit="contain" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-xl">{profile.companyName || 'Your Company Name'}</h3>
            <p className="text-sm text-muted-foreground">{profile.industry || 'Your Industry'}</p>
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="font-semibold mb-2">Brand Values</h4>
          <p className="text-sm text-muted-foreground italic">
            {profile.brandValues || 'e.g., Innovation, Trust, Community'}
          </p>
        </div>

        {(preferredColors.length > 0 || avoidedColors.length > 0) && <Separator />}

        {preferredColors.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Preferred Colors</h4>
            <div className="flex flex-wrap gap-2">
              {preferredColors.map((color, index) => (
                <div key={`pref-${index}`} className="h-8 w-8 rounded-full border" style={{ backgroundColor: color }}></div>
              ))}
            </div>
          </div>
        )}

        {avoidedColors.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Colors to Avoid</h4>
            <div className="flex flex-wrap gap-2">
              {avoidedColors.map((color, index) => (
                <div key={`avoid-${index}`} className="h-8 w-8 rounded-full border relative" style={{ backgroundColor: color }}>
                   <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                      <X className="h-5 w-5 text-white" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function BrandProfilePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BrandProfileFormData>({
    id: 'default',
    companyName: "", 
    companyWebsite: "", 
    industry: "",
    companySize: "", 
    targetAudience: "", 
    brandValues: "",
    tags: [], 
    preferredDesignStyle: "", 
    colorsToUse: "",
    colorsToAvoid: "", 
    communicationPreference: "Platform Chat",
    feedbackStyle: "", 
    notesForDesigners: "", 
    brandGuidelinesLink: "",
    existingAssetsLink: "", 
    logoUrl: null,
    projectTypes: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentTagInput, setCurrentTagInput] = useState('');

  // Auto-save logic
  useDebouncedEffect(
    () => {
      // Don't save the initial empty form
      if (formData.companyName || formData.industry) {
        setIsSaving(true);
        setIsSaved(false);
        // In a real app, this would be an API call.
        saveBrandKits([formData]).then(() => {
          setIsSaving(false);
          setIsSaved(true);
        });
      }
    },
    [formData],
    { delay: 1500 }
  );

  // Load data on initial render
  useEffect(() => {
    getBrandKits().then(kits => {
      if (kits.length > 0) {
        setFormData(kits[0]);
      }
    });
  }, []);

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

  const handleProjectTypeChange = (projectType: string, checked: boolean) => {
      setFormData(prev => {
          const newProjectTypes = new Set(prev.projectTypes);
          if(checked) {
              newProjectTypes.add(projectType);
          } else {
              newProjectTypes.delete(projectType);
          }
          return { ...prev, projectTypes: Array.from(newProjectTypes) };
      })
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTagInput.trim()) {
        e.preventDefault();
        const newTag = currentTagInput.trim();
        if (!formData.tags?.includes(newTag)) {
            setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
        }
        setCurrentTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
        ...prev,
        tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (files && files[0]) {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            if (id === 'brandLogo') {
              setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
            }
        };
        reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);
    saveBrandKits([formData]).then(() => {
        toast({ title: "Profile Saved", description: "Your brand profile has been successfully saved." });
        setIsSaving(false);
        setIsSaved(true);
    });
  };
  
  const industryOptions = ["Technology", "Retail/E-commerce", "Healthcare", "Education", "Hospitality/Travel", "Real Estate", "Finance", "Manufacturing", "Non-profit", "Creative Arts", "Other"];
  const companySizeOptions = ["Solo / Freelancer", "1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"];
  const feedbackStyleOptions = ["Direct & Concise", "Detailed & Explanatory", "Collaborative Discussion", "Visual Examples Preferred"];
  const suggestedTags = ["Minimal", "Luxury", "Fun", "Bold", "Elegant", "Professional", "Modern", "Classic", "Youthful"];
  const projectTypeOptions = ["Logo & Branding", "Website / App UI/UX", "Social Media Graphics", "Print Materials (Brochures, etc.)", "Packaging Design", "Illustrations & Art"];


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Sparkles className="mr-3 h-8 w-8 text-primary" />
          My Brand Profile
        </h1>
        <div className="flex items-center gap-2 text-sm">
            {isSaving && <><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> <span className="text-muted-foreground">Saving...</span></>}
            {isSaved && <><Check className="h-4 w-4 text-green-500" /> <span className="text-muted-foreground">Saved</span></>}
            <Button onClick={handleSubmit} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> Manual Save
            </Button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
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
                                        variant={(formData.tags || []).includes(tag) ? "default" : "secondary"}
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
                            {formData.tags && formData.tags.length > 0 && (
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
                            <Label htmlFor="colorsToUse">Preferred Colors (comma-separated hex codes)</Label>
                            <Input id="colorsToUse" value={formData.colorsToUse} onChange={handleChange} placeholder="e.g., #007bff, #343a40" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="colorsToAvoid">Colors to Avoid (comma-separated hex codes)</Label>
                            <Input id="colorsToAvoid" value={formData.colorsToAvoid} onChange={handleChange} placeholder="e.g., #ff00ff" />
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
                </div>
                 <div className="space-y-2 mt-6">
                    <Label>Typical Project Types</Label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 border rounded-md bg-muted/50">
                        {projectTypeOptions.map(projectType => (
                            <div key={projectType} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`project-${projectType.replace(/\s+/g, '-')}`} 
                                    checked={formData.projectTypes?.includes(projectType)}
                                    onCheckedChange={(checked) => handleProjectTypeChange(projectType, !!checked)}
                                />
                                <Label htmlFor={`project-${projectType.replace(/\s+/g, '-')}`} className="font-normal text-sm">{projectType}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2 mt-6">
                    <Label htmlFor="notesForDesigners">General Notes for Designers</Label>
                    <Textarea id="notesForDesigners" value={formData.notesForDesigners} onChange={handleChange} placeholder="Any other important info? (e.g., 'We prefer to receive updates every 2 days', 'Please avoid using cursive fonts')" />
                </div>
                </section>
            </CardContent>
            </Card>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-1">
            <BrandProfilePreview profile={formData} />
        </div>
      </div>
    </div>
  );
}
