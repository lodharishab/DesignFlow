
"use client";

import { useState, type FormEvent, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Save, Building, Globe, Users, Palette, Paintbrush, MessageCircle, FileText, Loader2, Info, UploadCloud, Link as LinkIcon, Eye, CheckCircle, X, History, CloudUpload, Tag, Wand2, Lightbulb, Type, Droplets, PlusCircle, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { saveBrandKits, getBrandKits, type BrandProfileFormData } from '@/lib/brand-profile-db';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect';
import { Badge } from '@/components/ui/badge';
import { generateBrandSuggestions } from '@/ai/flows/brand-suggestions-flow';
import type { BrandSuggestionsResponse } from '@/ai/flows/brand-suggestions-types';

const industryOptions = ["Technology", "Retail/E-commerce", "Healthcare", "Education", "Hospitality/Travel", "Real Estate", "Finance", "Manufacturing", "Non-profit", "Creative Arts", "Other"];
const companySizeOptions = ["Solo / Freelancer", "1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"];
const feedbackStyleOptions = ["Direct & Concise", "Detailed & Explanatory", "Collaborative Discussion", "Visual Examples Preferred"];
const suggestedTags = ["Minimal", "Luxury", "Fun", "Bold", "Elegant", "Professional", "Youthful", "Corporate", "Feminine", "Masculine"];

const BLANK_FORM_DATA: Omit<BrandProfileFormData, 'id'> = {
  companyName: "", companyWebsite: "", industry: "", targetAudience: "",
  brandValues: "", preferredDesignStyle: "", colorsToUse: "", colorsToAvoid: "",
  communicationPreference: "Platform Chat", feedbackStyle: "",
  notesForDesigners: "", brandGuidelinesLink: "", existingAssetsLink: "", tags: []
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';


function BrandKitForm({
  initialData,
  onSave,
  onCancel,
  saveStatus
}: {
  initialData: BrandProfileFormData;
  onSave: (data: BrandProfileFormData) => void;
  onCancel: () => void;
  saveStatus: SaveStatus;
}) {
  const [formData, setFormData] = useState<BrandProfileFormData>(initialData);
  const [tagInput, setTagInput] = useState('');

  useDebouncedEffect(() => {
    // Only auto-save if there's an actual change from the initial data passed in
    if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
      onSave(formData);
    }
  }, [formData], { delay: 1500 });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof BrandProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddTag = (tagToAdd: string) => {
    const newTag = tagToAdd.trim();
    if (newTag && !(formData.tags || []).includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tagToRemove) }));
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
      setTagInput('');
    }
  };

  const handleManualSave = () => {
    onSave(formData);
  }

  return (
     <Card className="shadow-lg mt-6">
        <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{initialData.id === 'new' ? 'Create New Brand Kit' : `Editing: ${initialData.companyName || 'Untitled Brand'}`}</CardTitle>
           <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {saveStatus === 'saving' && <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>}
              {saveStatus === 'saved' && <><CheckCircle className="h-4 w-4 text-green-500" /> Saved</>}
              {saveStatus === 'error' && <><X className="h-4 w-4 text-destructive" /> Error</>}
            </div>
        </div>
        <CardDescription>
            Provide details to help designers understand your brand. All changes are saved automatically.
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
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
            </div>
            </section>

            <Separator />

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
                  <div className="p-3 border rounded-md bg-muted/50">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(formData.tags || []).map(tag => (
                        <Badge key={tag} variant="default" className="text-sm">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="ml-1.5 rounded-full hover:bg-primary-foreground/20 p-0.5">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="tag-input"
                      placeholder="Add a custom tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                    />
                    <p className="text-xs text-muted-foreground mt-2">Suggested tags:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                       {suggestedTags.filter(st => !(formData.tags || []).includes(st)).map(tag => (
                        <Button key={tag} type="button" size="sm" variant="outline" onClick={() => handleAddTag(tag)}>
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
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
            <section>
                <h2 className="text-xl font-semibold font-headline mb-4 flex items-center"><CloudUpload className="mr-2 h-5 w-5 text-primary" />Brand Assets</h2>
                <div className="grid md:grid-cols-1 gap-6">
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
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="button" onClick={handleManualSave}>
                <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
        </CardFooter>
    </Card>
  )
}

export default function BrandProfilePage() {
  const { toast } = useToast();
  const [allBrandKits, setAllBrandKits] = useState<BrandProfileFormData[]>([]);
  const [editingKitId, setEditingKitId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    const loadData = async () => {
      const savedData = await getBrandKits();
      setAllBrandKits(savedData);
      setIsLoaded(true);
    };
    loadData();
  }, []);

  const handleSaveKit = async (updatedKitData: BrandProfileFormData) => {
    setSaveStatus('saving');
    try {
        let updatedKits: BrandProfileFormData[];
        if (updatedKitData.id === 'new') {
            const newKit = { ...updatedKitData, id: `kit_${Date.now()}` };
            updatedKits = [...allBrandKits, newKit];
            setEditingKitId(newKit.id); // Switch to editing the newly created kit
        } else {
            updatedKits = allBrandKits.map(kit => kit.id === updatedKitData.id ? updatedKitData : kit);
        }
        await saveBrandKits(updatedKits);
        setAllBrandKits(updatedKits);
        setSaveStatus('saved');
    } catch (error) {
        setSaveStatus('error');
        toast({ title: "Save Failed", description: "An error occurred while saving.", variant: "destructive" });
    }
  }

  const handleAddNew = () => {
    setEditingKitId('new');
  }

  const handleCancelEdit = () => {
    setEditingKitId(null);
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (saveStatus === 'saved' || saveStatus === 'error') {
      timer = setTimeout(() => setSaveStatus('idle'), 2000);
    }
    return () => clearTimeout(timer);
  }, [saveStatus]);

  if (!isLoaded) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Loading your brand kits...</p>
        </div>
    );
  }

  const kitBeingEdited = editingKitId === 'new' 
    ? { id: 'new', ...BLANK_FORM_DATA } 
    : allBrandKits.find(kit => kit.id === editingKitId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Sparkles className="mr-3 h-8 w-8 text-primary" />
          My Brand Kits
        </h1>
        <Button onClick={handleAddNew} disabled={!!editingKitId}>
            <PlusCircle className="mr-2 h-4 w-4"/> Add New Brand Kit
        </Button>
      </div>

      {!editingKitId && (
        <Card>
            <CardHeader>
                <CardTitle>Your Saved Brands</CardTitle>
                <CardDescription>Manage your different brand profiles here. You can add more for different projects or businesses.</CardDescription>
            </CardHeader>
            <CardContent>
                {allBrandKits.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven't created any brand kits yet.</p>
                        <Button variant="link" onClick={handleAddNew}>Create your first one</Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allBrandKits.map(kit => (
                            <Card key={kit.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">{kit.companyName || 'Untitled Brand'}</CardTitle>
                                    <Building className="h-5 w-5 text-muted-foreground"/>
                                </CardHeader>
                                <CardFooter>
                                    <Button variant="outline" size="sm" onClick={() => setEditingKitId(kit.id)}>
                                        <Edit className="h-4 w-4 mr-2"/> Edit
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      )}

      {kitBeingEdited && (
        <BrandKitForm 
          initialData={kitBeingEdited} 
          onSave={handleSaveKit}
          onCancel={handleCancelEdit}
          saveStatus={saveStatus}
        />
      )}
    </div>
  );
}
