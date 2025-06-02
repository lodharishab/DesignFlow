
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  ClipboardList, 
  Settings,
  Brush,
  UsersRound,
  Tags,
  List, 
  ChevronDown,
  Network, 
  LayoutGrid 
} from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter, // Added SidebarFooter here
  useSidebar 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { 
    label: 'Services', 
    icon: Briefcase, 
    pathPrefix: '/admin/services',
    children: [
      { href: '/admin/services', icon: List, label: 'All Services' },
      { href: '/admin/services/categories', icon: Tags, label: 'Service Categories' },
      { href: '/admin/services/sub-categories', icon: Network, label: 'Service Sub-categories' },
    ] 
  },
  { href: '/admin/designers', icon: Users, label: 'Designers' },
  { href: '/admin/users', icon: UsersRound, label: 'Users' },
  { href: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

// Inner component to consume SidebarContext
function AdminLayoutContent({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { toggleSidebar } = useSidebar(); // Consuming context correctly

  useEffect(() => {
    const initiallyOpen: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children && item.pathPrefix && pathname.startsWith(item.pathPrefix)) {
        initiallyOpen[item.label] = true;
      }
    });
    setOpenSubmenus(initiallyOpen);
  }, [pathname]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Brush className="w-7 h-7 text-primary" />
            <span className="font-semibold font-headline text-xl">DesignFlow</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              if (item.children && item.pathPrefix) {
                const isParentActive = pathname.startsWith(item.pathPrefix);
                const isOpen = openSubmenus[item.label] || false;

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.label)}
                      isActive={isParentActive && !isOpen} 
                      tooltip={{ children: item.label, side: 'right', align: 'center' }}
                      className="justify-between"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    </SidebarMenuButton>
                    {isOpen && (
                      <SidebarMenuSub>
                        {item.children.map(child => {
                          let isChildActive;
                          if (child.href === item.pathPrefix) { 
                            isChildActive = pathname === child.href;
                          } else { 
                            isChildActive = pathname.startsWith(child.href);
                          }
                          return (
                            <SidebarMenuSubItem key={child.label}>
                              <SidebarMenuSubButton asChild isActive={isChildActive}>
                                <Link href={child.href}>
                                  {child.icon && <child.icon />}
                                  <span>{child.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              } else {
                const isActive = 
                  (item.href === '/admin/dashboard' && pathname === item.href) ||
                  (item.href !== '/admin/dashboard' && item.href && pathname.startsWith(item.href));
                
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    >
                      <Link href={item.href!}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-5 flex h-16 items-center">
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar} // toggleSidebar is now from context
                className="h-8 w-8" 
                aria-label="Open menu"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1" /> 
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="Admin User" data-ai-hint="person avatar" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@designflow.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 px-5 py-6">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}
