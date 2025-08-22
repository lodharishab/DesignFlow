
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { MessageSquare, Users, Eye, Megaphone, Send, Search, Bot, User } from 'lucide-react';
import { initialUsersData } from '@/app/admin/users/page'; // Using mock user data
import { initialOrdersData } from '@/components/admin/orders/orders-table-view'; // Using mock order data
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

const mockOrderChats: Record<string, Message[]> = {
    'ORD7361P': [
        { sender: 'Priya Sharma', text: 'Hi Rohan, the wireframes look great! Just a small suggestion for the footer.', timestamp: '2 days ago', avatar: initialUsersData.find(u=>u.id==='usr001')?.avatarUrl, avatarHint: 'woman avatar' },
        { sender: 'Rohan Kapoor', text: 'Sure Priya, thanks for the feedback. I will update it shortly.', timestamp: '2 days ago', avatar: initialUsersData.find(u=>u.id==='usr002')?.avatarUrl, avatarHint: 'man avatar' },
    ],
     'ORD9274R': [
        { sender: 'Riya Sen', text: 'The colors are a bit off, can we try something warmer?', timestamp: '5 days ago', avatar: initialUsersData.find(u=>u.id==='usr008')?.avatarUrl, avatarHint: 'indian woman customer' },
    ],
};

export default function AdminMessagingPage() {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeOrderChat, setActiveOrderChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim() || !activeUser) return;
    toast({ title: "Message Sent (Simulated)", description: `Your message to ${activeUser.name} has been sent.`});
    setMessage('');
    // In a real app, you'd add the message to the conversation state and send it to the backend.
  };

  const handleSendAnnouncement = () => {
    if (!announcement.trim()) return;
    toast({ title: "Announcement Sent (Simulated)", description: `Your announcement has been broadcast to all users.`});
    setAnnouncement('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <MessageSquare className="mr-3 h-8 w-8 text-primary" />
        Messaging Center
      </h1>

      <Tabs defaultValue="direct-message" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="direct-message"><Users className="mr-2 h-4 w-4"/>Direct Message</TabsTrigger>
          <TabsTrigger value="monitor-chats"><Eye className="mr-2 h-4 w-4"/>Monitor Chats</TabsTrigger>
          <TabsTrigger value="announcements"><Megaphone className="mr-2 h-4 w-4"/>Announcements</TabsTrigger>
        </TabsList>
        
        {/* Direct Message Tab */}
        <TabsContent value="direct-message">
          <Card className="shadow-lg h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
              <div className="border-r flex flex-col">
                <div className="p-3 border-b">
                   <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-9"/>
                   </div>
                </div>
                <ScrollArea>
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
        </TabsContent>

        {/* Monitor Chats Tab */}
        <TabsContent value="monitor-chats">
          <Card className="shadow-lg h-[70vh]">
             <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
                <div className="border-r flex flex-col">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search orders or users..." className="pl-9"/>
                    </div>
                  </div>
                  <ScrollArea>
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
        </TabsContent>
        
        {/* Announcements Tab */}
        <TabsContent value="announcements">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
