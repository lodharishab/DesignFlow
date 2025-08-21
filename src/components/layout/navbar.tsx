
"use client";

import Link from 'next/link';
import { LogIn, UserPlus, Brush, LayoutGrid, PanelLeftClose, Briefcase, Newspaper, Sparkles, ShoppingCart, UserCircle } from 'lucide-react'; // Added UserCircle
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import * as React from 'react';
import { useUI } from '@/contexts/ui-context';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu, toggleAiChat, isLoggedIn, setIsLoggedIn } = useUI();
  const mockCartItemCount = 3; // Mock data for cart item count

  // Function to handle logout, setting global state to false
  const handleLogout = () => {
    setIsLoggedIn(false);
    // In a real app, you would also clear tokens, etc.
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-5 flex h-16 items-center">
        <Link href="/" className="pl-2 mr-4 flex items-center space-x-2">
          <Brush className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">DesignFlow</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4 lg:space-x-6">
          {/* Main navigation links can go here if needed in the future */}
        </nav>

        {/* Desktop Menu Items */}
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" onClick={toggleAiChat}>
            <Sparkles className="mr-2 h-4 w-4" />
            Kira
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {mockCartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {mockCartItemCount}
                </Badge>
              )}
              <span className="sr-only">View Cart</span>
            </Link>
          </Button>
          <ModeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Client User" data-ai-hint="person avatar"/>
                    <AvatarFallback>CL</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Client User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      client@designflow.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/client/dashboard">Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/client/orders">My Orders</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/client/profile">Settings</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <LayoutGrid className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center">
                  <Brush className="h-5 w-5 text-primary mr-2" />
                  <span className="font-bold font-headline text-lg">DesignFlow</span>
                </SheetTitle>
                 <SheetClose asChild>
                   <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    <PanelLeftClose className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                   </Button>
                 </SheetClose>
              </SheetHeader>
              <div className="flex flex-col space-y-3">
                <Button variant="ghost" className="w-full justify-start py-6 text-base" onClick={() => { toggleAiChat(); setIsMobileMenuOpen(false); }}>
                  <Sparkles className="mr-3 h-5 w-5" />
                  Ask Kira
                </Button>
                <Button variant="ghost" className="w-full justify-start py-6 text-base" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/blog">
                    <Newspaper className="mr-3 h-5 w-5" />
                    Blog
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start py-6 text-base" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/portfolio">
                    <Briefcase className="mr-3 h-5 w-5" />
                    Portfolio
                  </Link>
                </Button>
                 <Button variant="ghost" className="w-full justify-start py-6 text-base" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/services">
                    <LayoutGrid className="mr-3 h-5 w-5" />
                    Services
                  </Link>
                </Button>
                {isLoggedIn ? (
                  <>
                     <Button variant="default" className="w-full justify-start py-6 text-base" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/client/dashboard">
                        <UserCircle className="mr-3 h-5 w-5" />
                        My Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start py-6 text-base" onClick={() => {handleLogout(); setIsMobileMenuOpen(false);}}>
                        <LogIn className="mr-3 h-5 w-5" />
                        Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="default" className="w-full justify-start py-6 text-base" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/login">
                        <LogIn className="mr-3 h-5 w-5" />
                        Login
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start py-6 text-base" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/signup">
                        <UserPlus className="mr-3 h-5 w-5" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
                <div className="pt-4">
                  <label className="text-sm font-medium text-muted-foreground px-1">Theme</label>
                  <div className="mt-2 flex items-center justify-between rounded-md border p-2">
                     <span className="text-sm pl-2">Appearance</span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
