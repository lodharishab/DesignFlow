
"use client";

import * as React from 'react';
import { useState, useMemo, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { MessagesSquare, Search, Pin, PinOff } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Conversation {
  designerId: string;
  designerName: string;
  designerAvatarUrl: string;
  designerAvatarHint: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
  isPinned: boolean;
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
  },
];


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

function ChatViewPlaceholder() {
  return (
    <div className="hidden md:flex h-full w-full flex-col items-center justify-center bg-muted/50 rounded-lg">
      <MessagesSquare className="h-20 w-20 text-muted-foreground/50 mb-4" />
      <h2 className="text-xl font-semibold">Select a Conversation</h2>
      <p className="text-muted-foreground">Choose a conversation from the left to view messages.</p>
    </div>
  )
}


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

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline flex items-center">
                <MessagesSquare className="mr-3 h-8 w-8 text-primary" />
                Messages
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-16rem)]">
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
                <div className="h-full">
                    {/* Placeholder for the main chat view */}
                    <ChatViewPlaceholder />
                </div>
            </div>
        </div>
    );
}
