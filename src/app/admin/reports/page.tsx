
"use client";

import { useState, useEffect, type ReactElement, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  User, 
  Eye, 
  CheckCircle2, 
  PlayCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { updateReportStatusAction } from '@/app/admin/reports/actions';
import { getAllReports, type Report } from '@/lib/reports-db';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type SortableReportKeys = 'id' | 'subject' | 'reporterName' | 'reportDate' | 'status';

export default function AdminReportsPage(): ReactElement {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    getAllReports().then(setReports);
  }, []);
  const [statusFilter, setStatusFilter] = useState<'All' | Report['status']>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortableReportKeys; direction: 'ascending' | 'descending' }>({
    key: 'reportDate',
    direction: 'descending',
  });

  const requestSort = (key: SortableReportKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortableReportKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="ml-1 h-4 w-4" /> :
      <ChevronDown className="ml-1 h-4 w-4" />;
  };

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
      setReports([]);
      getAllReports().then(setReports);
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const filteredReports = useMemo(() => {
    let sortableItems = [...reports];

    if (statusFilter !== 'All') {
      sortableItems = sortableItems.filter(report => report.status === statusFilter);
    }

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        let comparison = 0;
        if (valA === undefined || valA === null) comparison = -1;
        else if (valB === undefined || valB === null) comparison = 1;
        else if (valA instanceof Date && valB instanceof Date) {
          comparison = valA.getTime() - valB.getTime();
        } else {
          comparison = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
        }
        
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }

    return sortableItems;
  }, [reports, statusFilter, sortConfig]);

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
                  <TableHead className="w-[150px]">
                    <Button variant="ghost" onClick={() => requestSort('id')} className="px-1 text-xs sm:text-sm -ml-2">
                      Report ID {getSortIndicator('id')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('subject')} className="px-1 text-xs sm:text-sm -ml-2">
                      Subject {getSortIndicator('subject')}
                    </Button>
                  </TableHead>
                  <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('reporterName')} className="px-1 text-xs sm:text-sm -ml-2">
                      Reporter {getSortIndicator('reporterName')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('reportDate')} className="px-1 text-xs sm:text-sm -ml-2">
                      Date {getSortIndicator('reportDate')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('status')} className="px-1 text-xs sm:text-sm -ml-2">
                      Status {getSortIndicator('status')}
                    </Button>
                  </TableHead>
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" asChild className="shadow-sm hover:shadow-md transition-all h-9 w-9">
                                    <Link href={`/admin/reports/${report.id}`}>
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View Details</span>
                                    </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>View Details</p></TooltipContent>
                            </Tooltip>

                          {report.status === 'Open' && (
                             <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => handleUpdateStatus(report.id, 'In Progress')} className="shadow-sm hover:shadow-md transition-all h-9 w-9 text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-orange-700">
                                    <PlayCircle className="h-4 w-4" />
                                    <span className="sr-only">Start Progress</span>
                                </Button>
                               </TooltipTrigger>
                              <TooltipContent><p>Mark as In Progress</p></TooltipContent>
                            </Tooltip>
                          )}
                          
                          {(report.status === 'Open' || report.status === 'In Progress') && (
                             <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => handleUpdateStatus(report.id, 'Resolved')} className="shadow-sm hover:shadow-md transition-all h-9 w-9 text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="sr-only">Resolve</span>
                                </Button>
                               </TooltipTrigger>
                              <TooltipContent><p>Mark as Resolved</p></TooltipContent>
                            </Tooltip>
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

