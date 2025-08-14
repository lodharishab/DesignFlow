
"use client";

import { useUI } from "@/contexts/ui-context";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Sparkles, Bot, User, Loader2, Mic, Paperclip, History, RefreshCcw, Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { askKiraAction } from "./actions";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AiChatSidebar() {
  const { isAiChatOpen, setIsAiChatOpen } = useUI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleSendMessage = async (e: React.FormEvent, messageContent?: string) => {
    e.preventDefault();
    const currentMessage = messageContent || input;
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const aiResponseText = await askKiraAction(currentMessage);
        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponseText,
        };
        setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
        console.error("Error asking Kira:", error);
        const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Sorry, I encountered an error trying to respond. Please try again.",
        };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRefresh = () => {
    setMessages([]);
    setEditingMessageId(null);
  }

  const handleStartEdit = (message: Message) => {
    if (message.role !== 'user') return;
    setEditingMessageId(message.id);
    setEditingText(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    if (!editingMessageId || !editingText.trim()) return;
    
    // Create a new array of messages up to the one being edited
    const originalMessageIndex = messages.findIndex(msg => msg.id === editingMessageId);
    if (originalMessageIndex === -1) return;
    const messagesToKeep = messages.slice(0, originalMessageIndex);
    
    setMessages(messagesToKeep);
    handleCancelEdit();
    
    // Resend the edited message as a new message
    handleSendMessage(e, editingText);
  };

  return (
    <Sheet open={isAiChatOpen} onOpenChange={setIsAiChatOpen}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center text-xl font-headline">
            <Sparkles className="mr-3 h-6 w-6 text-primary" />
            Kira
          </SheetTitle>
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" disabled>
                <History className="h-5 w-5" />
                <span className="sr-only">Chat History</span>
             </Button>
             <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCcw className="h-5 w-5" />
                <span className="sr-only">New Chat</span>
             </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-grow p-6">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            {messages.map(message => (
              <div key={message.id} className={cn('flex items-start gap-3 group', message.role === 'user' ? 'justify-end' : '')}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
                
                {editingMessageId === message.id ? (
                  <div className="flex-grow space-y-2">
                    <Textarea 
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="text-sm"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-1"/> Cancel
                      </Button>
                       <Button size="sm" onClick={handleSaveEdit}>
                        <Check className="h-4 w-4 mr-1"/> Save & Resend
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                  {message.role === 'user' && (
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleStartEdit(message)}
                        disabled={isLoading || !!editingMessageId}
                     >
                       <Pencil className="h-4 w-4" />
                       <span className="sr-only">Edit message</span>
                     </Button>
                  )}
                  <div className={`rounded-lg px-4 py-3 max-w-[80%] text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {message.content}
                  </div>
                  </>
                )}
                
                 {message.role === 'user' && editingMessageId !== message.id && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                <div className="rounded-lg px-4 py-3 bg-muted flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t">
          <form onSubmit={(e) => handleSendMessage(e, input)} className="flex items-end gap-2 w-full">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Kira anything..."
              className="flex-grow resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e, input);
                }
              }}
              disabled={isLoading || !!editingMessageId}
            />
             <Button type="button" variant="ghost" size="icon" disabled={isLoading || !!editingMessageId}>
              <Mic className="h-5 w-5" />
              <span className="sr-only">Use Voice</span>
            </Button>
             <Button type="button" variant="ghost" size="icon" disabled={isLoading || !!editingMessageId}>
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Upload Image</span>
            </Button>
            <Button type="submit" size="icon" disabled={isLoading || !input.trim() || !!editingMessageId}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
