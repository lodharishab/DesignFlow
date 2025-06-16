
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, MessageSquare, Briefcase, ArrowRight, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for active orders - consistent with /client/orders page
const activeOrdersMock = [
  { id: 'ORD7361P', serviceName: 'E-commerce Website UI/UX', status: 'In Progress', designer: 'Rohan K.', orderDate: '2024-07-01', total: '₹24,999.00' },
  { id: 'ORD1038K', serviceName: 'Social Media Campaign Graphics', status: 'Pending Assignment', designer: 'N/A', orderDate: '2024-07-05', total: '₹7,999.00' },
];

const clientStats = [
    { title: "Active Orders", value: activeOrdersMock.length.toString(), icon: ShoppingCart, color: "text-blue-500" },
    { title: "Completed Projects", value: "5", icon: CheckCircle2, color: "text-green-500" }, // Example static value
    { title: "Total Spent", value: "₹55,000", icon: BarChart3, color: "text-purple-500" }, // Example static value
];


export default function ClientDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Welcome Back, Client!</h1>
      
      {/* Quick Stats Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {clientStats.map(stat => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {/* <p className="text-xs text-muted-foreground">+2 from last month (example)</p> */}
              </CardContent>
          </Card>
        ))}
      </div>


      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ShoppingCart className="mr-3 h-6 w-6 text-primary" />
              Your Active Orders
            </CardTitle>
            <CardDescription>Track your ongoing design projects here.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeOrdersMock.length > 0 ? (
              <ul className="space-y-4">
                {activeOrdersMock.map(order => (
                  <li key={order.id} className="p-4 border rounded-lg bg-secondary/30 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="flex-grow">
                        <Link href={`/client/orders/${order.id}`} className="hover:underline">
                            <h3 className="font-semibold text-md group-hover:text-primary">{order.serviceName}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground">ID: {order.id} | Ordered: {order.orderDate}</p>
                        <p className="text-sm text-muted-foreground mt-1">Status: <span className="font-medium text-primary">{order.status}</span> | Designer: {order.designer}</p>
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

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Sparkles className="mr-3 h-6 w-6 text-primary" />
              Start a New Project
            </CardTitle>
            <CardDescription>Find the perfect design solution for your needs.</CardDescription>
          </CardHeader>
          <CardContent className="text-center flex flex-col items-center justify-center h-full">
             <div className="relative w-full aspect-[16/9] max-w-sm bg-muted rounded-md flex items-center justify-center mb-6 overflow-hidden">
                <Image src="https://placehold.co/600x400.png" alt="Browse design services" fill style={{objectFit: 'cover'}} data-ai-hint="design inspiration creative" />
             </div>
            <p className="text-muted-foreground mb-6">Explore our curated list of design services with fixed scopes and transparent prices. Let's bring your vision to life!</p>
            <Button size="lg" asChild className="w-full max-w-xs">
              <Link href="/design-services">
                Browse All Services <ArrowRight className="ml-2 h-4 w-4" />
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
