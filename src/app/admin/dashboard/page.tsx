import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, ClipboardList, BarChart3, ArrowRight, UsersRound } from 'lucide-react'; // Added UsersRound
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Services", value: "25", icon: Briefcase, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900" },
    { title: "Active Designers", value: "150", icon: Users, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900" },
    { title: "Pending Orders", value: "12", icon: ClipboardList, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900" },
    { title: "Revenue (Month)", value: "$12,500", icon: BarChart3, color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900" },
  ];

  const quickLinks = [
    { href: "/admin/services/new", label: "Add New Service", icon: Briefcase },
    { href: "/admin/designers/applications", label: "Review Designer Applications", icon: Users },
    { href: "/admin/users", label: "Manage Users", icon: UsersRound }, // New quick link
    { href: "/admin/orders", label: "View All Orders", icon: ClipboardList },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Quick Links</CardTitle>
            <CardDescription>Access common admin tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLinks.map(link => (
              <Button key={link.href} variant="outline" className="w-full justify-start text-left" asChild>
                <Link href={link.href}>
                  <link.icon className="mr-3 h-5 w-5 text-primary" />
                  {link.label}
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>Overview of recent platform events.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center"><Users className="h-4 w-4 mr-2 text-green-500" /> New designer application: John Doe</li>
              <li className="flex items-center"><ClipboardList className="h-4 w-4 mr-2 text-blue-500" /> Order #1234 completed: Logo Design</li>
              <li className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-purple-500" /> Service "UI Kit" updated by Admin</li>
            </ul>
            {/* Placeholder for actual activity feed */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
