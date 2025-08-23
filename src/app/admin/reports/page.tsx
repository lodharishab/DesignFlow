
"use client";

import { useState, type ReactElement, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, User, Edit3, Eye, ArrowRight, CheckCircle2, ListFilter, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { updateReportStatusAction } from '@/app/admin/reports/actions';
import { mockReportsData, type Report } from '@/app/admin/reports/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function AdminReportsPage(): ReactElement {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>(mockReportsData);
  const [statusFilter, setStatusFilter] = useState<'All' | Report['status']>('All');

  const handleUpdateStatus = async (reportId: string, newStatus: Report['status']) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );

    const result = await updateReportStatusAction(reportId, newStatus);
    
    if (result.success) {
      toast({
        title: "Report Status Updated",
        description: `Report ${reportId} has been set to ${newStatus}.`,
      });
    } else {
      setReports(mockReportsData);
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const filteredReports = useMemo(() => {
    if (statusFilter === 'All') {
      return reports;
    }
    return reports.filter(report => report.status === statusFilter);
  }, [reports, statusFilter]);

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
          Manage Reports
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All User Reports</CardTitle>
          <CardDescription>Review and manage reports submitted by users regarding orders, conduct, or platform issues.</CardDescription>
           <div className="pt-4 flex items-center">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Report ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24">No reports match the current filter.</TableCell></TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium text-primary hover:underline">
                          <Link href={`/admin/reports/${report.id}`}>{report.id}</Link>
                      </TableCell>
                      <TableCell className="font-medium">{report.subject}</TableCell>
                      <TableCell className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {report.reporterName}
                      </TableCell>
                      <TableCell>{format(report.reportDate, 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(report.status)}>{report.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex justify-end items-center gap-2">
                           <Button variant="outline" size="sm" asChild className="shadow-sm hover:shadow-md transition-all">
                                <Link href={`/admin/reports/${report.id}`} className="flex items-center">
                                  <Eye className="mr-1.5 h-4 w-4" /> View
                                </Link>
                            </Button>

                          {report.status === 'Open' && (
                             <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(report.id, 'In Progress')} className="shadow-sm hover:shadow-md transition-all text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-orange-700">
                                <PlayCircle className="mr-1.5 h-4 w-4" /> Start
                              </Button>
                          )}
                          
                          {(report.status === 'Open' || report.status === 'In Progress') && (
                             <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(report.id, 'Resolved')} className="shadow-sm hover:shadow-md transition-all text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700">
                                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Resolve
                              </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
