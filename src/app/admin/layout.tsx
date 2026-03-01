
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
  Tags as TagsIcon, 
  List,
  ChevronDown,
  Network,
  LayoutGrid,
  Loader2,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Newspaper,
  PlusCircle, // For Add New Post
  BarChart3, // For Payments
  Star, // For Reviews
  MessageSquare, // For new Messaging page
  ShieldAlert, // For new Reports page
  IndianRupee,
  HandCoins,
  SendToBack,
  PieChart as PieChartIcon,
  UserCog,
  History, // for Activity Logs
  User as UserIcon, // for Clients
  Info, // For Platform Info
  FileCode, // For README
  BookText, // For Project Summary
  Sparkles, // For AI Flows
  Package // For Tech Stack
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
  SidebarFooter,
  useSidebar,
  SidebarTrigger
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
import { useUI } from '@/contexts/ui-context';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  {
    label: 'Orders',
    icon: ClipboardList,
    pathPrefix: '/admin/orders',
    children: [
      { href: '/admin/orders', icon: List, label: 'All Orders' },
      { href: '/admin/orders/pending-assignment', icon: Loader2, label: 'Pending Assignment' },
      { href: '/admin/orders/in-progress', icon: Clock, label: 'In Progress' },
      { href: '/admin/orders/awaiting-review', icon: Eye, label: 'Awaiting Review' },
      { href: '/admin/orders/completed', icon: CheckCircle2, label: 'Completed Orders' },
      { href: '/admin/orders/cancelled', icon: XCircle, label: 'Cancelled Orders' },
    ]
  },
  {
    label: 'Services',
    icon: Briefcase,
    pathPrefix: '/admin/services',
    children: [
      { href: '/admin/services', icon: List, label: 'All Services' },
      { href: '/admin/services/categories', icon: TagsIcon, label: 'Service Categories' },
      { href: '/admin/services/sub-categories', icon: Network, label: 'Service Sub-categories' },
      { href: '/admin/services/tags', icon: TagsIcon, label: 'Service Tags' },
    ]
  },
  {
    label: 'Users',
    icon: UsersRound,
    pathPrefix: '/admin/users',
    children: [
      { href: '/admin/users', icon: UsersRound, label: 'All Users' },
      { href: '/admin/users/clients', icon: UserIcon, label: 'Clients' },
      { href: '/admin/designers', icon: Users, label: 'Designers' },
      { href: '/admin/users/staff', icon: UserCog, label: 'Staff & Members' },
      { href: '/admin/users/staff/activity-logs', icon: History, label: 'Staff Activity Logs' },
    ]
  },
  {
    label: 'Content',
    icon: Newspaper,
    pathPrefix: '/admin/blog',
    children: [
      { href: '/admin/blog/posts', icon: List, label: 'Blog Posts' },
      { href: '/admin/blog/posts/new', icon: PlusCircle, label: 'Add New Post' },
    ]
  },
  {
    label: 'Messaging Center',
    icon: MessageSquare,
    pathPrefix: '/admin/messaging', // Main path prefix for this group
    children: [
      { href: '/admin/messaging/direct', icon: Users, label: 'Direct Messages' },
      { href: '/admin/messaging/monitor', icon: Eye, label: 'Monitor Chats' },
      { href: '/admin/messaging/announcements', icon: Newspaper, label: 'Announcements' },
      { href: '/admin/reviews', icon: Star, label: 'Reviews' },
      { href: '/admin/reports', icon: ShieldAlert, label: 'Reports' },
    ]
  },
  {
    label: 'Payments & Revenue',
    icon: BarChart3,
    pathPrefix: '/admin/payments',
    children: [
        { href: '/admin/payments', icon: IndianRupee, label: 'Dashboard & Ledger' },
        { href: '/admin/payments/payouts', icon: SendToBack, label: 'Pending Payouts' },
        { href: '/admin/payments/advances', icon: HandCoins, label: 'Payout Requests' },
        { href: '/admin/payments/disputes', icon: ShieldAlert, label: 'Dispute Management' },
        { href: '/admin/payments/reports', icon: PieChartIcon, label: 'Reports & Analytics' },
        { href: '/admin/payments/settings', icon: Settings, label: 'Payment Settings' },
    ]
  },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
  {
    label: 'Platform Info',
    icon: Info,
    pathPrefix: '/admin/platform-info',
    children: [
      { href: '/admin/platform-info/readme', icon: FileCode, label: 'README' },
      { href: '/admin/platform-info/summary', icon: BookText, label: 'Project Summary' },
      { href: '/admin/platform-info/ai-flows', icon: Sparkles, label: 'AI Flows' },
      { href: '/admin/platform-info/tech-stack', icon: Package, label: 'Tech Stack' },
    ]
  },
];

// Inner component to consume SidebarContext
function AdminLayoutContent({ children }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { toggleSidebar } = useSidebar();
  const { userRole } = useUI();
  const isSuperAdmin = userRole === 'super_admin';

  useEffect(() => {
    const initiallyOpen: Record<string, boolean> = {};
    navItems.forEach(item => {
      if (item.children && item.pathPrefix) {
        // Use a regex to check if the pathname starts with any of the specified paths
        const pathRegex = new RegExp(`^(${item.pathPrefix}|/admin/designers)`);
        if (pathRegex.test(pathname)) {
          initiallyOpen[item.label] = true;
        } else if (item.children.some(child => pathname.startsWith(child.href))) {
           initiallyOpen[item.label] = true;
        }
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
          {isSuperAdmin && (
            <Badge variant="destructive" className="mt-2 w-fit text-xs">Super Admin</Badge>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              if (item.children && item.pathPrefix) {
                 const isParentActive = item.children.some(child => pathname.startsWith(child.href));
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
              } else {
                const isActive = !!(
                  (item.href === '/admin/dashboard' && pathname === item.href) ||
                  (item.href && item.href !== '/admin/dashboard' && pathname.startsWith(item.href)));
                
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
                onClick={toggleSidebar}
                className="h-8 w-8"
                aria-label="Open menu"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>
             <div className="hidden md:block">
              <SidebarTrigger className="h-8 w-8" />
            </div>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://placehold.co/100x100.png" alt={isSuperAdmin ? 'Super Admin' : 'Admin User'} data-ai-hint="person avatar" />
                      <AvatarFallback>{isSuperAdmin ? 'SA' : 'AD'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">{isSuperAdmin ? 'Super Admin' : 'Admin User'}</p>
                        {isSuperAdmin && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Super</Badge>}
                      </div>
                      <p className="text-xs leading-none text-muted-foreground">
                        {isSuperAdmin ? 'super.admin@designflow.com' : 'admin@designflow.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/admin/settings">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/admin/settings">Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/login">Log out</Link></DropdownMenuItem>
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
