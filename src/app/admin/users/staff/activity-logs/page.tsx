
"use client";

import { useState, useEffect, type ReactElement, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Search, Calendar as CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import type { DateRange } from "react-day-picker";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { getAllAuditLogs, type AuditLog } from '@/lib/settings-db';

export default function StaffActivityLogsPage(): ReactElement {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState<string>('All');
    const [staffFilter, setStaffFilter] = useState<string>('All');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    useEffect(() => {
      getAllAuditLogs().then(setAuditLogs);
    }, []);

    const uniqueStaffNames = useMemo(() => Array.from(new Set(auditLogs.map(log => log.actorName || 'Unknown'))).sort(), [auditLogs]);
    const uniqueActionTypes = useMemo(() => Array.from(new Set(auditLogs.map(log => log.action))).sort(), [auditLogs]);

    const filteredLogs = useMemo(() => {
        return auditLogs.filter(log => {
            const searchTermLower = searchTerm.toLowerCase();
            const searchMatch = !searchTerm || 
                                log.targetId?.toLowerCase().includes(searchTermLower) || 
                                log.notes?.toLowerCase().includes(searchTermLower);

            const actionMatch = actionFilter === 'All' || log.action === actionFilter;
            const staffMatch = staffFilter === 'All' || log.actorName === staffFilter;
            const dateMatch = !dateRange || (
                dateRange.from && dateRange.to &&
                log.timestamp >= dateRange.from && log.timestamp <= dateRange.to
            );
            
            return searchMatch && actionMatch && staffMatch && dateMatch;
        }).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [auditLogs, searchTerm, actionFilter, staffFilter, dateRange]);


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                <History className="mr-3 h-8 w-8 text-primary" />
                Staff Activity Logs
                </h1>
            </div>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Activity Logs</CardTitle>
                    <CardDescription>Monitor actions performed by internal staff members.</CardDescription>
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                         <div className="space-y-1">
                            <Label htmlFor="search" className="text-xs">Search Target ID / IP</Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="search" placeholder="e.g., ORD7361P or IP address" className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="staffFilter" className="text-xs">Filter by Staff</Label>
                            <Select value={staffFilter} onValueChange={setStaffFilter}>
                                <SelectTrigger id="staffFilter"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Staff</SelectItem>
                                    {uniqueStaffNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="actionFilter" className="text-xs">Filter by Action</Label>
                            <Select value={actionFilter} onValueChange={(v) => setActionFilter(v as any)}>
                                <SelectTrigger id="actionFilter"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Actions</SelectItem>
                                    {uniqueActionTypes.map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                             <Label htmlFor="dateFilter" className="text-xs">Filter by Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button id="dateFilter" variant="outline" className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "LLL dd, y")) : <span>Pick a date range</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Member</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>IP Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <Link href={`/admin/users/staff/${log.actorId}`} className="font-medium text-primary hover:underline">
                                            {log.actorName || 'Unknown'}
                                        </Link>
                                    </TableCell>
                                    <TableCell><Badge variant="secondary">{log.action}</Badge></TableCell>
                                    <TableCell>
                                        <p className="font-medium">{log.targetId}</p>
                                        <p className="text-xs text-muted-foreground">{log.targetType}</p>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{format(log.timestamp, 'PPpp')}</TableCell>
                                    <TableCell className="font-mono text-xs">{log.notes || '-'}</TableCell>
                                </TableRow>
                            ))}
                            {filteredLogs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">No activity logs found for the selected filters.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
