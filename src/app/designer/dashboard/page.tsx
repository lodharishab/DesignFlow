
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, Palette, ArrowRight, CheckCircle, Clock, IndianRupee, HandCoins, Eye, MessageSquare, Upload, PackageSearch, PlusCircle, Pencil, Send, Bell, Star, AlertTriangle, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


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

const mockDashboardNotifications = [
    {
        id: 'cat_req_appr',
        type: 'Service Category Request',
        icon: CheckCircle,
        title: "Category Approved",
        description: "Your request for 'Packaging Design' has been approved. You can now receive alerts for these projects.",
        time: "5m ago",
        href: "/designer/applications",
        isRead: false
    },
    {
        id: 'cat_req_rej',
        type: 'Service Category Request',
        icon: AlertTriangle,
        title: "Category Rejected",
        description: "Your request for 'Motion Graphics' was rejected. Please ensure your portfolio has relevant examples.",
        time: "30m ago",
        href: "/designer/applications",
        isRead: false
    },
    ...mockHeaderNotifications.slice(1)
];

export default function DesignerDashboardPage() {
  const recentActiveOrders = [
    { id: 'ORD7361P', serviceName: 'E-commerce Website UI/UX', client: 'Priya S.', deadline: new Date(new Date().setDate(new Date().getDate() + 5)), status: 'In Progress', progress: 60 },
    { id: 'ORD4011M', serviceName: 'Mobile App Icon Set', client: 'Mohan D.', deadline: new Date(new Date().setDate(new Date().getDate() - 2)), status: 'In Progress', progress: 25 },
    { id: 'ORDABCDE', serviceName: 'Festival Social Media Posts', client: 'Ritu G.', deadline: new Date(new Date().setDate(new Date().getDate() + 2)), status: 'Awaiting Client Review', progress: 90 },
    { id: 'ORDFGHIJ', serviceName: 'Brochure for Print', client: 'Anil K.', deadline: new Date(new Date().setDate(new Date().getDate() + 8)), status: 'In Progress', progress: 40 },
    { id: 'ORDKLMNO', serviceName: 'Pitch Deck Presentation', client: 'Sunita M.', deadline: new Date(new Date().setDate(new Date().getDate() + 15)), status: 'In Progress', progress: 10 },
  ];
  
  const upcomingDeadlines = recentActiveOrders
    .filter(order => order.status === 'In Progress' || order.status === 'Awaiting Client Review')
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 3);
  
  const profileCompleteness = 75; // Mock data for profile completion

  const designerStats = [
    { title: 'Total Orders', value: '12', icon: Briefcase, href: '/designer/orders', color: 'text-blue-500' },
    { title: 'Completed Orders', value: '8', icon: CheckCircle, href: '/designer/orders?status=Completed', color: 'text-green-500' },
    { title: 'Pending Orders', value: '4', icon: Clock, href: '/designer/orders?status=In Progress', color: 'text-orange-500' },
    { title: 'Total Earnings', value: '₹85,500', icon: IndianRupee, href: '#', color: 'text-purple-500' },
    { title: 'My Rating', value: '4.7/5', icon: Star, href: '/designer/reviews', color: 'text-yellow-500' },
    { title: 'Portfolio Views', value: '1,204', icon: Eye, href: '/designer/portfolio?view=analytics', color: 'text-pink-500' },
  ];

  const quickActions = [
    { label: 'Add Portfolio Item', href: '/designer/portfolio/new', icon: PlusCircle, disabled: false },
    { label: 'Create Service', href: '#', icon: Pencil, disabled: true },
    { label: 'Request Advance', href: '#', icon: HandCoins, disabled: true },
    { label: 'Message Clients', href: '/designer/messages', icon: MessageSquare, disabled: false },
    { label: 'View All Orders', href: '/designer/orders', icon: Briefcase, disabled: false },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'In Progress': return 'secondary';
      case 'Awaiting Client Review': return 'outline';
      default: return 'default';
    }
  };

  const getNotificationIconColor = (title: string) => {
    if (title.includes('Approved')) return 'text-green-500';
    if (title.includes('Rejected')) return 'text-red-500';
    return 'text-primary';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Designer Dashboard</h1>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designerStats.map(stat => (
          <Link key={stat.title} href={stat.href}>
            <Card className="shadow-lg hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">View Details</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

       {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickActions.map(action => (
          <Button key={action.label} variant="outline" asChild={!action.disabled} disabled={action.disabled} className="flex-col h-20 md:h-24 justify-center gap-1 shadow-sm hover:shadow-md hover:bg-accent hover:border-primary/20 transition-all">
             {action.disabled ? (
              <div className="flex flex-col items-center justify-center text-center">
                  <action.icon className="h-6 w-6 mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{action.label}</span>
              </div>
             ) : (
              <Link href={action.href} className="flex flex-col items-center justify-center text-center">
                  <action.icon className="h-6 w-6 mb-1 text-muted-foreground group-hover:text-primary" />
                  <span className="text-xs text-muted-foreground group-hover:text-primary">{action.label}</span>
              </Link>
             )}
          </Button>
        ))}
      </div>

      {/* Profile Completeness Card */}
      <Card className="shadow-lg">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-grow flex items-center gap-4 w-full sm:w-auto">
                  <div className="hidden sm:block">
                      <UserCircle className="h-8 w-8 text-primary"/>
                  </div>
                  <div className="flex-grow">
                      <Label htmlFor="profile-progress" className="text-md font-semibold">Profile Completeness</Label>
                      <Progress value={profileCompleteness} className="h-2 mt-1" id="profile-progress" />
                      <p className="text-xs text-muted-foreground mt-1">A complete profile attracts more clients.</p>
                  </div>
                    <span className="font-bold text-xl text-primary">{profileCompleteness}%</span>
              </div>
              <Button variant="outline" asChild className="w-full sm:w-auto shrink-0">
                  <Link href="/designer/profile">
                  <Pencil className="mr-2 h-4 w-4" /> Complete Your Profile
                  </Link>
              </Button>
          </CardContent>
      </Card>
      
      {/* Notifications & Deadlines grid */}
      <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
          <CardHeader className="pb-2">
              <CardTitle className="font-headline text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-primary"/>
                  Recent Notifications
              </CardTitle>
          </CardHeader>
          <CardContent>
              {mockDashboardNotifications.length > 0 ? (
                  <ul className="space-y-3">
                      {mockDashboardNotifications.slice(0, 3).map(notification => (
                          <li key={notification.id}>
                              <Link href={notification.href} className="block hover:bg-muted/50 p-2 rounded-md">
                                  <div className="flex items-start gap-3">
                                      <notification.icon className={cn("h-4 w-4 mt-1 shrink-0", getNotificationIconColor(notification.title))} />
                                      <div>
                                          <p className="font-semibold text-sm leading-tight">{notification.title}</p>
                                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                                      </div>
                                  </div>
                              </Link>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
              )}
          </CardContent>
          <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/designer/messages?tab=notifications">View All Notifications</Link>
              </Button>
          </CardFooter>
          </Card>

          <Card className="shadow-lg">
          <CardHeader className="pb-2">
              <CardTitle className="font-headline text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary"/>
                  Upcoming Deadlines
              </CardTitle>
          </CardHeader>
          <CardContent>
              {upcomingDeadlines.length > 0 ? (
                  <ul className="space-y-4">
                      {upcomingDeadlines.map(order => (
                          <li key={order.id}>
                              <Link href={`/designer/orders/${order.id}`} className="block hover:bg-muted/50 p-2 rounded-md">
                                  <p className="font-semibold text-sm">{order.serviceName}</p>
                                  <p className="text-xs text-muted-foreground">Client: {order.client}</p>
                                  <div className={cn(
                                      "text-xs font-medium mt-1",
                                      isPast(order.deadline) ? 'text-destructive' : 'text-muted-foreground'
                                  )}>
                                      {isPast(order.deadline) && <AlertTriangle className="inline-block h-3 w-3 mr-1"/>}
                                      {formatDistanceToNow(order.deadline, { addSuffix: true })}
                                  </div>
                              </Link>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines.</p>
              )}
          </CardContent>
          </Card>
      </div>

      {/* Recent Active Orders Card */}
      <Card className="shadow-lg">
      <CardHeader>
          <CardTitle className="font-headline flex items-center">
          <Briefcase className="mr-3 h-6 w-6 text-primary" />
          Recent Active Orders
          </CardTitle>
          <CardDescription>An overview of your most recent active projects.</CardDescription>
      </CardHeader>
      <CardContent>
          {recentActiveOrders.length > 0 ? (
          <div className="space-y-4">
              {recentActiveOrders.slice(0, 5).map((order, index) => (
              <React.Fragment key={order.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                      <div>
                          <Link href={`/designer/orders/${order.id}`} className="hover:underline">
                          <h3 className="font-semibold text-md">{order.serviceName}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">Client: {order.client} | Due: {format(order.deadline, 'MMM d, yyyy')}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="whitespace-nowrap sm:hidden">{order.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                      <Progress value={order.progress} className="h-2 w-full sm:w-1/2" />
                      <span className="text-xs font-medium text-muted-foreground">{order.progress}%</span>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="whitespace-nowrap hidden sm:flex">{order.status}</Badge>
                      </div>
                  </div>
                  <TooltipProvider>
                  <div className="flex gap-2 shrink-0 self-end sm:self-center">
                      <Tooltip>
                          <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" asChild><Link href={`/designer/orders/${order.id}`}><Eye className="h-4 w-4"/></Link></Button>
                          </TooltipTrigger>
                          <TooltipContent><p>View Order</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                          <TooltipTrigger asChild>
                          <Button variant="outline" size="icon"><MessageSquare className="h-4 w-4"/></Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Message Client</p></TooltipContent>
                      </Tooltip>
                          <Tooltip>
                          <TooltipTrigger asChild>
                          <Button variant="outline" size="icon"><Upload className="h-4 w-4"/></Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Upload Files</p></TooltipContent>
                      </Tooltip>
                  </div>
                  </TooltipProvider>
                  </div>
                  {index < recentActiveOrders.slice(0, 5).length - 1 && <Separator />}
              </React.Fragment>
              ))}
          </div>
          ) : (
              <div className="text-center py-8">
              <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
              <p className="text-muted-foreground">You have no active orders at the moment.</p>
              </div>
          )}
          <Button className="mt-6 w-full" asChild>
              <Link href="/designer/orders">
              View All My Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
          </Button>
      </CardContent>
      </Card>

    </div>
  );
}
