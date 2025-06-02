
"use client";

import { useState, type ReactElement, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, PlusCircle, Edit3, Trash2, CheckCircle, XCircle, Eye, LinkIcon, CalendarDays, Mail } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
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

interface Designer {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarHint: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  joinDate: Date;
  servicesApproved: number;
  portfolioLink?: string;
}

const initialDesignersData: Designer[] = [
  { id: 'des001', name: 'Alice Wonderland', email: 'alice.w@example.com', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', status: 'Active', joinDate: new Date(2023, 5, 15), servicesApproved: 5, portfolioLink: '#' },
  { id: 'des002', name: 'Bob The Builder', email: 'bob.b@example.com', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man avatar', status: 'Pending Approval', joinDate: new Date(2023, 8, 20), servicesApproved: 0, portfolioLink: '#' },
  { id: 'des003', name: 'Carol Danvers', email: 'carol.d@example.com', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', status: 'Active', joinDate: new Date(2022, 11, 1), servicesApproved: 8, portfolioLink: '#' },
  { id: 'des004', name: 'David Copperfield', email: 'david.c@example.com', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man avatar', status: 'Suspended', joinDate: new Date(2023, 1, 10), servicesApproved: 2, portfolioLink: '#' },
];

export default function AdminDesignersPage(): ReactElement {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch designers from an API
    setDesigners(initialDesignersData);
  }, []);

  const handleStatusChange = (designerId: string, newStatus: Designer['status']) => {
    // Simulate API call for status change
    setDesigners(prevDesigners =>
      prevDesigners.map(d => (d.id === designerId ? { ...d, status: newStatus } : d))
    );
    const designer = designers.find(d => d.id === designerId);
    toast({
      title: `Designer Status Updated (Simulated)`,
      description: `${designer?.name}'s status changed to ${newStatus}.`,
      duration: 3000,
    });
  };

  const getStatusBadgeVariant = (status: Designer['status']) => {
    switch (status) {
      case 'Active':
        return 'default'; // Or a success-like variant if you add one
      case 'Pending Approval':
        return 'secondary';
      case 'Suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Manage Designers
        </h1>
        <Button asChild>
          {/* This link would eventually go to a '/admin/designers/new' page */}
          <Link href="#"> 
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Designer
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Designer Accounts</CardTitle>
          <CardDescription>View, approve, and manage designer profiles and their statuses. Status changes are simulated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead><Mail className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Email</TableHead>
                <TableHead className="w-[150px]"><CalendarDays className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Join Date</TableHead>
                <TableHead className="w-[120px] text-center">Services</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="text-right w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No designers found.
                  </TableCell>
                </TableRow>
              )}
              {designers.map(designer => (
                <TableRow key={designer.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={designer.avatarUrl} alt={designer.name} data-ai-hint={designer.avatarHint} />
                      <AvatarFallback>{designer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{designer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{designer.email}</TableCell>
                  <TableCell>{format(designer.joinDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-center">{designer.servicesApproved}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(designer.status)}>{designer.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {designer.status === 'Pending Approval' && (
                      <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700" onClick={() => handleStatusChange(designer.id, 'Active')}>
                        <CheckCircle className="mr-1 h-3 w-3" /> Approve
                      </Button>
                    )}
                     {designer.status === 'Active' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700" onClick={() => handleStatusChange(designer.id, 'Suspended')}>
                        <XCircle className="mr-1 h-3 w-3" /> Suspend
                      </Button>
                    )}
                     {designer.status === 'Suspended' && (
                      <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700" onClick={() => handleStatusChange(designer.id, 'Active')}>
                        <CheckCircle className="mr-1 h-3 w-3" /> Reactivate
                      </Button>
                    )}
                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/admin/designers/edit/${designer.id}`} aria-label={`Edit ${designer.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                    {designer.portfolioLink && (
                       <Button variant="outline" size="icon" asChild className="hover:text-primary">
                        <Link href={designer.portfolioLink} target="_blank" rel="noopener noreferrer" aria-label={`View ${designer.name}'s portfolio`}>
                          <LinkIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
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
