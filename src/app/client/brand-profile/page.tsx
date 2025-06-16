
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Save, Building, Globe, Users, Palette, Paintbrush, MessageCircle, FileText, Loader2, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

interface BrandProfileData {
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: string;
  targetAudience: string;
  brandValues: string;
  preferredDesignStyle: string;
  colorsToUse: string;
  colorsToAvoid: string;
  typicalProjectTypes: string;
  communicationPreference: string;
  feedbackStyle: string;
  notesForDesigners: string;
}

const industryOptions = ["Technology", "Retail/E-commerce", "Healthcare", "Education", "Hospitality/Travel", "Real Estate", "Finance", "Manufacturing", "Non-profit", "Creative Arts", "Other"];
const companySizeOptions = ["Solo / Freelancer", "1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"];
const designStyleOptions = ["Modern & Minimalist", "Classic & Elegant", "Playful & Fun", "Bold & Dynamic", "Rustic & Natural", "Tech & Futuristic", "Artistic & Illustrative", "Corporate & Formal", "Other"];
const feedbackStyleOptions = ["Direct & Concise", "Detailed & Explanatory", "Collaborative Discussion", "Visual Examples Preferred"];

export default function BrandProfilePage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<BrandProfileData>({
    companyName: "",
    companyWebsite: "",
    industry: "",
    companySize: "",
    targetAudience: "",
    brandValues: "",
    preferredDesignStyle: "",
    colorsToUse: "",
    colorsToAvoid: "",
    typicalProjectTypes: "",
    communicationPreference: "Platform Chat",
    feedbackStyle: "",
    notesForDesigners: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof BrandProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleRadioChange = (id: keyof BrandProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    console.log("Saving brand profile:", formData);
    setTimeout(() => {
      toast({
        title: "Brand Profile Saved (Simulated)",
        description: "Your brand information has been updated.",
      });
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
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Tell Us About Your Brand</CardTitle>
          <CardDescription>
            Providing these details helps designers understand your needs, style, and preferences better, leading to more effective collaborations.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            
            <section>
              <h2 className="text-xl font-semibold font-headline mb-4 flex items-center"><Building className="mr-2 h-5 w-5 text-primary" />Company & Industry</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
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

            <section>
              <h2 className="text-xl font-semibold font-headline mb-4 flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" />Brand Identity & Style</h2>
              <div className="grid md:grid-cols-1 gap-6">
                 <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea id="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Describe your typical customers/users (e.g., age, interests, location, needs)" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandValues">Brand Values (comma-separated)</Label>
                  <Input id="brandValues" value={formData.brandValues} onChange={handleChange} placeholder="e.g., Innovation, Trust, Community, Sustainability" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredDesignStyle">Preferred Design Style</Label>
                   <Select value={formData.preferredDesignStyle} onValueChange={(value) => handleSelectChange('preferredDesignStyle', value)}>
                    <SelectTrigger id="preferredDesignStyle"><SelectValue placeholder="Select a design style" /></SelectTrigger>
                    <SelectContent>{designStyleOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="colorsToUse">Preferred Colors (Optional, comma-separated)</Label>
                        <Input id="colorsToUse" value={formData.colorsToUse} onChange={handleChange} placeholder="e.g., #007bff, Dark Blue, Gold" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="colorsToAvoid">Colors to Avoid (Optional, comma-separated)</Label>
                        <Input id="colorsToAvoid" value={formData.colorsToAvoid} onChange={handleChange} placeholder="e.g., Bright Pink, Neon Green" />
                    </div>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold font-headline mb-4 flex items-center"><MessageCircle className="mr-2 h-5 w-5 text-primary" />Project & Communication Preferences</h2>
               <div className="space-y-2 mb-6">
                <Label htmlFor="typicalProjectTypes">Typical Project Types</Label>
                <Textarea id="typicalProjectTypes" value={formData.typicalProjectTypes} onChange={handleChange} placeholder="What kind of design work do you usually require? (e.g., social media posts, website banners, logo refinements)" rows={3} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Preferred Communication Method</Label>
                  <RadioGroup value={formData.communicationPreference} onValueChange={(value) => handleRadioChange('communicationPreference', value)} className="space-y-1">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Platform Chat" id="comm-chat" /><Label htmlFor="comm-chat" className="font-normal">Platform Chat</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Email" id="comm-email" /><Label htmlFor="comm-email" className="font-normal">Email</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Scheduled Calls" id="comm-calls" /><Label htmlFor="comm-calls" className="font-normal">Scheduled Calls</Label></div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedbackStyle">Preferred Feedback Style</Label>
                  <Select value={formData.feedbackStyle} onValueChange={(value) => handleSelectChange('feedbackStyle', value)}>
                    <SelectTrigger id="feedbackStyle"><SelectValue placeholder="Select feedback style" /></SelectTrigger>
                    <SelectContent>{feedbackStyleOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
               <div className="space-y-2 mt-6">
                <Label htmlFor="notesForDesigners">Important Notes for Designers (Optional)</Label>
                <Textarea id="notesForDesigners" value={formData.notesForDesigners} onChange={handleChange} placeholder="Anything else designers should know? (e.g., brand guidelines link, past project frustrations, things you love)" rows={3} />
              </div>
            </section>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Saving Brand Profile...' : 'Save Brand Profile'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
