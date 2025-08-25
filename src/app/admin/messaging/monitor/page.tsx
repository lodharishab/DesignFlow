
"use client";

import { useState, useMemo, type ReactElement, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Eye,
  Search,
  Calendar as CalendarIcon,
  X,
  PanelLeftClose,
  MessageSquare,
  Loader2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Flag,
  Download, // Import Download icon
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';


type ChatStatus = 'Active' | 'Idle' | 'Escalated' | 'Closed' | 'Flagged';

interface MonitoredChatMessage {
    id: string;
    sender: string;
    text: string;
    timestamp: Date;
    isFlagged?: boolean;
}

interface MonitoredChat {
    threadId: string;
    orderId: string;
    clientName: string;
    clientAvatar: string;
    designerName: string;
    designerAvatar: string;
    lastActivity: Date;
    unreadCount: number;
    assignedTo: 'Admin Team' | 'Support Tier 2' | null;
    status: ChatStatus;
    messages: MonitoredChatMessage[];
}

const mockMonitoredChats: MonitoredChat[] = [
    { threadId: 'thr_ord_7361p', orderId: 'ORD7361P', clientName: 'Priya Sharma', clientAvatar: 'https://placehold.co/100x100.png', designerName: 'Rohan Kapoor', designerAvatar: 'https://placehold.co/100x100.png', lastActivity: new Date(new Date().setHours(new Date().getHours() - 2)), unreadCount: 3, assignedTo: null, status: 'Active', messages: [{id: 'msg_1', sender: 'Rohan Kapoor', text: 'Here are the first concepts.', timestamp: new Date(new Date().setHours(new Date().getHours() - 3))}, {id: 'msg_2', sender: 'Priya Sharma', text: 'Looks great! Can we try a different color?', timestamp: new Date(new Date().setHours(new Date().getHours() - 2))}] },
    { threadId: 'thr_ord_1038k', orderId: 'ORD1038K', clientName: 'Rajesh Kumar', clientAvatar: 'https://placehold.co/100x100.png', designerName: 'Aisha Khan', designerAvatar: 'https://placehold.co/100x100.png', lastActivity: new Date(new Date().setDate(new Date().getDate() - 3)), unreadCount: 0, assignedTo: 'Support Tier 2', status: 'Escalated', messages: [] },
    { threadId: 'thr_ord_5050t', orderId: 'ORD5050T', clientName: 'Anjali Iyer', clientAvatar: 'https://placehold.co/100x100.png', designerName: 'Vikram Singh', designerAvatar: 'https://placehold.co/100x100.png', lastActivity: new Date(new Date().setDate(new Date().getDate() - 5)), unreadCount: 0, assignedTo: null, status: 'Idle', messages: [] },
    { threadId: 'thr_ord_2945s', orderId: 'ORD2945S', clientName: 'Sunita Rao', clientAvatar: 'https://placehold.co/100x100.png', designerName: 'Priya Sharma', designerAvatar: 'https://placehold.co/100x100.png', lastActivity: new Date(new Date().setDate(new Date().getDate() - 10)), unreadCount: 0, assignedTo: null, status: 'Closed', messages: [] },
];


export default function AdminMonitorChatsPage() {
  const [chats, setChats] = useState<MonitoredChat[]>(mockMonitoredChats);
  const [selectedChat, setSelectedChat] = useState<MonitoredChat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ChatStatus>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const isMobile = useIsMobile();
  
  const hasFlaggedMessages = (chat: MonitoredChat) => chat.messages.some(m => m.isFlagged);

  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
        const lowerSearch = searchTerm.toLowerCase();
        const searchMatch = !searchTerm || chat.orderId.toLowerCase().includes(lowerSearch) || chat.clientName.toLowerCase().includes(lowerSearch) || chat.designerName.toLowerCase().includes(lowerSearch);
        const statusMatch = statusFilter === 'All' || chat.status === statusFilter || (statusFilter === 'Flagged' && hasFlaggedMessages(chat));
        const dateMatch = !dateRange || (dateRange.from && dateRange.to && chat.lastActivity >= dateRange.from && chat.lastActivity <= dateRange.to);
        return searchMatch && statusMatch && dateMatch;
    });
  }, [chats, searchTerm, statusFilter, dateRange]);

  const getStatusBadgeVariant = (status: ChatStatus) => {
    switch(status) {
        case 'Active': return 'default';
        case 'Idle': return 'secondary';
        case 'Escalated': return 'destructive';
        case 'Flagged': return 'destructive';
        case 'Closed': return 'outline';
    }
  }

  const getStatusIcon = (status: ChatStatus) => {
    switch (status) {
        case 'Active': return <Clock className="mr-1.5 h-3 w-3" />;
        case 'Idle': return <MessageSquare className="mr-1.5 h-3 w-3" />;
        case 'Escalated': return <AlertTriangle className="mr-1.5 h-3 w-3" />;
        case 'Flagged': return <Flag className="mr-1.5 h-3 w-3" />;
        case 'Closed': return <CheckCircle2 className="mr-1.5 h-3 w-3" />;
        default: return null;
    }
  };

  const handleRowClick = (chat: MonitoredChat) => {
    if (selectedChat?.threadId === chat.threadId) {
        setSelectedChat(null); // Deselect if clicking the same row
    } else {
        setSelectedChat(chat);
    }
  }
  
  const handleToggleFlag = (messageId: string) => {
    if (!selectedChat) return;
    
    const updatedMessages = selectedChat.messages.map(msg => 
        msg.id === messageId ? { ...msg, isFlagged: !msg.isFlagged } : msg
    );
    
    const updatedChat = { ...selectedChat, messages: updatedMessages };

    // Check if the chat should now be considered 'Flagged'
    const hasFlags = updatedMessages.some(m => m.isFlagged);
    if(hasFlags && updatedChat.status !== 'Flagged' && updatedChat.status !== 'Escalated') {
        updatedChat.status = 'Flagged';
    } else if (!hasFlags && updatedChat.status === 'Flagged') {
        // Revert to 'Active' if no flags remain, this might need more complex logic
        updatedChat.status = 'Active'; 
    }

    setSelectedChat(updatedChat);

    setChats(prevChats => 
        prevChats.map(chat => chat.threadId === updatedChat.threadId ? updatedChat : chat)
    );
  };
  
  const handleExportCsv = useCallback(() => {
    const headers = ["Thread ID", "Order ID", "Client Name", "Designer Name", "Last Activity", "Status"];
    const rows = filteredChats.map(chat => [
      chat.threadId,
      chat.orderId,
      `"${chat.clientName.replace(/"/g, '""')}"`, // Handle potential commas/quotes in names
      `"${chat.designerName.replace(/"/g, '""')}"`,
      format(chat.lastActivity, "yyyy-MM-dd HH:mm:ss"),
      chat.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chat_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredChats]);


  if (isMobile) {
      return (
          <div className="h-full w-full">
            {selectedChat ? (
                <ChatPreviewPane chat={selectedChat} onBack={() => setSelectedChat(null)} onToggleFlag={handleToggleFlag} />
            ) : (
                <ChatListPane 
                    filteredChats={filteredChats}
                    handleRowClick={handleRowClick}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                    getStatusIcon={getStatusIcon}
                    setSearchTerm={setSearchTerm}
                    setStatusFilter={setStatusFilter}
                    setDateRange={setDateRange}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    dateRange={dateRange}
                    hasFlaggedMessages={hasFlaggedMessages}
                />
            )}
        </div>
      )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Eye className="mr-3 h-8 w-8 text-primary" />
          Monitor Chats
        </h1>
        <Button onClick={handleExportCsv} disabled={filteredChats.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
        </Button>
      </div>
      
      <div className={cn(
          "grid gap-6 transition-all duration-500",
          selectedChat ? "grid-cols-1 lg:grid-cols-[1fr_0.8fr]" : "grid-cols-1"
      )}>
        <div className={cn("transition-opacity duration-300", selectedChat ? "lg:opacity-60" : "opacity-100")}>
            <ChatListPane 
                filteredChats={filteredChats}
                handleRowClick={handleRowClick}
                getStatusBadgeVariant={getStatusBadgeVariant}
                getStatusIcon={getStatusIcon}
                setSearchTerm={setSearchTerm}
                setStatusFilter={setStatusFilter}
                setDateRange={setDateRange}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                dateRange={dateRange}
                selectedChatId={selectedChat?.threadId}
                hasFlaggedMessages={hasFlaggedMessages}
            />
        </div>
        
        <div className={cn(
            "transform-gpu transition-all duration-500 ease-in-out",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2"
        )} data-state={selectedChat ? 'open' : 'closed'}>
            {selectedChat && (
                <ChatPreviewPane chat={selectedChat} onBack={() => setSelectedChat(null)} onToggleFlag={handleToggleFlag} />
            )}
        </div>
      </div>
    </div>
  );
}

function ChatListPane({ filteredChats, handleRowClick, getStatusBadgeVariant, getStatusIcon, setSearchTerm, setStatusFilter, setDateRange, searchTerm, statusFilter, dateRange, selectedChatId, hasFlaggedMessages }: any) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle>Monitor Order Conversations</CardTitle>
            <CardDescription>
                View ongoing conversations between clients and designers on specific orders.
            </CardDescription>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search Order, Client, Designer..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Idle">Idle</SelectItem>
                        <SelectItem value="Escalated">Escalated</SelectItem>
                        <SelectItem value="Flagged">Flagged</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Pick a date range</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                    </PopoverContent>
                </Popover>
            </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Thread</TableHead>
                            <TableHead>Participants</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead>Unread</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredChats.length > 0 ? filteredChats.map((chat: MonitoredChat) => (
                            <TableRow 
                                key={chat.threadId} 
                                onClick={() => handleRowClick(chat)} 
                                className={cn("cursor-pointer", selectedChatId === chat.threadId && "bg-muted/50")}
                            >
                                <TableCell className="font-medium text-primary">{chat.orderId}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6"><AvatarFallback>{chat.clientName.charAt(0)}</AvatarFallback></Avatar>
                                        <Avatar className="h-6 w-6"><AvatarFallback>{chat.designerName.charAt(0)}</AvatarFallback></Avatar>
                                        <span className="text-xs">{chat.clientName} & {chat.designerName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{formatDistanceToNow(chat.lastActivity, { addSuffix: true })}</TableCell>
                                <TableCell><Badge variant="secondary">{chat.unreadCount}</Badge></TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(chat.status)} className="whitespace-nowrap">
                                        {getStatusIcon(chat.status)}
                                        {chat.status}
                                    </Badge>
                                    {hasFlaggedMessages(chat) && chat.status !== 'Flagged' && (
                                        <Badge variant="destructive" className="ml-1 text-xs">
                                           <Flag className="mr-1 h-3 w-3" /> Flagged
                                        </Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} className="text-center h-24">No chats match filters</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function ChatPreviewPane({ chat, onBack, onToggleFlag }: { chat: MonitoredChat, onBack: () => void, onToggleFlag: (messageId: string) => void }) {
    const isMobile = useIsMobile();
    return (
        <Card className="shadow-lg flex flex-col h-full lg:max-h-[calc(100vh-14rem)]">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-muted/50">
                <div className="flex-grow">
                    <CardTitle className="text-base font-semibold">Chat Preview: {chat.orderId}</CardTitle>
                    <CardDescription className="text-xs">{chat.clientName} & {chat.designerName}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <PanelLeftClose className="h-5 w-5" />
                </Button>
            </CardHeader>
            <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                    {chat.messages.length > 0 ? chat.messages.map((message) => (
                        <div key={message.id} className={cn(
                            "flex items-end gap-2 text-sm group",
                            message.sender === chat.designerName ? "justify-end" : "justify-start"
                        )}>
                             {message.sender === chat.clientName && (
                                <Avatar className="h-8 w-8"><AvatarFallback>{chat.clientName.charAt(0)}</AvatarFallback></Avatar>
                            )}
                             <div className={cn(
                                "rounded-lg px-3 py-2 max-w-[80%] break-words relative",
                                message.sender === chat.designerName ? "bg-primary text-primary-foreground" : "bg-secondary",
                                message.isFlagged && "bg-destructive/10 border border-destructive"
                             )}>
                                <p className="font-semibold text-xs mb-0.5">{message.sender}</p>
                                {message.text}
                                <p className="text-xs opacity-70 mt-1 text-right">{format(message.timestamp, 'p')}</p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onToggleFlag(message.id)}
                                    className={cn(
                                        "absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                                        message.isFlagged && "opacity-100",
                                        message.sender === chat.designerName ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-secondary-foreground/70 hover:text-secondary-foreground"
                                    )}
                                >
                                    <Flag className={cn("h-4 w-4", message.isFlagged && "fill-current")} />
                                </Button>
                            </div>
                              {message.sender === chat.designerName && (
                                <Avatar className="h-8 w-8"><AvatarFallback>{chat.designerName.charAt(0)}</AvatarFallback></Avatar>
                            )}
                        </div>
                    )) : (
                        <div className="text-center text-muted-foreground italic py-10">No messages in this thread yet.</div>
                    )}
                </div>
            </ScrollArea>
        </Card>
    )
}

    