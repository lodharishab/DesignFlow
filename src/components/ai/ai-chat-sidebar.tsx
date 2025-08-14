
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
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "This is a simulated response from Kira. The actual AI logic is not yet implemented. I can't process your request for: '" + input + "' right now.",
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Sheet open={isAiChatOpen} onOpenChange={setIsAiChatOpen}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center text-xl font-headline">
            <Sparkles className="mr-3 h-6 w-6 text-primary" />
            Kira - Your AI Design Assistant
          </SheetTitle>
          <SheetDescription>
            Ask me anything about design services, project briefs, or finding the right talent.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow p-6">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            {messages.map(message => (
              <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg px-4 py-3 max-w-[80%] text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {message.content}
                </div>
                 {message.role === 'user' && (
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
          <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Help me find a logo designer for a tech startup'"
              className="flex-grow resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
