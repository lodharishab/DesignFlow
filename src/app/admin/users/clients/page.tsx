
"use client";

import { useState, type ReactElement, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon, 
  PlusCircle, 
  Mail, 
  Eye
} from 'lucide-react';
import { initialUsersData, type User } from '@/app/admin/users/users-data';

export default function AdminClientsPage(): ReactElement {
  const [clients, setClients] = useState<User[]>([]);

  useMemo(() => {
    const clientUsers = initialUsersData.filter(user => user.roles.includes('Client'));
    setClients(clientUsers);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <UserIcon className="mr-3 h-8 w-8 text-primary" />
          Manage Clients
        </h1>
        <Button asChild>
          <Link href="/admin/users/new"> 
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Client Accounts</CardTitle>
          <CardDescription>This is a filtered view showing only users with the 'Client' role.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
              {clients.map(client => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.email}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === 'Active' ? 'default' : 'destructive'}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" asChild className="hover:text-primary">
                       <Link href={`/admin/users/edit/${client.id}`} aria-label={`Edit ${client.name}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
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
