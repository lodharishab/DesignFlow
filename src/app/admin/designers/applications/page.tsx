
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, ListFilter, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// This is a placeholder page for /admin/designers/applications
// The actual functionality might be integrated into the main /admin/designers page
// with enhanced filtering for "Pending Approval" status.

export default function AdminDesignerApplicationsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-headline flex items-center">
            <UserCheck className="mr-3 h-8 w-8 text-primary" />
            Designer Applications
            </h1>
            <Button variant="outline" asChild>
                <Link href="/admin/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>
       </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Review Pending Applications</CardTitle>
          <CardDescription>
            This page is intended for reviewing new designer applications. 
            Currently, this functionality is best managed via the main 
            <Link href="/admin/designers" className="text-primary hover:underline mx-1">Manage Designers</Link> 
            page by filtering for "Pending Approval" status.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <UserCheck className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
          <p className="mt-4 text-lg font-semibold">No dedicated application queue here (yet).</p>
          <p className="text-muted-foreground">
            Please use the "Pending Approval" filter on the main designers list.
          </p>
          <Button asChild className="mt-6">
            <Link href="/admin/designers?status=pending-approval">
              <ListFilter className="mr-2 h-4 w-4" /> Go to Filtered Designers List
            </Link>
          </Button>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Future Enhancements</CardTitle>
          <CardDescription>
            This section could provide a more focused workflow for application processing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="searchApplicant" className="text-xs text-muted-foreground">Search Applicant Name/Email</Label>
                    <div className="relative mt-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="searchApplicant" placeholder="Search..." className="pl-9" disabled />
                    </div>
                </div>
                <div>
                    <Label htmlFor="filterBySpecialty" className="text-xs text-muted-foreground">Filter by Applied Specialty</Label>
                    <Input id="filterBySpecialty" placeholder="e.g., Logo Design" className="mt-1" disabled />
                </div>
            </div>
          <p className="text-sm text-muted-foreground italic">
            (Placeholder: Advanced filtering and direct approval/rejection actions from a dedicated queue could be added here.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
