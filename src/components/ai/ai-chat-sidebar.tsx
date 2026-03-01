
"use client";

import { useUI } from "@/contexts/ui-context";
import { Button, Textarea, Avatar, ScrollShadow, Divider } from "@heroui/react";
import { Send, Sparkles, Bot, User, Loader2, Mic, Paperclip, History, RefreshCcw, Pencil, Check, X as XIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { askKiraAction } from "./actions";
import { motion, AnimatePresence } from "framer-motion";

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
  };

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
    const originalMessageIndex = messages.findIndex(msg => msg.id === editingMessageId);
    if (originalMessageIndex === -1) return;
    const messagesToKeep = messages.slice(0, originalMessageIndex);
    setMessages(messagesToKeep);
    handleCancelEdit();
    handleSendMessage(e, editingText);
  };

  return (
    <AnimatePresence>
      {isAiChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsAiChatOpen(false)}
          />
          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[400px] sm:w-[480px] z-50 flex flex-col bg-background border-l border-divider shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-divider">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-headline font-semibold">Kira</h2>
              </div>
              <div className="flex items-center gap-1">
                <Button isIconOnly variant="light" size="sm" isDisabled radius="full">
                  <History className="h-4 w-4" />
                </Button>
                <Button isIconOnly variant="light" size="sm" onPress={handleRefresh} isDisabled={isLoading} radius="full">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
                <Button isIconOnly variant="light" size="sm" onPress={() => setIsAiChatOpen(false)} radius="full">
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollShadow className="flex-grow p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-default-400 text-sm py-12"
                  >
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium text-foreground mb-1">Hi, I&apos;m Kira!</p>
                    <p>Ask me anything about design services.</p>
                  </motion.div>
                )}
                <AnimatePresence>
                  {messages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn('flex items-start gap-3 group', message.role === 'user' ? 'justify-end' : '')}
                    >
                      {message.role === 'assistant' && (
                        <Avatar
                          size="sm"
                          icon={<Bot className="h-4 w-4" />}
                          classNames={{
                            base: "bg-primary/10 flex-shrink-0",
                            icon: "text-primary",
                          }}
                        />
                      )}

                      {editingMessageId === message.id ? (
                        <div className="flex-grow space-y-2 max-w-[80%]">
                          <Textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            size="sm"
                            variant="bordered"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="light" onPress={handleCancelEdit} startContent={<XIcon className="h-3 w-3" />}>
                              Cancel
                            </Button>
                            <Button size="sm" color="primary" onPress={(e: any) => handleSaveEdit(e)} startContent={<Check className="h-3 w-3" />}>
                              Save & Resend
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.role === 'user' && (
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              radius="full"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onPress={() => handleStartEdit(message)}
                              isDisabled={isLoading || !!editingMessageId}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          )}
                          <div className={cn(
                            'rounded-2xl px-4 py-2.5 max-w-[80%] text-sm',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-content2 text-foreground rounded-bl-sm'
                          )}>
                            {message.content}
                          </div>
                        </>
                      )}

                      {message.role === 'user' && editingMessageId !== message.id && (
                        <Avatar
                          size="sm"
                          icon={<User className="h-4 w-4" />}
                          classNames={{
                            base: "bg-default-100 flex-shrink-0",
                            icon: "text-default-500",
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3"
                  >
                    <Avatar
                      size="sm"
                      icon={<Bot className="h-4 w-4" />}
                      classNames={{ base: "bg-primary/10", icon: "text-primary" }}
                    />
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-content2 flex items-center gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-default-400" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-default-400" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-default-400" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollShadow>

            {/* Input */}
            <div className="p-4 border-t border-divider">
              <form onSubmit={(e) => handleSendMessage(e, input)} className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Kira anything..."
                  variant="bordered"
                  size="sm"
                  minRows={1}
                  maxRows={4}
                  classNames={{
                    inputWrapper: "bg-content2/50",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e, input);
                    }
                  }}
                  isDisabled={isLoading || !!editingMessageId}
                  className="flex-grow"
                />
                <div className="flex flex-col gap-1">
                  <Button isIconOnly variant="light" size="sm" isDisabled={isLoading || !!editingMessageId} radius="full">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button isIconOnly variant="light" size="sm" isDisabled={isLoading || !!editingMessageId} radius="full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    color="primary"
                    size="sm"
                    type="submit"
                    isDisabled={isLoading || !input.trim() || !!editingMessageId}
                    radius="full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
