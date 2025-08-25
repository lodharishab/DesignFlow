
"use client";

import { useState, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Megaphone, History, Eye, Send, Loader2, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { generateAnnouncement } from '@/ai/flows/announcement-flow';
import type { AnnouncementRequest, AnnouncementResponse } from '@/ai/flows/announcement-types';


type AudienceType = 'all' | 'role' | 'user';
type ScheduleType = 'now' | 'later';
type AnnouncementStatus = 'Sent' | 'Scheduled' | 'Draft';

interface Announcement {
  id: string;
  title: string;
  audience: string;
  status: AnnouncementStatus;
  scheduledTime: Date;
  message: string;
}

const mockAnnouncements: Announcement[] = [
  { id: 'ann001', title: 'New Feature: Brand Profiles!', audience: 'All Users', status: 'Sent', scheduledTime: new Date('2024-07-10T10:00:00'), message: 'We have just launched Brand Profiles for clients! You can now save your brand information to help designers understand your needs better.' },
  { id: 'ann002', title: 'Diwali Campaign Reminder', audience: 'Designers', status: 'Sent', scheduledTime: new Date('2024-07-05T15:30:00'), message: 'A reminder to all designers: The Diwali campaign submission deadline is approaching. Please ensure all your related projects are on track.' },
  { id: 'ann003', title: 'Scheduled Maintenance', audience: 'All Users', status: 'Scheduled', scheduledTime: new Date('2024-08-28T18:00:00'), message: 'The platform will be down for scheduled maintenance for approximately 30 minutes. We apologize for any inconvenience.' },
];

function AiAssistDialog({ onAccept }: { onAccept: (content: AnnouncementResponse) => void }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AnnouncementResponse | null>(null);
  const { toast } = useToast();
  const quickPrompts = ["New feature release", "Scheduled maintenance", "Holiday campaign", "Policy update"];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Prompt is empty", description: "Please enter what you want to announce.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const result = await generateAnnouncement({ topic: prompt });
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
        <DialogTitle className="font-headline text-2xl flex items-center"><Wand2 className="mr-3 h-6 w-6 text-primary"/> AI Announcement Assistant</DialogTitle>
        <DialogDescription>Describe the announcement topic, and let AI draft a title and message for you.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="ai-prompt">What do you want to announce?</Label>
          <Input id="ai-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Launching a new dashboard for designers" />
          <div className="flex flex-wrap gap-2 pt-2">
            {quickPrompts.map(p => (
              <Button key={p} variant="outline" size="sm" onClick={() => setPrompt(p)}>{p}</Button>
            ))}
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </Button>
        
        {generatedContent && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Suggested Content:</h3>
            <div className="space-y-1">
              <Label>Generated Title</Label>
              <p className="p-3 border rounded-md bg-muted text-sm">{generatedContent.title}</p>
            </div>
            <div className="space-y-1">
              <Label>Generated Message</Label>
              <p className="p-3 border rounded-md bg-muted text-sm whitespace-pre-wrap">{generatedContent.message}</p>
            </div>
          </div>
        )}
         <p className="text-xs text-muted-foreground flex items-center pt-2">
            <AlertCircle className="h-3 w-3 mr-1.5"/>Powered by AI — please review carefully before sending.
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


export default function AdminAnnouncementsPage(): ReactElement {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  
  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audienceType, setAudienceType] = useState<AudienceType>('all');
  const [selectedRole, setSelectedRole] = useState('');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('now');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);

  const getAudienceDisplay = () => {
    switch (audienceType) {
      case 'role': return selectedRole || 'Specific Role';
      case 'user': return 'Specific User (Not Implemented)';
      default: return 'All Users';
    }
  };

  const handleSendAnnouncement = () => {
    if (!title || !message) {
        toast({ title: "Error", description: "Title and message cannot be empty.", variant: "destructive"});
        return;
    }
    setIsSending(true);
    const newAnnouncement: Announcement = {
        id: `ann${Date.now()}`,
        title,
        message,
        audience: getAudienceDisplay(),
        status: scheduleType === 'now' ? 'Sent' : 'Scheduled',
        scheduledTime: scheduleType === 'now' ? new Date() : scheduledDate || new Date(),
    };
    console.log("Sending announcement:", newAnnouncement);
    setTimeout(() => {
        setAnnouncements(prev => [newAnnouncement, ...prev].sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime()));
        setTitle('');
        setMessage('');
        toast({ title: "Announcement Sent (Simulated)", description: `Your message "${title}" has been sent/scheduled.`});
        setIsSending(false);
    }, 1000);
  };
  
  const getStatusBadgeVariant = (status: AnnouncementStatus) => {
    switch(status) {
        case 'Sent': return 'default';
        case 'Scheduled': return 'secondary';
        case 'Draft': return 'outline';
    }
  };
  
  const handleAcceptAiContent = (content: AnnouncementResponse) => {
    setTitle(content.title);
    setMessage(content.message);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Megaphone className="mr-3 h-8 w-8 text-primary" />
        Platform Announcements
      </h1>
      
      {/* Create Announcement Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Send className="mr-2 h-5 w-5"/> Create Announcement</CardTitle>
          <CardDescription>Compose and send a new message to your users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="announcement-title">Title</Label>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary" size="sm"><Wand2 className="mr-1.5 h-4 w-4"/> AI Assist</Button>
                    </DialogTrigger>
                    <AiAssistDialog onAccept={handleAcceptAiContent} />
                </Dialog>
            </div>
            <Input id="announcement-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., New Features Live!" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcement-message">Message</Label>
            <Textarea id="announcement-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your announcement here..." rows={4} />
          </div>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <Label>Audience</Label>
              <RadioGroup value={audienceType} onValueChange={(v) => setAudienceType(v as AudienceType)} className="flex space-x-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="aud-all" /><Label htmlFor="aud-all">All Users</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="role" id="aud-role" /><Label htmlFor="aud-role">By Role</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="user" id="aud-user" disabled /><Label htmlFor="aud-user" className="opacity-50">By User (Soon)</Label></div>
              </RadioGroup>
              {audienceType === 'role' && (
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger><SelectValue placeholder="Select a role..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Designers">Designers</SelectItem>
                    <SelectItem value="Clients">Clients</SelectItem>
                    <SelectItem value="Admins">Admins</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-3">
              <Label>Schedule</Label>
              <RadioGroup value={scheduleType} onValueChange={(v) => setScheduleType(v as ScheduleType)} className="flex space-x-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="now" id="sch-now" /><Label htmlFor="sch-now">Send Now</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="later" id="sch-later" /><Label htmlFor="sch-later">Schedule for Later</Label></div>
              </RadioGroup>
              {scheduleType === 'later' && (
                <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    className="rounded-md border"
                    />
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><Eye className="mr-2 h-4 w-4"/> Preview</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl flex items-center"><Megaphone className="mr-3 h-6 w-6"/> Announcement Preview</DialogTitle>
                <DialogDescription>This is how the announcement will appear to users.</DialogDescription>
              </DialogHeader>
              <div className="p-4 border rounded-lg bg-secondary/50">
                <h3 className="font-bold text-lg mb-2">{title || "Your Title Here"}</h3>
                <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{message || "Your message content will appear here."}</p>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSendAnnouncement} disabled={isSending}>
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
            {isSending ? 'Sending...' : 'Send Announcement'}
          </Button>
        </CardFooter>
      </Card>

      {/* Announcement History */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><History className="mr-2 h-5 w-5"/> Announcement History</CardTitle>
          <CardDescription>A log of all past and scheduled announcements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map(ann => (
                <TableRow key={ann.id}>
                  <TableCell className="font-medium">{ann.title}</TableCell>
                  <TableCell><Badge variant="outline">{ann.audience}</Badge></TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(ann.status)}>{ann.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(ann.scheduledTime, 'PPp')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    