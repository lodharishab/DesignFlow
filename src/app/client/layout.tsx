
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingCart, 
  UserCircle,
  Brush,
  Sparkles,
  LayoutGrid,
  MessageSquare,
  Bell,
  MessagesSquare,
  ChevronDown
} from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
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
} from "@/components/ui/dropdown-menu";
import { BrandSwitcher } from '@/components/shared/brand-switcher';
import { useUI } from '@/contexts/ui-context';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/client/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/client/orders', icon: ShoppingCart, label: 'My Orders' },
  { href: '/client/brand-profiles', icon: Sparkles, label: 'Brand Profiles' },
  { 
    label: 'Messaging Center',
    icon: MessageSquare,
    pathPrefix: '/client/messaging',
    children: [
      { href: '/client/messaging/messages', icon: MessagesSquare, label: 'Messages' },
      { href: '/client/messaging/notifications', icon: Bell, label: 'Notifications' },
    ]
  },
  { href: '/client/profile', icon: UserCircle, label: 'Account Settings' },
  { type: 'separator' },
  { href: '/design-services', icon: Briefcase, label: 'Browse Services' },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { toggleSidebar } = useUI();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

   useEffect(() => {
    const initiallyOpen: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children && item.pathPrefix && pathname.startsWith(item.pathPrefix)) {
        initiallyOpen[item.label!] = true;
      }
    });
    setOpenSubmenus(initiallyOpen);
  }, [pathname]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
           <Link href="/" className="flex items-center gap-2">
            <Brush className="w-7 h-7 text-primary" />
            <span className="font-semibold font-headline text-xl">DesignFlow</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item, index) => {
              if (item.type === 'separator') {
                return <Separator key={`sep-${index}`} className="my-2" />;
              }

              if (item.children && item.pathPrefix) {
                 const isParentActive = item.children.some(child => pathname.startsWith(child.href));
                 const isOpen = openSubmenus[item.label!] || false;

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.label!)}
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
                           const isChildActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
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
              }

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href!)}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  >
                    <Link href={item.href!}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
             <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8" aria-label="Open menu">
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>
             <div className="hidden md:block">
              <SidebarTrigger className="h-8 w-8" />
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <BrandSwitcher />
              <ModeToggle />
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
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
