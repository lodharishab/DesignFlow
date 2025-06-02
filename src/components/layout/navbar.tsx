
"use client";

import Link from 'next/link';
import { LogIn, UserPlus, Brush, LayoutGrid, PanelLeftClose } from 'lucide-react'; // Added LayoutGrid, PanelLeftClose
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
import *
as React from 'react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
          <ModeToggle />
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
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
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
                 <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <PanelLeftClose className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>
              <div className="flex flex-col space-y-3">
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
