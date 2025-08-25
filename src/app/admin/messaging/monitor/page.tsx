
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Search, User } from 'lucide-react';
import { initialUsersData } from '@/app/admin/users/page'; // Using mock user data
import { initialOrdersData } from '@/components/admin/orders/orders-table-view'; // Using mock order data
import { cn } from '@/lib/utils';

interface Message {
    sender: 'Admin' | string; // Admin or user's name
    text: string;
    timestamp: string;
    avatar?: string;
    avatarHint?: string;
}

const mockOrderChats: Record<string, Message[]> = {
    'ORD7361P': [
        { sender: 'Priya Sharma', text: 'Hi Rohan, the wireframes look great! Just a small suggestion for the footer.', timestamp: '2 days ago', avatar: initialUsersData.find(u=>u.id==='usr001')?.avatarUrl, avatarHint: 'woman avatar' },
        { sender: 'Rohan Kapoor', text: 'Sure Priya, thanks for the feedback. I will update it shortly.', timestamp: '2 days ago', avatar: initialUsersData.find(u=>u.id==='usr002')?.avatarUrl, avatarHint: 'man avatar' },
    ],
     'ORD9274R': [
        { sender: 'Riya Sen', text: 'The colors are a bit off, can we try something warmer?', timestamp: '5 days ago', avatar: initialUsersData.find(u=>u.id==='usr008')?.avatarUrl, avatarHint: 'indian woman customer' },
    ],
};

export default function AdminMonitorChatsPage() {
  const [activeOrderChat, setActiveOrderChat] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Eye className="mr-3 h-8 w-8 text-primary" />
        Monitor Chats
      </h1>
        <Card className="shadow-lg h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
            <div className="border-r flex flex-col h-full">
                <div className="p-3 border-b">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search orders or users..." className="pl-9"/>
                </div>
                </div>
                <ScrollArea className="flex-grow">
                    {initialOrdersData.filter(o => o.designerId).map(order => (
                        <button key={order.id} onClick={() => setActiveOrderChat(order.id)} className={cn("w-full text-left p-3 hover:bg-accent", activeOrderChat === order.id && 'bg-accent')}>
                            <p className="font-semibold truncate">{order.serviceName}</p>
                            <p className="text-xs text-muted-foreground">Order: {order.id}</p>
                            <p className="text-xs text-muted-foreground truncate">{order.clientName} &harr; {order.designerName}</p>
                        </button>
                    ))}
                </ScrollArea>
            </div>
            <div className="flex flex-col h-full">
            {activeOrderChat ? (
                <>
                    <CardHeader className="border-b">
                    <CardTitle>Conversation for Order {activeOrderChat}</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-grow p-6 space-y-4">
                        {(mockOrderChats[activeOrderChat] || []).map((msg, idx) => (
                        <div key={idx} className="flex items-end gap-2">
                            <Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} data-ai-hint={msg.avatarHint} /><AvatarFallback>{msg.sender.substring(0,1)}</AvatarFallback></Avatar>
                            <div className='bg-muted rounded-lg px-3 py-2 text-sm max-w-[80%]'>
                                <p className="font-semibold text-xs">{msg.sender}</p>
                                <p>{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                    </ScrollArea>
                </>
            ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">Select a conversation to view.</div>
            )}
            </div>
        </div>
        </Card>
    </div>
  );
}
