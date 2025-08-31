
"use client";

import * as React from 'react';
import { useState, type ReactElement, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Bell, PackageSearch, Briefcase, UserCircle, Palette, Link as LinkIconLucide, AlertTriangle, Search, Calendar as CalendarIcon, Archive, ArchiveRestore, Mail, MailOpen } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Icon as LucideIconType } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


type NotificationType = 'New Order' | 'Revision Request' | 'Order Approved' | 'Category Approved' | 'Category Rejected' | 'Message';
type NotificationPriority = 'High' | 'Medium' | 'Low';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedOrderId?: string;
  relatedPortfolioId?: string;
  priority: NotificationPriority;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
}

const mockNotifications: Notification[] = [
  { id: 'notif_1', type: 'Revision Request', title: 'Revision Request on ORD9274R', message: "Client Riya Sen has requested revisions for the 'Wedding Invitation Design' project.", relatedOrderId: 'ORD9274R', priority: 'High', isRead: false, isArchived: false, createdAt: new Date(new Date().setHours(new Date().getHours() - 1)) },
  { id: 'notif_2', type: 'New Order', title: 'New Order: Mobile App Icon Set', message: 'You have been assigned to order ORD4011M by client Mohan Das.', relatedOrderId: 'ORD4011M', priority: 'Medium', isRead: false, isArchived: false, createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
  { id: 'notif_3', type: 'Category Approved', title: 'Category Approved: Packaging Design', message: 'Your request to be approved for the Packaging Design category has been successful. You will now receive project alerts.', priority: 'Low', isRead: true, isArchived: false, createdAt: new Date(new Date().setDate(new Date().getDate() - 2)) },
  { id: 'notif_4', type: 'Order Approved', title: 'Order Approved: ORD2945S', message: 'Client Sunita Rao has approved the final delivery for your project.', relatedOrderId: 'ORD2945S', priority: 'Low', isRead: true, isArchived: true, createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
  { id: 'notif_5', type: 'Message', title: 'New Message from Client', message: 'Client Riya Sen sent a message regarding ORD9274R.', relatedOrderId: 'ORD9274R', priority: 'Medium', isRead: true, isArchived: false, createdAt: new Date(new Date().setDate(new Date().getDate() - 4)) },
  { id: 'notif_6', type: 'Category Rejected', title: 'Category Request Update', message: 'Your request for Motion Graphics was not approved at this time.', priority: 'Low', isRead: true, isArchived: true, createdAt: new Date(new Date().setDate(new Date().getDate() - 5)) },
];


const uniqueNotificationTypes = Array.from(new Set(mockNotifications.map(n => n.type)));
const uniquePriorities: NotificationPriority[] = ['High', 'Medium', 'Low'];

function NotificationsTab() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | NotificationType>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | NotificationPriority>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unread' | 'Archived'>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      // Main filter for archived vs. active notifications
      if (statusFilter === 'Archived') {
          if (!notification.isArchived) return false;
      } else {
          if (notification.isArchived) return false;
          // Sub-filter for unread if not in archived view
          if (statusFilter === 'Unread' && notification.isRead) return false;
      }

      if (typeFilter !== 'All' && notification.type !== typeFilter) return false;
      if (priorityFilter !== 'All' && notification.priority !== priorityFilter) return false;
      if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (dateRange?.from && notification.createdAt < dateRange.from) return false;
      if (dateRange?.to && notification.createdAt > dateRange.to) return false;
      return true;
    }).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [notifications, statusFilter, typeFilter, priorityFilter, searchTerm, dateRange]);

  const getPriorityBadgeVariant = (priority: NotificationPriority): 'destructive' | 'secondary' | 'default' => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
    }
  };

  const getNotificationIcon = (type: NotificationType): LucideIconType => {
      switch(type) {
          case 'New Order': return Briefcase;
          case 'Revision Request': return AlertTriangle;
          case 'Order Approved': return UserCircle;
          case 'Category Approved': return Palette;
          default: return Bell;
      }
  };
  
  const getNotificationLink = (notification: Notification): string | null => {
    if (notification.relatedOrderId) return `/designer/orders/${notification.relatedOrderId}`;
    if (notification.relatedPortfolioId) return `/designer/portfolio/edit/${notification.relatedPortfolioId}`;
    return null;
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log('Logging notification interaction (simulated):', {
      notificationId: notification.id,
      designerId: 'current_user_id_placeholder',
      timestamp: new Date().toISOString(),
    });

    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    
    const link = getNotificationLink(notification);
    if (link) {
      router.push(link);
    } else {
        toast({
            title: "Informational Alert",
            description: "This notification is for your information and has no direct action.",
        });
    }
  };

  const handleArchiveToggle = (e: React.MouseEvent, notificationId: string, archive: boolean) => {
      e.stopPropagation(); // Prevent the main card click handler
      setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isArchived: archive } : n)
      );
      toast({
          title: `Notification ${archive ? 'Archived' : 'Unarchived'}`,
          description: `The notification has been moved to your ${archive ? 'archive' : 'inbox'}.`,
      });
  };
  
  const handleToggleRead = (e: React.MouseEvent, notificationId: string, isRead: boolean) => {
    e.stopPropagation(); // Prevent card click
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead } : n)
    );
    toast({
        title: `Notification marked as ${isRead ? 'read' : 'unread'}`,
    });
  };

  return (
     <div className="space-y-4">
       <div className="p-2 border rounded-lg bg-card space-y-2">
            <div className="flex flex-wrap items-center gap-2 px-2 pt-2">
                <Button variant={statusFilter === 'All' ? 'secondary' : 'ghost'} size="sm" className="rounded-full" onClick={() => setStatusFilter('All')}>Inbox</Button>
                <Button variant={statusFilter === 'Unread' ? 'secondary' : 'ghost'} size="sm" className="rounded-full" onClick={() => setStatusFilter('Unread')}>Unread</Button>
                <Button variant={statusFilter === 'Archived' ? 'secondary' : 'ghost'} size="sm" className="rounded-full" onClick={() => setStatusFilter('Archived')}>Archived</Button>
            </div>
            <div className="p-2 flex flex-wrap items-center gap-2 border-t">
                <div className="relative flex-grow min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search notifications..." className="pl-9 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                 <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                    <SelectTrigger className="h-9 w-full sm:w-auto min-w-[150px]"><SelectValue placeholder="Filter by type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        {uniqueNotificationTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
                    <SelectTrigger className="h-9 w-full sm:w-auto min-w-[150px]"><SelectValue placeholder="Filter by priority" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Priorities</SelectItem>
                        {uniquePriorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-9 w-full sm:w-auto min-w-[150px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Pick a date range</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                    </PopoverContent>
                </Popover>
            </div>
       </div>
        
        {filteredNotifications.length > 0 ? (
          <TooltipProvider>
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <Card 
                    key={notification.id} 
                    className={cn(
                      "transition-all hover:shadow-md cursor-pointer group", 
                      !notification.isRead && statusFilter !== 'Archived' && "bg-primary/5 border-primary/20"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-3 flex items-start gap-3">
                      <div className={cn("p-1.5 rounded-full mt-1", !notification.isRead ? "bg-primary/10" : "bg-muted")}>
                          {React.createElement(getNotificationIcon(notification.type), { className: cn("h-5 w-5", !notification.isRead ? "text-primary" : "text-muted-foreground") })}
                      </div>
                      <div className="flex-grow">
                          <p className="font-semibold pr-12">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge variant={getPriorityBadgeVariant(notification.priority)}>{notification.priority}</Badge>
                         <div className="flex items-center bg-background/50 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm mt-auto">
                           <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => handleToggleRead(e, notification.id, !notification.isRead)}
                                >
                                    {notification.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>{notification.isRead ? 'Mark as Unread' : 'Mark as Read'}</p></TooltipContent>
                           </Tooltip>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={(e) => handleArchiveToggle(e, notification.id, !notification.isArchived)}
                                  >
                                      {notification.isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                                  </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{notification.isArchived ? 'Unarchive' : 'Archive'}</p>
                              </TooltipContent>
                           </Tooltip>
                         </div>
                      </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TooltipProvider>
        ) : (
             <Card className="text-center py-16 shadow-lg border-dashed">
                <CardContent className="space-y-4">
                    <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground opacity-50" />
                    <h2 className="text-2xl font-semibold font-headline">No Notifications Found</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                    There are no notifications matching your current filters.
                    </p>
                </CardContent>
            </Card>
        )}
     </div>
  );
}

function ChatsTab() {
  return (
    <Card className="text-center py-16 shadow-lg">
      <CardContent className="space-y-4">
        <MessageSquare className="mx-auto h-20 w-20 text-muted-foreground opacity-50" />
        <h2 className="text-2xl font-semibold font-headline">1-on-1 Chats Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          A dedicated interface to manage all your project communications with clients will be available here.
        </p>
      </CardContent>
    </Card>
  );
}


export default function DesignerMessagesPage(): ReactElement {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline flex items-center">
                <MessageSquare className="mr-3 h-8 w-8 text-primary" />
                Messaging Center
            </h1>

            <Tabs defaultValue="notifications" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chats">
                        <MessageSquare className="mr-2 h-4 w-4"/> Chats
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4"/> Notifications
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="chats" className="mt-6">
                   <ChatsTab />
                </TabsContent>
                <TabsContent value="notifications" className="mt-6">
                    <NotificationsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
