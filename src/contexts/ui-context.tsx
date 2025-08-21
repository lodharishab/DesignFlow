
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
  isLoggedIn: boolean; // Add isLoggedIn state
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; // Add setter for isLoggedIn
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to logged out

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleAiChat = () => setIsAiChatOpen(prev => !prev);

  return (
    <UIContext.Provider value={{ 
      isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu, 
      isAiChatOpen, setIsAiChatOpen, toggleAiChat,
      isLoggedIn, setIsLoggedIn // Provide state and setter
    }}>
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
