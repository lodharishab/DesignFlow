
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { Megaphone, History } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Announcement {
    id: string;
    message: string;
    sentDate: Date;
    sentBy: string;
}

const mockAnnouncements: Announcement[] = [
  { id: 'ann001', message: 'Welcome to the new DesignFlow platform! We are excited to have you on board. Explore our new services and features.', sentDate: new Date('2024-07-10T10:00:00Z'), sentBy: 'Admin' },
  { id: 'ann002', message: 'Scheduled maintenance this Saturday at 2 AM IST for 30 minutes. The platform may be temporarily unavailable.', sentDate: new Date('2024-07-15T15:30:00Z'), sentBy: 'Admin' },
  { id: 'ann003', message: 'New "Motion Graphics" service category has been added! Check out the amazing new animated video services offered by our top designers.', sentDate: new Date(), sentBy: 'Admin' },
].sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime()); // Ensure newest is first

export default function AdminAnnouncementsPage() {
  const [announcement, setAnnouncement] = useState('');
  const [sentAnnouncements, setSentAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const { toast } = useToast();

  const handleSendAnnouncement = () => {
    if (!announcement.trim()) return;
    const newAnnouncement: Announcement = {
      id: `ann${Date.now()}`,
      message: announcement,
      sentDate: new Date(),
      sentBy: 'Admin',
    };
    setSentAnnouncements(prev => [newAnnouncement, ...prev]);
    toast({ title: "Announcement Sent (Simulated)", description: `Your announcement has been broadcast to all users.`});
    setAnnouncement('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Megaphone className="mr-3 h-8 w-8 text-primary" />
        Announcements
      </h1>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle>Broadcast Announcement</CardTitle>
            <CardDescription>Send a message to all users on the platform. Use with caution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="announcement-message">Announcement Message</Label>
                <Textarea id="announcement-message" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="e.g., New feature update: You can now... " rows={8}/>
            </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSendAnnouncement}><Megaphone className="mr-2 h-4 w-4"/>Send to All Users</Button>
            </CardFooter>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center"><History className="mr-2 h-5 w-5 text-primary"/>Announcement History</CardTitle>
                <CardDescription>A log of previously sent platform-wide announcements.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[420px] pr-4">
                    <div className="space-y-4">
                    {sentAnnouncements.length > 0 ? sentAnnouncements.map(ann => (
                        <div key={ann.id} className="p-3 border rounded-md bg-secondary/30">
                            <p className="text-sm text-foreground">{ann.message}</p>
                            <p className="text-xs text-muted-foreground mt-2" title={format(ann.sentDate, 'PPpp')}>
                                Sent: {formatDistanceToNow(ann.sentDate, { addSuffix: true })} by {ann.sentBy}
                            </p>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-10">No announcements have been sent yet.</p>
                    )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
