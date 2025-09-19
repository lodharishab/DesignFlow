
"use client";

import * as React from 'react';
import { useState, useMemo, type ReactElement, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { MessagesSquare, Search, Pin, PinOff, Send, PanelLeftClose, ArrowLeft, Paperclip, UploadCloud, X, File as FileIcon, FileText, Image as ImageIcon, Download, Check, CheckCheck, Eye, Briefcase, ChevronDown } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Mail, MailOpen, Archive } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';


// --- MOCK DATA & INTERFACES ---

interface ChatFile {
  name: string;
  size: number; // in bytes
  type: 'image' | 'pdf' | 'other';
  url: string; // data URL for preview, or placeholder
  timestamp: Date;
}

interface Message {
  id: string;
  sender: 'client' | 'designer';
  text: string;
  timestamp: string;
  file?: Omit<ChatFile, 'timestamp'>;
  status?: 'sent' | 'delivered' | 'seen';
}

interface Conversation {
  id: string; // Unique ID for the conversation, e.g., using orderId
  orderId: string;
  serviceName: string;
  designerId: string;
  designerName: string;
  designerAvatarUrl: string;
  designerAvatarHint: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
  isPinned: boolean;
  messages: Message[];
  sharedFiles: ChatFile[];
}

const mockConversationsData: Conversation[] = [
  {
    id: 'ORD7361P',
    orderId: 'ORD7361P',
    serviceName: 'E-commerce Website UI/UX',
    designerId: 'des002',
    designerName: 'Rohan Kapoor',
    designerAvatarUrl: 'https://placehold.co/100x100.png',
    designerAvatarHint: 'indian man software developer',
    lastMessage: 'Sure, I can have the revised wireframes ready by tomorrow morning. Does that work for you?',
    lastMessageTimestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
    unreadCount: 2,
    isPinned: true,
    messages: [
      { id: 'msg1', sender: 'client', text: 'Hi Rohan, I had a quick question about the wireframes for the dashboard.', timestamp: '10:30 AM', status: 'seen' },
      { id: 'msg2', sender: 'designer', text: 'Hey! Of course, ask away. Happy to clarify anything.', timestamp: '10:31 AM' },
      { id: 'msg3', sender: 'client', text: 'The new analytics section looks great, but could we add a date range filter at the top? I think that was missed from the brief.', timestamp: '10:33 AM', status: 'delivered' },
      { id: 'msg4', sender: 'designer', text: 'Good catch! You\'re right, I can definitely add that in. It\'s a quick addition.', timestamp: '10:34 AM' },
      { id: 'msg5', sender: 'designer', text: 'Sure, I can have the revised wireframes ready by tomorrow morning. Does that work for you?', timestamp: '10:35 AM' },
    ],
     sharedFiles: [
      { name: 'initial-brief.pdf', size: 120400, type: 'pdf', url: '#', timestamp: new Date(new Date().setHours(new Date().getHours() - 5)) },
      { name: 'inspiration.jpg', size: 800000, type: 'image', url: 'https://picsum.photos/seed/chatimg1/200/200', timestamp: new Date(new Date().setHours(new Date().getHours() - 4)) }
    ],
  },
  {
    id: 'ORD1234Z', // New order with the same designer
    orderId: 'ORD1234Z',
    serviceName: 'Mobile App Splash Screen',
    designerId: 'des002',
    designerName: 'Rohan Kapoor',
    designerAvatarUrl: 'https://placehold.co/100x100.png',
    designerAvatarHint: 'indian man software developer',
    lastMessage: 'Just confirming, you need this by Friday EOD?',
    lastMessageTimestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    unreadCount: 0,
    isPinned: false,
    messages: [
        { id: 'msg_b1', sender: 'client', text: 'Following up on the splash screen project.', timestamp: '2 days ago', status: 'seen' },
        { id: 'msg_b2', sender: 'designer', text: 'Just confirming, you need this by Friday EOD?', timestamp: '2 days ago' },
    ],
    sharedFiles: [],
  },
  {
    id: 'ORD5050T',
    orderId: 'ORD5050T',
    serviceName: 'Social Media Campaign',
    designerId: 'des003',
    designerName: 'Aisha Khan',
    designerAvatarUrl: 'https://placehold.co/100x100.png',
    designerAvatarHint: 'indian woman graphic artist',
    lastMessage: 'Excellent! The campaign is performing well. Thanks for the quick turnaround.',
    lastMessageTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    unreadCount: 0,
    isPinned: false,
    messages: [
       { id: 'msg_a1', sender: 'client', text: 'Hi Aisha, thanks for the final social media graphics. They look perfect!', timestamp: 'Yesterday', status: 'seen' },
       { id: 'msg_a2', sender: 'designer', text: 'You\'re welcome! Glad you liked them. Let me know if you need anything else.', timestamp: 'Yesterday' },
       { id: 'msg_a3', sender: 'client', text: 'Excellent! The campaign is performing well. Thanks for the quick turnaround.', timestamp: 'Yesterday', status: 'seen' },
    ],
    sharedFiles: [],
  },
];


