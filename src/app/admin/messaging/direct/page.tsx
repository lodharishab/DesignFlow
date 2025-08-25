
"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Users,
  Search,
  Send,
  UserCircle,
  Archive,
  VolumeX,
  PanelRightClose,
  PanelRightOpen,
  Filter,
  ArrowUpDown,
  Check,
  Inbox
} from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';


interface Message {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  timestamp: string;
}

interface Conversation {
  userId: string;
  userName: string;
  avatarUrl: string;
  avatarHint: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  isRead: boolean;
  isArchived: boolean;
  isMuted: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    userId: 'usr001',
    userName: 'Priya Sharma',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'indian woman client',
    lastMessage: 'Great, thanks for the update! Looking forward to the designs.',
    lastMessageTimestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    isRead: false,
    isArchived: false,
    isMuted: false,
    messages: [
      { id: 'msg1', sender: 'admin', text: 'Hi Priya, just wanted to let you know your assigned designer has started working on the project.', timestamp: '11:30 AM' },
      { id: 'msg2', sender: 'user', text: 'Great, thanks for the update! Looking forward to the designs.', timestamp: '11:32 AM' },
    ],
  },
  {
    userId: 'usr002',
    userName: 'Rohan Kapoor',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'indian man designer',
    lastMessage: 'Yes, I have submitted my portfolio for the new category.',
    lastMessageTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    isArchived: false,
    isMuted: false,
    messages: [
       { id: 'msg3', sender: 'admin', text: 'Hi Rohan, did you get a chance to submit your portfolio for the Web UI/UX category?', timestamp: '9:00 AM' },
       { id: 'msg4', sender: 'user', text: 'Yes, I have submitted my portfolio for the new category.', timestamp: '9:05 AM' },
    ]
  },
  {
    userId: 'usr003',
    userName: 'Aarav Patel',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'indian person avatar',
    lastMessage: 'Okay, I understand the policy. Thanks for clarifying.',
    lastMessageTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    isArchived: true,
    isMuted: false,
     messages: [
        { id: 'msg5', sender: 'user', text: 'I had a question about my last order.', timestamp: 'Yesterday' },
        { id: 'msg6', sender: 'admin', text: 'Hi Aarav, of course. How can I help?', timestamp: 'Yesterday' },
        { id: 'msg7', sender: 'user', text: 'Why was it marked as suspended?', timestamp: 'Yesterday' },
        { id: 'msg8', sender: 'admin', text: 'There was an issue with the provided brief, which we have now resolved. Your project is active again.', timestamp: 'Yesterday' },
        { id: 'msg9', sender: 'user', text: 'Okay, I understand the policy. Thanks for clarifying.', timestamp: 'Yesterday' },
    ]
  },
  {
    userId: 'usr004',
    userName: 'Sneha Reddy',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'indian woman professional',
    lastMessage: 'Perfect, thank you!',
    lastMessageTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    isArchived: false,
    isMuted: true,
     messages: []
  },
];

type FilterType = 'all' | 'unread' | 'archived' | 'muted';
type SortType = 'date' | 'name';

export default function AdminDirectMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');

  const filteredAndSortedConversations = useMemo(() => {
    let filtered = conversations;

    if (filterBy !== 'all') {
      filtered = conversations.filter(c => {
        if (filterBy === 'unread') return !c.isRead;
        if (filterBy === 'archived') return c.isArchived;
        if (filterBy === 'muted') return c.isMuted;
        return true;
      });
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.userName.localeCompare(b.userName);
      }
      // Default to sorting by date (latest first)
      return b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime();
    });

  }, [conversations, filterBy, sortBy]);

  return (
    <div className="h-full w-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold font-headline flex items-center">
                <Users className="mr-3 h-8 w-8 text-primary" />
                Direct Messages
            </h1>
       </div>

        <Tabs defaultValue="chat" className="md:hidden w-full flex-grow">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chats</TabsTrigger>
                <TabsTrigger value="conversation" disabled={!selectedConversation}>
                    Conversation
                </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="h-full">
                <ThreadList 
                    conversations={filteredAndSortedConversations} 
                    selectedConversation={selectedConversation} 
                    onSelect={setSelectedConversation}
                    filterBy={filterBy}
                    setFilterBy={setFilterBy}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                 />
            </TabsContent>
            <TabsContent value="conversation" className="h-full">
                <ChatView conversation={selectedConversation} />
            </TabsContent>
        </Tabs>

        <div className={cn(
            "hidden md:grid h-[calc(100vh-12rem)] gap-4 transition-all duration-300",
            isUserDetailsOpen ? "grid-cols-[25%_55%_20%]" : "grid-cols-[30%_70%_0px]"
        )}>
            <ThreadList 
                conversations={filteredAndSortedConversations} 
                selectedConversation={selectedConversation} 
                onSelect={setSelectedConversation} 
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
            <ChatView conversation={selectedConversation} />
            <UserDetailsPane 
                conversation={selectedConversation} 
                isOpen={isUserDetailsOpen} 
                onToggle={() => setIsUserDetailsOpen(!isUserDetailsOpen)}
            />
        </div>
    </div>
  );
}


