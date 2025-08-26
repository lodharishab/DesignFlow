"use client";

import { useState, type ReactElement } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCog, PlusCircle, Edit3, Trash2 } from 'lucide-react';
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
import { format } from 'date-fns';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Support Staff' | 'Accounts';
  status: 'Active' | 'Suspended';
  joinDate: Date;
}

const mockStaffData: StaffMember[] = [
  { id: 'staff001', name: 'Aditi Singh', email: 'aditi.admin@designflow.in', role: 'Admin', status: 'Active', joinDate: new Date(2022, 5, 10) },
  { id: 'staff002', name: 'Raj Mehta', email: 'raj.manager@designflow.in', role: 'Manager', status: 'Active', joinDate: new Date(2023, 1, 1) },
  { id: 'staff003', name: 'Sonia Gupta', email: 'sonia.support@designflow.in', role: 'Support Staff', status: 'Active', joinDate: new Date(2023, 3, 15) },
  { id: 'staff004', name: 'Anil Kumar', email: 'anil.accounts@designflow.in', role: 'Accounts', status: 'Suspended', joinDate: new Date(2022, 9, 20) },
];

export default function StaffManagementPage(): ReactElement {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffData);
  const { toast } = useToast();

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
          <CardDescription>View and manage internal team members' accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>{member.role}</Badge>
                  </TableCell>
                  <TableCell>{format(member.joinDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.status)}>{member.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" disabled>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="hover:text-destructive" disabled>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the staff account for "{member.name}". This is a placeholder action.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteStaff(member.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
