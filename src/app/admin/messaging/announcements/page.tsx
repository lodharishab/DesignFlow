
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Megaphone, History, Users, UserCheck, Eye, Calendar as CalendarIcon, Clock, Send, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  { id: 'ann001', title: 'New Feature: Brand Profiles!', audience: 'All Users', status: 'Sent', scheduledTime: new Date(2024, 6, 10, 10, 0), message: 'We have just launched Brand Profiles for clients! You can now save your brand information to help designers understand your needs better.' },
  { id: 'ann002', title: 'Diwali Campaign Reminder', audience: 'Designers', status: 'Sent', scheduledTime: new Date(2024, 6, 5, 15, 30), message: 'A reminder to all designers: The Diwali campaign submission deadline is approaching. Please ensure all your related projects are on track.' },
  { id: 'ann003', title: 'Scheduled Maintenance', audience: 'All Users', status: 'Scheduled', scheduledTime: new Date('2024-08-28T18:00:00'), message: 'The platform will be down for scheduled maintenance for approximately 30 minutes. We apologize for any inconvenience.' },
];

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
        setAnnouncements(prev => [newAnnouncement, ...prev]);
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Megaphone className="mr-3 h-8 w-8 text-primary" />
        Platform Announcements
      </h1>
      
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: History */}
        <Card className="lg:col-span-3 shadow-lg">
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

        {/* Right Column: Create New */}
        <Card className="lg:col-span-2 shadow-lg sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center"><Send className="mr-2 h-5 w-5"/> Create Announcement</CardTitle>
             <CardDescription>Compose and send a new message to your users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="announcement-title">Title</Label>
              <Input id="announcement-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., New Features Live!" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcement-message">Message</Label>
              <Textarea id="announcement-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your announcement here..." rows={4} />
            </div>
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
          </CardContent>
          
          <CardFooter className="flex justify-between">
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
                        <p className="text-sm text-secondary-foreground">{message || "Your message content will appear here."}</p>
                    </div>
                </DialogContent>
            </Dialog>
            <Button onClick={handleSendAnnouncement} disabled={isSending}>
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                {isSending ? 'Sending...' : 'Send Announcement'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