function ThreadList({ conversations, selectedConversation, onSelect, filterBy, setFilterBy, sortBy, setSortBy }: { 
    conversations: Conversation[], 
    selectedConversation: Conversation | null, 
    onSelect: (c: Conversation) => void,
    filterBy: FilterType,
    setFilterBy: (f: FilterType) => void,
    sortBy: SortType,
    setSortBy: (s: SortType) => void
}) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterType)}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Filter by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all"><Inbox className="mr-2 h-4 w-4 inline-block"/> All</SelectItem>
                            <SelectItem value="unread"><Check className="mr-2 h-4 w-4 inline-block"/> Unread</SelectItem>
                            <SelectItem value="archived"><Archive className="mr-2 h-4 w-4 inline-block"/> Archived</SelectItem>
                            <SelectItem value="muted"><VolumeX className="mr-2 h-4 w-4 inline-block"/> Muted</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortType)}>
                        <SelectTrigger className="flex-1">
                             <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date"><ArrowUpDown className="mr-2 h-4 w-4 inline-block"/> Latest</SelectItem>
                            <SelectItem value="name"><ArrowUpDown className="mr-2 h-4 w-4 inline-block"/> Name</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <ScrollArea className="flex-grow">
                <CardContent className="p-0">
                    {conversations.length > 0 ? conversations.map(convo => (
                        <button
                            key={convo.userId}
                            onClick={() => onSelect(convo)}
                            className={cn(
                                "flex items-start gap-3 p-4 w-full text-left transition-colors",
                                selectedConversation?.userId === convo.userId ? "bg-primary/10" : "hover:bg-muted/50"
                            )}
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={convo.avatarUrl} alt={convo.userName} data-ai-hint={convo.avatarHint} />
                                <AvatarFallback>{convo.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow overflow-hidden">
                                <p className="font-semibold truncate">{convo.userName}</p>
                                <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                            </div>
                            <div className="flex flex-col items-end text-xs text-muted-foreground self-start shrink-0">
                                <span>{formatDistanceToNow(convo.lastMessageTimestamp, { addSuffix: true })}</span>
                                {!convo.isRead && (
                                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                                )}
                            </div>
                        </button>
                    )) : (
                        <div className="text-center p-8 text-muted-foreground text-sm">No conversations match your filters.</div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
}

function ChatView({ conversation }: { conversation: Conversation | null }) {
    if (!conversation) {
        return (
            <Card className="h-full hidden md:flex flex-col items-center justify-center">
                <CardContent className="text-center">
                    <Users className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                    <p className="text-muted-foreground">Select a conversation to start messaging.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-full">
             <CardHeader className="flex flex-row items-center gap-3 p-3 border-b bg-background sticky top-0 z-10">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatarUrl} alt={conversation.userName} data-ai-hint={conversation.avatarHint} />
                    <AvatarFallback>{conversation.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{conversation.userName}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                </div>
            </CardHeader>
            <ScrollArea className="flex-grow p-4 space-y-4">
                 {conversation.messages.map(message => (
                    <div key={message.id} className={cn("flex items-end gap-2", message.sender === 'admin' ? 'justify-end' : '')}>
                        {message.sender !== 'admin' && (
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={conversation.avatarUrl} alt={conversation.userName} data-ai-hint={conversation.avatarHint} />
                                <AvatarFallback>{conversation.userName.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "rounded-lg px-3 py-2 max-w-[75%] break-words",
                            message.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                            <p className="text-sm">{message.text}</p>
                            <p className={cn("text-xs mt-1", message.sender === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground/80')}>{message.timestamp}</p>
                        </div>
                    </div>
                ))}
            </ScrollArea>
            <CardContent className="p-4 border-t">
                <div className="flex items-center gap-2">
                    <Textarea placeholder="Type your message..." rows={1} className="flex-grow resize-none" />
                    <Button size="icon"><Send className="h-5 w-5" /></Button>
                </div>
            </CardContent>
        </Card>
    );
}

function UserDetailsPane({ conversation, isOpen, onToggle }: { conversation: Conversation | null, isOpen: boolean, onToggle: () => void }) {
    if (!isOpen) {
         return (
             <div className="flex items-start justify-center pt-2">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onToggle}>
                                <PanelRightClose className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>Show User Details</p></TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
             </div>
         )
    }

    return (
        <Card className="flex flex-col h-full w-full shrink-0 overflow-hidden">
            {conversation ? (
                <>
                    <CardHeader className="p-4 border-b">
                        <div className="flex items-center justify-between">
                             <CardTitle className="text-lg font-semibold">User Details</CardTitle>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={onToggle}>
                                            <PanelRightOpen className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Hide Details</p></TooltipContent>
                                </Tooltip>
                             </TooltipProvider>
                        </div>
                    </CardHeader>
                    <ScrollArea className="flex-grow">
                        <CardContent className="p-4 space-y-4 text-sm">
                             <div className="flex flex-col items-center gap-3 py-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={conversation.avatarUrl} alt={conversation.userName} data-ai-hint={conversation.avatarHint} />
                                    <AvatarFallback className="text-2xl">{conversation.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <p className="font-bold text-lg">{conversation.userName}</p>
                                    <p className="text-muted-foreground text-xs">{conversation.userId}</p>
                                </div>
                            </div>
                            <Button variant="outline" asChild className="w-full">
                                <Link href={`/admin/users/view/${conversation.userId}`}>
                                    <UserCircle className="mr-2 h-4 w-4" /> View Full Profile
                                </Link>
                            </Button>
                             <div className="space-y-2 pt-2">
                                <h4 className="font-semibold text-muted-foreground">Actions</h4>
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline"><VolumeX className="mr-2 h-4 w-4" /> Mute Conversation</Button>
                                    <Button variant="outline"><Archive className="mr-2 h-4 w-4" /> Archive Chat</Button>
                                </div>
                             </div>
                        </CardContent>
                    </ScrollArea>
                </>
            ) : (
                <CardContent className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Users className="h-16 w-16 opacity-50 mb-4" />
                    <p>No user selected.</p>
                    <p className="text-xs">Select a conversation to see user details.</p>
                </CardContent>
            )}
        </Card>
    )
}
