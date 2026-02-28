
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, ClipboardList, BarChart3, ArrowRight, UsersRound, IndianRupee, UserCheck, Newspaper, Edit, Star } from 'lucide-react';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog-db';
import { getAllDesigners } from '@/lib/designer-db';
import { getAllServices } from '@/lib/services-db';
import { getAllOrders } from '@/lib/orders-db';
import { getAllReviews } from '@/lib/reviews-db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let totalBlogPosts = 0;
  let pendingDesigners = 0;
  let totalServices = 0;
  let pendingOrders = 0;
  let newReviews = 0;
  let activeDesigners = 0;

  try {
    const [blogPosts, designers, services, orders, reviewsList] = await Promise.all([
      getAllBlogPosts(),
      getAllDesigners(),
      getAllServices(),
      getAllOrders(),
      getAllReviews(),
    ]);

    totalBlogPosts = blogPosts.length;
    pendingDesigners = designers.filter(d => d.adminRanking === null || (d.adminRanking !== undefined && d.adminRanking < 2)).length;
    activeDesigners = designers.filter(d => d.adminRanking !== null && d.adminRanking >= 2).length;
    totalServices = services.length;
    pendingOrders = orders.filter(o => o.status === 'pending_assignment' || o.status === 'pending').length;
    newReviews = reviewsList.filter(r => r.status === 'Pending').length;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }

  const stats = [
    { title: "Total Services", value: totalServices.toString(), icon: Briefcase, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900", href: "/admin/services" },
    { title: "Active Designers", value: activeDesigners.toString(), icon: Users, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900", href: "/admin/designers" },
    { title: "Pending Orders", value: pendingOrders.toString(), icon: ClipboardList, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900", href: "/admin/orders/pending-assignment" },
    { title: "Pending Applications", value: pendingDesigners.toString(), icon: UserCheck, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900", href: "/admin/designers?status=pending-approval" },
    { title: "Total Blog Posts", value: totalBlogPosts.toString(), icon: Newspaper, color: "text-indigo-500", bgColor: "bg-indigo-100 dark:bg-indigo-900", href: "/admin/blog/posts" },
    { title: "Pending Reviews", value: newReviews.toString(), icon: Star, color: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-900", href: "/admin/reviews" },
  ];

  const quickLinks = [
    { href: "/admin/services/new", label: "Add New Service", icon: Briefcase },
    { href: "/admin/designers/applications", label: "Review Designer Apps", icon: UserCheck },
    { href: "/admin/users", label: "Manage Users", icon: UsersRound },
    { href: "/admin/orders", label: "View All Orders", icon: ClipboardList },
    { href: "/admin/blog/posts/new", label: "Write New Blog Post", icon: Edit },
  ];

  const recentActivities = [
    { icon: Users, text: "New designer application: John Doe joined.", time: "2 min ago", color: "text-green-500" },
    { icon: Star, text: "New 5-star review received for 'Startup Logo' by Priya S.", time: "10 min ago", color: "text-pink-500", href: "/admin/reviews" },
    { icon: ClipboardList, text: "Order #ORD8872V updated to 'Cancelled'.", time: "15 min ago", color: "text-red-500" },
    { icon: Newspaper, text: "Blog post 'Top 5 Logo Trends' published.", time: "1 hour ago", color: "text-indigo-500" },
    { icon: Briefcase, text: "Service 'UI Kit Pro' updated by Admin.", time: "3 hours ago", color: "text-blue-500" },
    { icon: UserCheck, text: "Designer 'Priya Sharma' approved for 'Web UI/UX'.", time: "Yesterday", color: "text-orange-500"},
  ];


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href={stat.href} className="block h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">Current count</p>
              </CardContent>
            </Link>
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
              <Button key={link.href} variant="outline" className="w-full justify-start text-left hover:bg-primary/5 transition-colors" asChild>
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
            <CardDescription>Overview of recent platform events (simulated).</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                 <li key={index} className="flex items-start space-x-3">
                 <div className={`p-2 rounded-full ${activity.color.replace('text-', 'bg-')}/10`}>
                   <activity.icon className={`h-5 w-5 ${activity.color}`} />
                 </div>
                 <div className="w-full">
                    {activity.href ? (
                        <Link href={activity.href} className="hover:underline">
                            <p className="text-sm text-foreground">{activity.text}</p>
                        </Link>
                    ) : (
                        <p className="text-sm text-foreground">{activity.text}</p>
                    )}
                   <p className="text-xs text-muted-foreground">{activity.time}</p>
                 </div>
               </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
