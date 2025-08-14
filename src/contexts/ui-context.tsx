
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

interface UIContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileMenu: () => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAiChat: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleAiChat = () => setIsAiChatOpen(prev => !prev);

  return (
    <UIContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu, isAiChatOpen, setIsAiChatOpen, toggleAiChat }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
