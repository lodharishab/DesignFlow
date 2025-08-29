
"use client";

import * as React from 'react';
import { useState, type ReactElement } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Bell, PackageSearch, Briefcase, UserCircle, Palette, Link as LinkIconLucide, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Icon as LucideIconType } from 'lucide-react';

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
  createdAt: Date;
}

const mockNotifications: Notification[] = [
  { id: 'notif_1', type: 'Revision Request', title: 'Revision Request on ORD9274R', message: "Client Riya Sen has requested revisions for the 'Wedding Invitation Design' project.", relatedOrderId: 'ORD9274R', priority: 'High', isRead: false, createdAt: new Date(new Date().setHours(new Date().getHours() - 1)) },
  { id: 'notif_2', type: 'New Order', title: 'New Order: Mobile App Icon Set', message: 'You have been assigned to order ORD4011M by client Mohan Das.', relatedOrderId: 'ORD4011M', priority: 'Medium', isRead: false, createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
  { id: 'notif_3', type: 'Category Approved', title: 'Category Approved: Packaging Design', message: 'Your request to be approved for the Packaging Design category has been successful. You will now receive project alerts.', priority: 'Low', isRead: true, createdAt: new Date(new Date().setDate(new Date().getDate() - 2)) },
  { id: 'notif_4', type: 'Order Approved', title: 'Order Approved: ORD2945S', message: 'Client Sunita Rao has approved the final delivery for your project.', relatedOrderId: 'ORD2945S', priority: 'Low', isRead: true, createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
];


function NotificationsTab() {

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
  }

  const getNotificationLink = (notification: Notification) => {
    if (notification.relatedOrderId) return `/designer/orders/${notification.relatedOrderId}`;
    if (notification.relatedPortfolioId) return `/designer/portfolio/edit/${notification.relatedPortfolioId}`;
    return '#';
  };

  return (
     <div className="space-y-4">
        {mockNotifications.map(notification => (
           <Card key={notification.id} className={cn("transition-all hover:shadow-md", !notification.isRead && "bg-primary/5 border-primary/20")}>
               <CardContent className="p-4 flex items-start gap-4">
                   <div className={cn("p-2 rounded-full mt-1", !notification.isRead ? "bg-primary/10" : "bg-muted")}>
                       {React.createElement(getNotificationIcon(notification.type), { className: cn("h-5 w-5", !notification.isRead ? "text-primary" : "text-muted-foreground") })}
                   </div>
                   <div className="flex-grow">
                       <div className="flex justify-between items-center">
                           <p className="font-semibold">{notification.title}</p>
                           <Badge variant={getPriorityBadgeVariant(notification.priority)}>{notification.priority}</Badge>
                       </div>
                       <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                       <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</p>
                            <Button size="sm" variant="ghost" asChild>
                                <Link href={getNotificationLink(notification)}><LinkIconLucide className="mr-1.5 h-3.5 w-3.5" /> View Details</Link>
                            </Button>
                       </div>
                   </div>
               </CardContent>
           </Card>
        ))}
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
