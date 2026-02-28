
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, MessageSquare, Briefcase, ArrowRight, BarChart3, Sparkles, CheckCircle2, Bell, Package, IndianRupee, Hourglass, Star, Upload, Heart, CalendarPlus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrdersByClientId, type Order } from '@/lib/orders-db';
import { getNotificationsByUser, type Notification as DbNotification } from '@/lib/notifications-db';
import { formatDistanceToNow } from 'date-fns';

const CURRENT_CLIENT_ID = 'client001';

const quickActions = [
    { label: "Start New Project", href: "/design-services", icon: Sparkles, variant: "default" },
    { label: "Manage Brand Assets", href: "/client/brand-profile", icon: Briefcase, variant: "outline" },
    { label: "Upload Brand Asset", href: "/client/brand-profile", icon: Upload, variant: "outline" },
    { label: "View Favorites", href: "/client/orders", icon: Heart, variant: "outline" },
    { label: "Book Consultation", href: "/contact-support", icon: CalendarPlus, variant: "outline" },
]

export default function ClientDashboardPage() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);

  useEffect(() => {
    getOrdersByClientId(CURRENT_CLIENT_ID).then(orders => {
      setAllOrders(orders);
      setActiveOrders(orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled' && o.status !== 'Refunded'));
    });
    getNotificationsByUser(CURRENT_CLIENT_ID).then(setNotifications);
  }, []);

  const clientStats = useMemo(() => [
    { title: "Active Orders", value: activeOrders.length.toString(), icon: ShoppingCart, color: "text-blue-500", href: "/client/orders?status=active" },
    { title: "Completed Projects", value: allOrders.filter(o => o.status === 'Completed').length.toString(), icon: CheckCircle2, color: "text-green-500", href: "/client/orders?status=completed" },
    { title: "Total Spend", value: `₹${allOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('en-IN')}`, icon: BarChart3, color: "text-purple-500", href: "/client/orders" },
    { title: "Pending Payments", value: allOrders.filter(o => o.status === 'Pending Assignment').length.toString(), icon: Hourglass, color: "text-orange-500", href: "/client/orders?status=pending_payment" },
  ], [activeOrders, allOrders]);
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Welcome Back, Client!</h1>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative">
                    <Button variant="outline" size="icon">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    {notifications.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {notifications.length}
                        </Badge>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                    <>
                        {notifications.map(notification => (
                            <DropdownMenuItem key={notification.id} asChild className="p-3 cursor-pointer">
                                <Link href={notification.relatedOrderId ? `/client/orders/${notification.relatedOrderId}` : '#'}>
                                    <Bell className="h-5 w-5 mr-3 text-primary shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-sm">{notification.title}</p>
                                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground/70 mt-1">{notification.createdAt ? formatDistanceToNow(notification.createdAt, { addSuffix: true }) : ''}</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center text-xs text-muted-foreground py-2 cursor-pointer">
                            View All Notifications
                        </DropdownMenuItem>
                    </>
                ) : (
                    <div className="text-center text-sm text-muted-foreground p-4">
                        No new notifications
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Quick Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {clientStats.map(stat => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href={stat.href || '#'} className={`block h-full ${!stat.href ? 'cursor-default' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

       {/* Quick Actions Section */}
      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickActions.map(action => (
                <Button key={action.label} variant={action.variant as any} className="flex-col h-24 text-center justify-center gap-2" asChild>
                    <Link href={action.href}>
                        <action.icon className="h-6 w-6" />
                        <span className="text-xs whitespace-normal">{action.label}</span>
                    </Link>
                </Button>
              ))}
          </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ShoppingCart className="mr-3 h-6 w-6 text-primary" />
              Your Active Orders
            </CardTitle>
            <CardDescription>Track your ongoing design projects here.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeOrders.length > 0 ? (
              <ul className="space-y-4">
                {activeOrders.map(order => (
                  <li key={order.id} className="p-4 border rounded-lg bg-secondary/30 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="flex-grow">
                        <Link href={`/client/orders/${order.id}`} className="hover:underline">
                            <h3 className="font-semibold text-md group-hover:text-primary">{order.serviceName}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground">ID: {order.id} | Tier: {order.serviceTier || 'Standard'}</p>
                        <p className="text-sm text-muted-foreground mt-1">Status: <span className="font-medium text-primary">{order.status}</span> | Designer: {order.designerName || 'N/A'}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="shrink-0">
                        <Link href={`/client/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                <p className="text-muted-foreground">You have no active orders at the moment.</p>
              </div>
            )}
            <Button className="mt-6 w-full" asChild>
              <Link href="/client/orders">
                View All My Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <MessageSquare className="mr-3 h-6 w-6 text-primary" />
            Recent Messages & Updates
          </CardTitle>
          <CardDescription>Stay updated with communications on your projects (feature coming soon).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic text-center py-6">No new messages or updates.</p>
        </CardContent>
      </Card>
    </div>
  );
}
