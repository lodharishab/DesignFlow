
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { getBrandKits, type BrandProfileFormData } from '@/lib/brand-profile-db';

export type UserRole = 'client' | 'designer' | 'admin' | null;

interface UIContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileMenu: () => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAiChat: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  // New brand kit management state
  brandKits: BrandProfileFormData[];
  activeBrandKit: BrandProfileFormData | null;
  setActiveBrandKit: (kit: BrandProfileFormData | null) => void;
  loadBrandKits: () => Promise<void>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // New state for brand kits
  const [brandKits, setBrandKits] = useState<BrandProfileFormData[]>([]);
  const [activeBrandKit, setActiveBrandKitState] = useState<BrandProfileFormData | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleAiChat = () => setIsAiChatOpen(prev => !prev);

  const loadBrandKits = async () => {
    const kits = await getBrandKits();
    setBrandKits(kits);
    if (!activeBrandKit && kits.length > 0) {
      setActiveBrandKitState(kits[0]); // Set the first kit as active by default
    } else if (kits.length === 0) {
      setActiveBrandKitState(null);
    }
  };

  const setActiveBrandKit = (kit: BrandProfileFormData | null) => {
    setActiveBrandKitState(kit);
    // Here you could also save the active kit ID to localStorage to persist it
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadBrandKits();
    }
  }, [isLoggedIn]);


  return (
    <UIContext.Provider value={{ 
      isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu, 
      isAiChatOpen, setIsAiChatOpen, toggleAiChat,
      isLoggedIn, setIsLoggedIn,
      userRole, setUserRole,
      brandKits, activeBrandKit, setActiveBrandKit, loadBrandKits
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
