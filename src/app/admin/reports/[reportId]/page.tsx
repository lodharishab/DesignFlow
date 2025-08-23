
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShieldAlert, ArrowLeft, Loader2, User, Calendar, ClipboardList, PackageSearch } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockReportsData, type Report } from '@/app/admin/reports/data';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateReportStatusAction } from '@/app/admin/reports/actions';

function ReportDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const reportId = params.reportId as string;

  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (reportId) {
      const foundReport = mockReportsData.find(r => r.id === reportId);
      setReport(foundReport || null);
      setIsLoading(false);
    }
  }, [reportId]);

  const handleUpdateStatus = async (newStatus: Report['status']) => {
    if (!report) return;
    setIsUpdating(true);
    const result = await updateReportStatusAction(report.id, newStatus);
    if (result.success) {
      setReport(prev => prev ? { ...prev, status: newStatus } : null);
      toast({ title: "Status Updated", description: `Report status set to ${newStatus}.` });
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/></div>;
  }
  
  if (!report) {
     return (
        <Card className="max-w-xl mx-auto">
            <CardHeader><CardTitle className="text-center">Report Not Found</CardTitle></CardHeader>
            <CardFooter>
                 <Button asChild className="w-full"><Link href="/admin/reports"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Reports</Link></Button>
            </CardFooter>
        </Card>
     )
  }
  
  const getStatusBadgeVariant = (status: Report['status']) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'In Progress': return 'secondary';
      case 'Resolved': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
            <ShieldAlert className="mr-3 h-8 w-8 text-primary" />
            Report Details
        </h1>
        <Button variant="outline" asChild>
            <Link href="/admin/reports"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Reports</Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                    <CardTitle className="font-headline text-2xl">Report: {report.id}</CardTitle>
                    <CardDescription>Subject: {report.subject}</CardDescription>
                </div>
                 <Badge variant={getStatusBadgeVariant(report.status)} className="text-base px-4 py-1.5 self-start sm:self-auto">
                    {report.status}
                </Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div className="space-y-1">
                    <h4 className="font-semibold text-foreground flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Reporter</h4>
                    <p>{report.reporterName} (ID: {report.reporterId})</p>
                </div>
                {report.reportedUserName && (
                    <div className="space-y-1">
                        <h4 className="font-semibold text-foreground flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Reported User</h4>
                        <p>{report.reportedUserName} (ID: {report.reportedUserId})</p>
                    </div>
                )}
                 {report.orderId && (
                    <div className="space-y-1">
                        <h4 className="font-semibold text-foreground flex items-center"><ClipboardList className="mr-2 h-4 w-4 text-muted-foreground"/>Related Order</h4>
                        <Link href={`/admin/orders/details/${report.orderId}`} className="text-primary hover:underline">{report.orderId}</Link>
                    </div>
                )}
                <div className="space-y-1">
                    <h4 className="font-semibold text-foreground flex items-center"><Calendar className="mr-2 h-4 w-4 text-muted-foreground"/>Report Date</h4>
                    <p>{format(report.reportDate, 'PPpp')}</p>
                </div>
            </div>
             <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Report Details</h3>
              <p className="whitespace-pre-line bg-muted p-4 rounded-md text-foreground">{report.details}</p>
            </div>
        </CardContent>
         <CardFooter className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Label htmlFor="status-update" className="text-sm font-medium">Update Status:</Label>
                <Select
                    value={report.status}
                    onValueChange={(value) => handleUpdateStatus(value as Report['status'])}
                    disabled={isUpdating}
                >
                    <SelectTrigger id="status-update" className="w-[180px]">
                        <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>
                 {isUpdating && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
            <Button disabled>Contact Reporter (Soon)</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ReportDetailPage() {
    return (
        <Suspense fallback={<div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/></div>}>
            <ReportDetailContent />
        </Suspense>
    )
}
