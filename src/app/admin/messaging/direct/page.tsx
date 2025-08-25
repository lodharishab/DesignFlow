
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, Bot, User, Users } from 'lucide-react';
import { initialUsersData } from '@/app/admin/users/page'; // Using mock user data
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  avatarUrl: string;
  avatarHint: string;
  roles: string[];
}

interface Message {
    sender: 'Admin' | string; // Admin or user's name
    text: string;
    timestamp: string;
    avatar?: string;
    avatarHint?: string;
}

const mockConversations: Record<string, Message[]> = {
    'usr001': [
        { sender: 'Priya Sharma', text: 'Hi, I have a question about my last order.', timestamp: '10:30 AM', avatar: initialUsersData.find(u=>u.id==='usr001')?.avatarUrl, avatarHint: 'woman avatar' },
        { sender: 'Admin', text: 'Hello Priya, how can I help you today?', timestamp: '10:31 AM' },
    ],
    'usr002': [
        { sender: 'Rohan Kapoor', text: 'My payout seems delayed.', timestamp: 'Yesterday', avatar: initialUsersData.find(u=>u.id==='usr002')?.avatarUrl, avatarHint: 'man avatar' },
    ],
};


export default function AdminDirectMessagesPage() {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim() || !activeUser) return;
    toast({ title: "Message Sent (Simulated)", description: `Your message to ${activeUser.name} has been sent.`});
    setMessage('');
    // In a real app, you'd add the message to the conversation state and send it to the backend.
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Users className="mr-3 h-8 w-8 text-primary" />
        Direct Messages
      </h1>

      <Card className="shadow-lg h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
            <div className="border-r flex flex-col h-full">
            <div className="p-3 border-b">
                <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9"/>
                </div>
            </div>
            <ScrollArea className="flex-grow">
                {initialUsersData.map(user => (
                    <button key={user.id} onClick={() => setActiveUser(user)} className={cn("w-full text-left p-3 flex items-center gap-3 hover:bg-accent", activeUser?.id === user.id && 'bg-accent')}>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                        <AvatarFallback>{user.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.roles.join(', ')}</p>
                    </div>
                    </button>
                ))}
            </ScrollArea>
            </div>
            <div className="flex flex-col h-full">
            {activeUser ? (
                <>
                <CardHeader className="flex-row items-center gap-3 border-b">
                    <Avatar>
                    <AvatarImage src={activeUser.avatarUrl} alt={activeUser.name} data-ai-hint={activeUser.avatarHint} />
                    <AvatarFallback>{activeUser.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <CardTitle>{activeUser.name}</CardTitle>
                    <CardDescription>{activeUser.id}</CardDescription>
                    </div>
                </CardHeader>
                <ScrollArea className="flex-grow p-6 space-y-4">
                    {(mockConversations[activeUser.id] || []).map((msg, idx) => (
                        <div key={idx} className={cn("flex items-end gap-2", msg.sender === 'Admin' ? 'justify-end' : '')}>
                            {msg.sender !== 'Admin' && <Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} data-ai-hint={msg.avatarHint} /><AvatarFallback><User/></AvatarFallback></Avatar>}
                            <div className={cn("max-w-[70%] rounded-lg px-3 py-2 text-sm", msg.sender === 'Admin' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                <p>{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                            </div>
                            {msg.sender === 'Admin' && <Avatar className="h-8 w-8"><AvatarFallback><Bot/></AvatarFallback></Avatar>}
                        </div>
                    ))}
                </ScrollArea>
                <CardFooter className="pt-6 border-t">
                    <div className="flex w-full items-center space-x-2">
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Message ${activeUser.name}...`} />
                    <Button onClick={handleSendMessage}><Send className="h-4 w-4"/></Button>
                    </div>
                </CardFooter>
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">Select a user to start chatting.</div>
            )}
            </div>
        </div>
        </Card>
    </div>
  );
}
