
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, MessageSquare, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboardPage() {
  const activeOrders = [
    { id: 'ORD7361P', serviceName: 'E-commerce Website UI/UX', status: 'In Progress', designer: 'Rohan K.' },
    { id: 'ORD1038K', serviceName: 'Social Media Campaign Graphics', status: 'Pending Assignment', designer: 'N/A' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Client Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ShoppingCart className="mr-3 h-6 w-6 text-primary" />
              Active Orders
            </CardTitle>
            <CardDescription>Track your ongoing design projects.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeOrders.length > 0 ? (
              <ul className="space-y-4">
                {activeOrders.map(order => (
                  <li key={order.id} className="p-4 border rounded-lg bg-secondary/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{order.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">Status: {order.status} | Designer: {order.designer}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/client/orders/${order.id}`}>View Order</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">You have no active orders.</p>
            )}
            <Button className="mt-6 w-full" asChild>
              <Link href="/client/orders">
                View All Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Briefcase className="mr-3 h-6 w-6 text-primary" />
              Discover Services
            </CardTitle>
            <CardDescription>Find the perfect design solution for your needs in India.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4" data-ai-hint="indian design inspiration">
                <Briefcase className="w-16 h-16 text-muted-foreground opacity-50" />
             </div>
            <p className="text-muted-foreground mb-4">Explore our curated list of design services with fixed scopes and prices, tailored for the Indian market.</p>
            <Button size="lg" asChild>
              <Link href="/services">
                Browse Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <MessageSquare className="mr-3 h-6 w-6 text-primary" />
            Recent Messages
          </CardTitle>
          <CardDescription>Stay updated with your communications.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for messages */}
          <p className="text-muted-foreground">No new messages.</p>
        </CardContent>
      </Card>
    </div>
  );
}
