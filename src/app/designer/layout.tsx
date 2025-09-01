
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Palette, 
  UserCircle,
  Brush,
  Settings,
  Bell,
  MessageSquare,
  CheckCircle,
  IndianRupee, // For Earnings
  Star, // For Reviews
  ChevronDown,
  Activity, // For new Performance page
  ShieldAlert,
  FileWarning
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';


const navItems = [
  { href: '/designer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/designer/orders', icon: Briefcase, label: 'My Orders' },
  { href: '/designer/portfolio', icon: Palette, label: 'My Portfolio' },
  { href: '/designer/messages', icon: MessageSquare, label: 'Messaging' },
  { 
    label: 'Performance', 
    icon: Activity, 
    pathPrefix: '/designer/performance',
    notificationCount: 2,
    children: [
        { href: '/designer/performance/reviews', icon: Star, label: 'Reviews' },
        { href: '/designer/performance/reports', icon: FileWarning, label: 'Reports' },
        { href: '/designer/performance/disputes', icon: ShieldAlert, label: 'Disputes' },
    ]
  },
  { 
    label: 'Earnings', 
    icon: IndianRupee, 
    pathPrefix: '/designer/earnings',
    children: [
        { href: '/designer/earnings', icon: LayoutDashboard, label: 'Overview & Ledger' },
        { href: '/designer/settings/payment', icon: Settings, label: 'Payout Settings' },
    ]
  },
  { href: '/designer/profile', icon: UserCircle, label: 'Profile' },
];

const mockHeaderNotifications = [
    {
        id: 'notif1',
        icon: MessageSquare,
        title: "New Message from Priya S.",
        description: "Regarding order ORD7361P: 'Looks great! Can we try a different color?'",
        time: "15m ago",
        href: "/designer/orders/ORD7361P",
        isRead: false,
    },
    {
        id: 'notif2',
        icon: Briefcase,
        title: "New Order Assigned",
        description: "You've been assigned to order ORDXYZ123: 'Business Card Design'.",
        time: "1h ago",
        href: "/designer/orders/ORDXYZ123",
        isRead: false,
    },
    {
        id: 'notif3',
        icon: CheckCircle,
        title: "Order Approved",
        description: "Client has approved the final delivery for order ORDFGHIJ.",
        time: "2 days ago",
        href: "/designer/orders/ORDFGHIJ",
        isRead: true,
    },
];

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const unreadCount = mockHeaderNotifications.filter(n => !n.isRead).length;
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

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
            {navItems.map((item) => (
              item.children ? (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={() => toggleSubmenu(item.label)}
                    isActive={pathname.startsWith(item.pathPrefix!) && !openSubmenus[item.label]}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    className="justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {item.notificationCount && item.notificationCount > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">{item.notificationCount}</Badge>
                      )}
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform duration-200", openSubmenus[item.label] && "rotate-180")}
                      />
                    </div>
                  </SidebarMenuButton>
                  {openSubmenus[item.label] && (
                    <SidebarMenuSub>
                      {item.children.map(child => (
                        <SidebarMenuSubItem key={child.label}>
                          <SidebarMenuSubButton asChild isActive={pathname === child.href}>
                            <Link href={child.href}>
                              {child.icon && <child.icon />}
                              <span>{child.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.pathPrefix || item.href!)} 
                      tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    >
                      <Link href={item.href!} className="flex justify-between items-center w-full">
                         <span className="flex items-center gap-2">
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              )
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="flex-1" /> {/* Spacer */}
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="relative">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs" variant="destructive">
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {mockHeaderNotifications.length > 0 ? (
                        <>
                            {mockHeaderNotifications.map(notification => (
                                <DropdownMenuItem key={notification.id} asChild className="p-3 cursor-pointer">
                                    <Link href={notification.href}>
                                        <notification.icon className="h-5 w-5 mr-3 text-primary shrink-0" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-sm">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </>
                    ) : (
                        <div className="text-center text-sm text-muted-foreground p-4">
                            No new notifications
                        </div>
                    )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* Replace with actual designer avatar data if available */}
                      <AvatarImage src="https://placehold.co/100x100.png" alt="Designer User" data-ai-hint="person avatar" />
                      <AvatarFallback>DE</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                       {/* Replace with actual designer data if available */}
                      <p className="text-sm font-medium leading-none">Designer User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        designer@designflow.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/designer/profile">Profile & Settings</Link></DropdownMenuItem>
                   <DropdownMenuItem asChild><Link href="/designer/applications">My Service Alerts</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/designer/earnings">Earnings</Link></DropdownMenuItem>
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
