
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, Palette, ArrowRight, CheckCircle, Clock, IndianRupee, HandCoins, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DesignerDashboardPage() {
  const assignedOrders = [
    { id: 'ORD7361P', serviceName: 'E-commerce Website UI/UX', client: 'Priya S.', dueDate: 'July 25, 2024' },
    { id: 'ORD4011M', serviceName: 'Mobile App Icon Set', client: 'Mohan D.', dueDate: 'July 15, 2024' },
  ];

  const applicationStatus = {
    serviceName: 'UI/UX Web Design (India)',
    status: 'Approved', 
    icon: CheckCircle, 
    color: 'text-green-500'
  };

  const designerStats = [
    { title: 'Total Orders', value: '12', icon: Briefcase, href: '/designer/orders', color: 'text-blue-500' },
    { title: 'Completed Orders', value: '8', icon: CheckCircle, href: '/designer/orders?status=Completed', color: 'text-green-500' },
    { title: 'Pending Orders', value: '4', icon: Clock, href: '/designer/orders?status=In Progress', color: 'text-orange-500' },
    { title: 'Total Earnings', value: '₹85,500', icon: IndianRupee, href: '/designer/earnings', color: 'text-purple-500' },
    { title: 'Advance Requests', value: '1', icon: HandCoins, href: '/designer/advances', color: 'text-yellow-500' },
    { title: 'Portfolio Views', value: '1,204', icon: Eye, href: '/designer/portfolio?view=analytics', color: 'text-pink-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Designer Dashboard</h1>

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Briefcase className="mr-3 h-6 w-6 text-primary" />
              Assigned Orders
            </CardTitle>
            <CardDescription>Manage your current design projects.</CardDescription>
          </CardHeader>
          <CardContent>
            {assignedOrders.length > 0 ? (
              <ul className="space-y-4">
                {assignedOrders.map(order => (
                  <li key={order.id} className="p-4 border rounded-lg bg-secondary/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{order.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">Client: {order.client} | Due: {order.dueDate}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/designer/orders/${order.id}`}>Manage Order</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">You have no assigned orders.</p>
            )}
             <Button className="mt-6 w-full" asChild>
              <Link href="/designer/orders">
                View All Orders <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <FileText className="mr-3 h-6 w-6 text-primary" />
              Service Alerts & Approvals
            </CardTitle>
            <CardDescription>Manage service notifications and track your approved specialities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-secondary/30 mb-4">
              <h4 className="font-semibold">Latest Approval Status:</h4>
              <div className="flex items-center mt-1">
                <applicationStatus.icon className={`mr-2 h-5 w-5 ${applicationStatus.color}`} />
                <span>{applicationStatus.serviceName}: <span className={`${applicationStatus.color} font-medium`}>{applicationStatus.status}</span></span>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link href="/designer/services-notifications">
                Manage Service Alerts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Palette className="mr-3 h-6 w-6 text-primary" />
            Your Portfolio
          </CardTitle>
          <CardDescription>Showcase your best work to attract clients and get approved for more services.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4" data-ai-hint="indian art portfolio">
                <Palette className="w-16 h-16 text-muted-foreground opacity-50" />
             </div>
          <p className="text-muted-foreground mb-4">Keep your portfolio updated with your latest and greatest designs relevant to the Indian market.</p>
          <Button size="lg" asChild>
            <Link href="/designer/portfolio">
              Manage Portfolio <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
