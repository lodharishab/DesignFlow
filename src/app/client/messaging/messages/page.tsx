
"use client";

import * as React from 'react';
import { useState, useMemo, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { MessagesSquare, Search, Pin, PinOff, Send, PanelLeftClose, ArrowLeft } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Mail, MailOpen, Archive } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// --- MOCK DATA & INTERFACES ---

interface Message {
  id: string;
  sender: 'client' | 'designer';
  text: string;
  timestamp: string;
}

interface Conversation {
  designerId: string;
  designerName: string;
  designerAvatarUrl: string;
  designerAvatarHint: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
  isPinned: boolean;
  messages: Message[];
}

const mockConversationsData: Conversation[] = [
  {
    designerId: 'des002',
    designerName: 'Rohan Kapoor',
    designerAvatarUrl: 'https://placehold.co/100x100.png',
    designerAvatarHint: 'indian man software developer',
    lastMessage: 'Sure, I can have the revised wireframes ready by tomorrow morning. Does that work for you?',
    lastMessageTimestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
    unreadCount: 2,
    isPinned: true,
    messages: [
      { id: 'msg1', sender: 'client', text: 'Hi Rohan, I had a quick question about the wireframes for the dashboard.', timestamp: '10:30 AM' },
      { id: 'msg2', sender: 'designer', text: 'Hey! Of course, ask away. Happy to clarify anything.', timestamp: '10:31 AM' },
      { id: 'msg3', sender: 'client', text: 'The new analytics section looks great, but could we add a date range filter at the top? I think that was missed from the brief.', timestamp: '10:33 AM' },
      { id: 'msg4', sender: 'designer', text: 'Good catch! You\'re right, I can definitely add that in. It\'s a quick addition.', timestamp: '10:34 AM' },
      { id: 'msg5', sender: 'designer', text: 'Sure, I can have the revised wireframes ready by tomorrow morning. Does that work for you?', timestamp: '10:35 AM' },
    ]
  },
  {
    designerId: 'des003',
    designerName: 'Aisha Khan',
    designerAvatarUrl: 'https://placehold.co/100x100.png',
    designerAvatarHint: 'indian woman graphic artist',
    lastMessage: 'Excellent! The campaign is performing well. Thanks for the quick turnaround.',
    lastMessageTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    unreadCount: 0,
    isPinned: false,
    messages: [
       { id: 'msg_a1', sender: 'client', text: 'Hi Aisha, thanks for the final social media graphics. They look perfect!', timestamp: 'Yesterday' },
       { id: 'msg_a2', sender: 'designer', text: 'You\'re welcome! Glad you liked them. Let me know if you need anything else.', timestamp: 'Yesterday' },
       { id: 'msg_a3', sender: 'client', text: 'Excellent! The campaign is performing well. Thanks for the quick turnaround.', timestamp: 'Yesterday' },
    ]
  },
  {
    designerId: 'des001',
    designerName: 'Priya Sharma',
    designerAvatarUrl: 'https://placehold.co/100x100.png',
    designerAvatarHint: 'indian woman designer smiling',
    lastMessage: 'Got it, I\'ll incorporate the feedback into the next round of logo concepts.',
    lastMessageTimestamp: new Date(new Date().setDate(new Date().getDate() - 3)),
    unreadCount: 0,
    isPinned: false,
    messages: [
       { id: 'msg_p1', sender: 'client', text: 'Hi Priya, I\'ve attached my feedback on the initial logo concepts.', timestamp: '3 days ago' },
       { id: 'msg_p2', sender: 'designer', text: 'Got it, I\'ll incorporate the feedback into the next round of logo concepts.', timestamp: '3 days ago' },
    ]
  },
];


// --- UTILITY COMPONENTS ---

function TimeAgo({ date }: { date: Date }) {
  const [timeAgo, setTimeAgo] = React.useState('');

  React.useEffect(() => {
    setTimeAgo(formatDistanceToNow(date, { addSuffix: true }));
    const interval = setInterval(() => {
        setTimeAgo(formatDistanceToNow(date, { addSuffix: true }));
    }, 60000);
    return () => clearInterval(interval);
  }, [date]);

  return <span title={date.toLocaleString()}>{timeAgo}</span>;
}


// --- CHAT COMPONENTS ---

