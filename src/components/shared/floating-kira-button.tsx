
"use client";

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUI } from '@/contexts/ui-context';

export function FloatingKiraButton() {
  const { toggleAiChat } = useUI();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleAiChat}
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center animate-pulse"
          >
            <Sparkles className="h-7 w-7" />
            <span className="sr-only">Ask Kira AI</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="mb-1">
          <p>Ask Kira AI</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