// --- UTILITY COMPONENTS ---

function TimeAgo({ date }: { date: Date }) {
  const [timeAgo, setTimeAgo] = React.useState('');
  const [fullDate, setFullDate] = React.useState('');

  React.useEffect(() => {
    // This part runs only on the client, avoiding hydration mismatch
    setTimeAgo(formatDistanceToNow(date, { addSuffix: true }));
    setFullDate(date.toLocaleString());
  }, [date]);

  return <span title={fullDate}>{timeAgo}</span>;
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
                            key={convo.id}
                            className={cn(
                                "flex items-center gap-3 w-full text-left p-2 rounded-lg transition-colors relative group",
                                selectedConversationId === convo.id ? "bg-primary/10" : "hover:bg-muted/50 cursor-pointer"
                            )}
                             onClick={() => onSelect(convo.id)}
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
                                <p className="text-xs font-medium text-muted-foreground truncate">{convo.serviceName}</p>
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
                                            onClick={(e) => onTogglePin(e, convo.id)}
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

function ChatView({ 
    conversation, 
    relatedConversations,
    onSelectConversation,
    onClose,
    onSendMessage
}: { 
    conversation: Conversation | null, 
    relatedConversations: Conversation[],
    onSelectConversation: (id: string) => void,
    onClose: () => void,
    onSendMessage: (conversationId: string, message: Message) => void
}) {
    const [newMessage, setNewMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = () => {
        if (!conversation || (!newMessage.trim() && filesToUpload.length === 0)) return;

        // Handle text message
        if (newMessage.trim()) {
            const textMessage: Message = {
                id: `msg_${Date.now()}`,
                sender: 'client',
                text: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
                status: 'sent', // Initial status
            };
            onSendMessage(conversation.id, textMessage);
        }

        // Handle file messages
        filesToUpload.forEach(file => {
            const fileMessage: Message = {
                id: `msg_file_${Date.now()}_${file.name}`,
                sender: 'client',
                text: '', // Text is optional for file messages
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent',
                file: {
                    name: file.name,
                    size: file.size,
                    type: file.type.startsWith('image/') ? 'image' : (file.type === 'application/pdf' ? 'pdf' : 'other'),
                    url: URL.createObjectURL(file), // Generate a temporary local URL for preview
                }
            };
            onSendMessage(conversation.id, fileMessage);
        });

        setNewMessage('');
        setFilesToUpload([]);
    };

    const handleFileSelect = (files: FileList | null) => {
      if (files) {
        setFilesToUpload(prev => [...prev, ...Array.from(files)]);
      }
    };
  
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
  
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };
  
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    };

    if (!conversation) {
        return (
            <div className="hidden md:flex h-full w-full flex-col items-center justify-center bg-muted/50 rounded-lg">
              <MessagesSquare className="h-20 w-20 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold">Select a Conversation</h2>
              <p className="text-muted-foreground">Choose a conversation from the left to view messages.</p>
            </div>
        );
    }
    
    const FilePreviewIcon = ({ fileType }: { fileType: ChatFile['type'] }) => {
      switch (fileType) {
        case 'image': return <ImageIcon className="h-6 w-6 text-muted-foreground" />;
        case 'pdf': return <FileText className="h-6 w-6 text-muted-foreground" />;
        default: return <FileIcon className="h-6 w-6 text-muted-foreground" />;
      }
    };

    const MessageStatusIcon = ({ status }: { status?: Message['status'] }) => {
      if (!status) return null;
      let Icon = Check;
      let className = "text-primary-foreground/70";
      if (status === 'delivered') {
          Icon = CheckCheck;
      } else if (status === 'seen') {
          Icon = Eye;
          className = "text-sky-300";
      }
      return <Icon className={cn("h-4 w-4", className)} />;
    };

    return (
        <Card 
            className="flex flex-col h-full w-full shadow-md relative"
            onDragEnter={handleDragEnter}
        >
             {isDragging && (
                <div 
                    className="absolute inset-0 z-20 bg-primary/20 border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center"
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()} // Necessary to allow drop
                >
                    <UploadCloud className="h-16 w-16 text-primary mb-4" />
                    <p className="font-semibold text-lg text-primary">Drop files to upload</p>
                </div>
            )}
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
                    {relatedConversations.length > 1 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-auto p-0 text-xs text-muted-foreground flex items-center">
                                    Project: {conversation.serviceName} ({conversation.orderId})
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
                                {relatedConversations.map(c => (
                                     <DropdownMenuItem key={c.id} onSelect={() => onSelectConversation(c.id)}>
                                        <Briefcase className="mr-2 h-4 w-4"/>
                                        <span className="truncate">{c.serviceName}</span>
                                     </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <p className="text-xs text-muted-foreground">Project: {conversation.serviceName} ({conversation.orderId})</p>
                    )}
                </div>
                 <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 hidden md:flex">
                    <PanelLeftClose className="h-5 w-5" />
                 </Button>
            </CardHeader>
            <Tabs defaultValue="chat" className="flex-grow flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2 shrink-0">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="media">Shared Media</TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="flex-grow flex flex-col min-h-0">
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
                                    {message.text && <p className="text-sm">{message.text}</p>}
                                    {message.file && (
                                        <div className="flex items-center gap-2 mt-1">
                                            {message.file.type === 'image' ? (
                                                <Image src={message.file.url} alt={message.file.name} width={100} height={100} className="rounded-md object-cover"/>
                                            ) : (
                                                <FilePreviewIcon fileType={message.file.type} />
                                            )}
                                            <div className="text-xs">
                                                <p className="font-semibold">{message.file.name}</p>
                                                <p>{(message.file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className={cn(
                                        "text-xs mt-1 flex items-center gap-1", 
                                        message.sender === 'client' ? 'text-primary-foreground/70 justify-end' : 'text-muted-foreground/80 justify-start'
                                    )}>
                                        <span>{message.timestamp}</span>
                                        {message.sender === 'client' && <MessageStatusIcon status={message.status} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="media" className="flex-grow flex flex-col min-h-0">
                    <ScrollArea className="flex-grow p-4">
                        {conversation.sharedFiles.length > 0 ? (
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {conversation.sharedFiles.map((file, index) => (
                                     <Card key={index} className="overflow-hidden">
                                        <div className="aspect-square bg-muted flex items-center justify-center">
                                            {file.type === 'image' ? (
                                                <Image src={file.url} alt={file.name} width={150} height={150} className="object-cover h-full w-full"/>
                                            ) : (
                                                <FilePreviewIcon fileType={file.type} />
                                            )}
                                        </div>
                                        <div className="p-2 text-xs border-t">
                                            <p className="font-semibold truncate">{file.name}</p>
                                            <p className="text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 absolute top-1 right-1"><Download className="h-4 w-4"/></Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-sm text-muted-foreground py-10">
                                No files have been shared in this conversation yet.
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>
            </Tabs>
            <CardFooter className="p-2 border-t flex flex-col gap-2">
                 {filesToUpload.length > 0 && (
                    <div className="w-full p-2 border rounded-md max-h-32 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                            {filesToUpload.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 p-1 bg-secondary rounded text-xs">
                                     <FilePreviewIcon fileType={file.type.startsWith('image/') ? 'image' : (file.type === 'application/pdf' ? 'pdf' : 'other')} />
                                    <div className="flex-grow overflow-hidden">
                                        <p className="truncate font-medium">{file.name}</p>
                                        <p className="text-muted-foreground">{(file.size/1024).toFixed(1)} KB</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setFilesToUpload(prev => prev.filter((_, i) => i !== index))}>
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-2 w-full">
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="h-5 w-5" />
                    </Button>
                     <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" multiple />
                    <Textarea 
                        placeholder="Type your message..." 
                        rows={1} 
                        className="flex-grow resize-none" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim() && filesToUpload.length === 0}>
                        <Send className="h-5 w-5" />
                    </Button>
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

    const handleSendMessage = (conversationId: string, message: Message) => {
        setConversations(prev => prev.map(convo => {
            if (convo.id === conversationId) {
                const newMessages = [...convo.messages, message];
                const newSharedFiles = message.file ? 
                    [...convo.sharedFiles, { ...message.file, timestamp: new Date() }] : 
                    convo.sharedFiles;
                return {
                    ...convo,
                    messages: newMessages,
                    sharedFiles: newSharedFiles,
                    lastMessage: message.text || message.file?.name || 'File sent',
                    lastMessageTimestamp: new Date(),
                };
            }
            return convo;
        }));
    };

    const handleTogglePin = (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation();
        setConversations(prev => {
            const convoToUpdate = prev.find(c => c.id === conversationId);
            if(convoToUpdate) {
                toast({
                    title: `Conversation ${convoToUpdate.isPinned ? 'Unpinned' : 'Pinned'}`,
                    description: `The conversation with ${convoToUpdate.designerName} has been updated.`,
                });
            }
            return prev.map(c => c.id === conversationId ? { ...c, isPinned: !c.isPinned } : c);
        });
    };

    const filteredAndSortedConversations = useMemo(() => {
        let filtered = conversations;

        if(searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(c => 
                c.designerName.toLowerCase().includes(lowerSearchTerm) ||
                c.serviceName.toLowerCase().includes(lowerSearchTerm) ||
                c.orderId.toLowerCase().includes(lowerSearchTerm) ||
                c.lastMessage.toLowerCase().includes(lowerSearchTerm)
            );
        }

        return filtered.sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime();
        });

    }, [conversations, searchTerm]);
    
    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);

    const relatedConversationsForSelected = useMemo(() => {
        if (!selectedConversation) return [];
        return conversations.filter(c => c.designerId === selectedConversation.designerId);
    }, [conversations, selectedConversation]);

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
                                    placeholder="Search designer, project..." 
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
                        relatedConversations={relatedConversationsForSelected}
                        onSelectConversation={setSelectedConversationId}
                        onClose={() => setSelectedConversationId(null)}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
}