function ConversationList({ 
    conversations, 
    selectedConversationId, 
    onSelect, 
    onTogglePin 
}: { 
    conversations: Conversation[], 
    selectedConversationId: string | null, 
    onSelect: (id: string) => void,
    onTogglePin: (e: React.MouseEvent, id: string) => void
}) {
    return (
        <ScrollArea className="flex-grow">
            <TooltipProvider>
                <div className="p-2 space-y-1">
                    {conversations.length > 0 ? conversations.map(convo => (
                        <div
                            key={convo.designerId}
                            className={cn(
                                "flex items-center gap-3 w-full text-left p-2 rounded-lg transition-colors relative group",
                                selectedConversationId === convo.designerId ? "bg-primary/10" : "hover:bg-muted/50 cursor-pointer"
                            )}
                             onClick={() => onSelect(convo.designerId)}
                        >
                            <Avatar className="h-12 w-12 shrink-0">
                                <AvatarImage src={convo.designerAvatarUrl} alt={convo.designerName} data-ai-hint={convo.designerAvatarHint} />
                                <AvatarFallback>{convo.designerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold truncate flex items-center">{convo.designerName}</p>
                                    <p className="text-xs text-muted-foreground shrink-0"><TimeAgo date={convo.lastMessageTimestamp} /></p>
                                </div>
                                <div className="flex justify-between items-start gap-2">
                                     <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                                    {convo.unreadCount > 0 && (
                                        <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs shrink-0">{convo.unreadCount}</Badge>
                                    )}
                                </div>
                            </div>
                             <div className="absolute top-1 right-1 flex items-center bg-background/70 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7" 
                                            onClick={(e) => onTogglePin(e, convo.designerId)}
                                        >
                                            {convo.isPinned ? <PinOff className="h-4 w-4 text-primary" /> : <Pin className="h-4 w-4" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top"><p>{convo.isPinned ? 'Unpin' : 'Pin to top'}</p></TooltipContent>
                                </Tooltip>
                             </div>
                        </div>
                    )) : (
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            No conversations match your search.
                        </div>
                    )}
                </div>
            </TooltipProvider>
        </ScrollArea>
    );
}

function ChatView({ conversation, onClose }: { conversation: Conversation | null, onClose: () => void }) {
    if (!conversation) {
        return (
            <div className="hidden md:flex h-full w-full flex-col items-center justify-center bg-muted/50 rounded-lg">
              <MessagesSquare className="h-20 w-20 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold">Select a Conversation</h2>
              <p className="text-muted-foreground">Choose a conversation from the left to view messages.</p>
            </div>
        );
    }

    return (
        <Card className="flex flex-col h-full w-full shadow-md">
             <CardHeader className="flex flex-row items-center gap-4 p-3 border-b bg-background sticky top-0 z-10">
                <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 md:hidden">
                    <ArrowLeft className="h-5 w-5" />
                 </Button>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.designerAvatarUrl} alt={conversation.designerName} data-ai-hint={conversation.designerAvatarHint} />
                    <AvatarFallback>{conversation.designerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <p className="font-semibold">{conversation.designerName}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                        <span className="relative flex h-2 w-2 mr-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Online
                    </p>
                </div>
                 <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 hidden md:flex">
                    <PanelLeftClose className="h-5 w-5" />
                 </Button>
            </CardHeader>
            <ScrollArea className="flex-grow p-4 space-y-6">
                 {conversation.messages.map(message => (
                    <div key={message.id} className={cn("flex items-end gap-2", message.sender === 'client' ? 'justify-end' : '')}>
                        {message.sender === 'designer' && (
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={conversation.designerAvatarUrl} alt={conversation.designerName} data-ai-hint={conversation.designerAvatarHint} />
                                <AvatarFallback>{conversation.designerName.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "rounded-lg px-3 py-2 max-w-[75%] break-words shadow-sm",
                            message.sender === 'client' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                            <p className="text-sm">{message.text}</p>
                            <p className={cn(
                                "text-xs mt-1 text-right", 
                                message.sender === 'client' ? 'text-primary-foreground/70' : 'text-muted-foreground/80'
                            )}>
                                {message.timestamp}
                            </p>
                        </div>
                    </div>
                ))}
            </ScrollArea>
            <CardFooter className="p-2 border-t">
                <div className="flex items-center gap-2 w-full">
                    <Textarea placeholder="Type your message..." rows={1} className="flex-grow resize-none" />
                    <Button size="icon"><Send className="h-5 w-5" /></Button>
                </div>
            </CardFooter>
        </Card>
    );
}

// --- MAIN PAGE COMPONENT ---

export default function ClientMessagesPage() {
    const { toast } = useToast();
    const [conversations, setConversations] = useState<Conversation[]>(mockConversationsData);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleTogglePin = (e: React.MouseEvent, designerId: string) => {
        e.stopPropagation();
        setConversations(prev => {
            const convoToUpdate = prev.find(c => c.designerId === designerId);
            if(convoToUpdate) {
                toast({
                    title: `Conversation ${convoToUpdate.isPinned ? 'Unpinned' : 'Pinned'}`,
                    description: `The conversation with ${convoToUpdate.designerName} has been updated.`,
                });
            }
            return prev.map(c => c.designerId === designerId ? { ...c, isPinned: !c.isPinned } : c);
        });
    };

    const filteredAndSortedConversations = useMemo(() => {
        let filtered = conversations;

        if(searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(c => 
                c.designerName.toLowerCase().includes(lowerSearchTerm) ||
                c.lastMessage.toLowerCase().includes(lowerSearchTerm)
            );
        }

        return filtered.sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime();
        });

    }, [conversations, searchTerm]);
    
    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.designerId === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline flex items-center">
                <MessagesSquare className="mr-3 h-8 w-8 text-primary" />
                Messages
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-16rem)]">
                <div className={cn(
                    "flex-col h-full",
                    selectedConversationId ? 'hidden md:flex' : 'flex'
                )}>
                    <Card className="flex flex-col h-full shadow-md">
                        <CardHeader className="p-4 border-b">
                             <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by designer or message..." 
                                    className="pl-9" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <ConversationList 
                            conversations={filteredAndSortedConversations}
                            selectedConversationId={selectedConversationId}
                            onSelect={setSelectedConversationId}
                            onTogglePin={handleTogglePin}
                        />
                    </Card>
                </div>
                <div className={cn(
                    "h-full",
                    selectedConversationId ? 'block' : 'hidden md:block'
                )}>
                   <ChatView 
                        conversation={selectedConversation} 
                        onClose={() => setSelectedConversationId(null)}
                    />
                </div>
            </div>
        </div>
    );
}
