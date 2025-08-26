
"use client";

import { useState, type ReactElement, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCog, PlusCircle, Edit3, Trash2, Search, Phone, Mail, Calendar, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type StaffRole = 'Admin' | 'Manager' | 'Support Staff' | 'Accounts';
type StaffStatus = 'Active' | 'Suspended';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  joinDate: Date;
  lastLogin: Date | null;
}

const mockStaffData: StaffMember[] = [
  { id: 'staff001', name: 'Aditi Singh', email: 'aditi.admin@designflow.in', phone: '9876543211', role: 'Admin', status: 'Active', joinDate: new Date(2022, 5, 10), lastLogin: new Date(new Date().setDate(new Date().getDate() - 1)) },
  { id: 'staff002', name: 'Raj Mehta', email: 'raj.manager@designflow.in', phone: '9876543212', role: 'Manager', status: 'Active', joinDate: new Date(2023, 1, 1), lastLogin: new Date(new Date().setDate(new Date().getDate() - 2)) },
  { id: 'staff003', name: 'Sonia Gupta', email: 'sonia.support@designflow.in', phone: '9876543213', role: 'Support Staff', status: 'Active', joinDate: new Date(2023, 3, 15), lastLogin: new Date(new Date().setHours(new Date().getHours() - 4)) },
  { id: 'staff004', name: 'Anil Kumar', email: 'anil.accounts@designflow.in', phone: '9876543214', role: 'Accounts', status: 'Suspended', joinDate: new Date(2022, 9, 20), lastLogin: new Date(new Date().setMonth(new Date().getMonth() - 2)) },
];

const availableRoles: StaffRole[] = ['Admin', 'Manager', 'Support Staff', 'Accounts'];
const availableStatuses: StaffStatus[] = ['Active', 'Suspended'];

export default function StaffManagementPage(): ReactElement {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffData);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<StaffStatus | 'All'>('All');

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch = !searchTerm || member.name.toLowerCase().includes(searchTermLower) || member.email.toLowerCase().includes(searchTermLower);
      const roleMatch = roleFilter === 'All' || member.role === roleFilter;
      const statusMatch = statusFilter === 'All' || member.status === statusFilter;
      return searchMatch && roleMatch && statusMatch;
    });
  }, [staff, searchTerm, roleFilter, statusFilter]);

  const handleDeleteStaff = (staffId: string) => {
    // Simulate deletion
    setStaff(prev => prev.filter(s => s.id !== staffId));
    toast({
      title: "Staff Member Removed (Simulated)",
      description: `The staff member has been removed from the list.`,
      variant: "destructive"
    });
  };

  const getStatusBadgeVariant = (status: StaffMember['status']) => {
    return status === 'Active' ? 'default' : 'destructive';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <UserCog className="mr-3 h-8 w-8 text-primary" />
          Manage Staff & Managers
        </h1>
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Staff (Soon)
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Internal Staff</CardTitle>
          <CardDescription>View, search, and manage internal team members' accounts.</CardDescription>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
             <div className="space-y-1">
                <Label htmlFor="search" className="text-xs">Search Name/Email</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="search" placeholder="e.g., Aditi Singh" className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="roleFilter" className="text-xs">Filter by Role</Label>
                <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
                    <SelectTrigger id="roleFilter"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Roles</SelectItem>
                        {availableRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <Label htmlFor="statusFilter" className="text-xs">Filter by Status</Label>
                 <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                    <SelectTrigger id="statusFilter"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        {availableStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                 <TableRow><TableCell colSpan={6} className="text-center h-24">No staff members found.</TableCell></TableRow>
              ) : (
                filteredStaff.map(member => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>{member.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="flex items-center text-sm"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>{member.email}</p>
                      <p className="flex items-center text-sm text-muted-foreground"><Phone className="mr-2 h-4 w-4"/>{member.phone}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(member.status)}>{member.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                        {member.lastLogin ? formatDistanceToNow(member.lastLogin, { addSuffix: true }) : 'Never'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" asChild>
                         <Link href={`/admin/users/staff/${member.id}`}>
                           <Eye className="mr-2 h-4 w-4" /> Details
                         </Link>
                      </Button>
                      <Button variant="ghost" size="icon" disabled>
                        <Edit3 className="h-4 w-4" />
                        <span className="sr-only">Edit Staff</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
