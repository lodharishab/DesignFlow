
"use client";

import { useState, type ReactElement, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsersRound, Users, Phone, CalendarDays, PlusCircle, Mail, User, KeyRound, ShieldCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  roles: string[]; // Changed from level: string
  avatarUrl: string;
  avatarHint: string;
  joinDate: Date;
  lastLogin: Date | null;
}

const initialUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', mobileNumber: '555-0101', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', joinDate: new Date(2023, 0, 15), lastLogin: new Date(2024, 5, 1) },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', mobileNumber: '555-0102', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man avatar', joinDate: new Date(2022, 11, 5), lastLogin: new Date(2024, 5, 3) },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', mobileNumber: '555-0103', roles: ['Client', 'Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'person avatar', joinDate: new Date(2023, 2, 20), lastLogin: new Date(2024, 4, 28) },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', mobileNumber: '555-0104', roles: ['Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', joinDate: new Date(2022, 5, 10), lastLogin: new Date(2024, 5, 4) },
  { id: '5', name: 'Edward Scissorhands', email: 'edward@example.com', mobileNumber: '555-0105', roles: ['Guest'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man silhouette', joinDate: new Date(2024, 0, 1), lastLogin: null },
];

const availableRoles = ['Client', 'Designer', 'Admin', 'Guest'];

export default function UserManagementPage(): ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    roles: [] as string[],
  });

  useEffect(() => {
    setUsers(initialUsers);
  }, []);

  const handleNewUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewUserData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleNewUserRoleChange = (role: string, checked: boolean) => {
    setNewUserData(prev => {
      const currentRoles = prev.roles || [];
      if (checked) {
        return { ...prev, roles: [...currentRoles, role] };
      } else {
        return { ...prev, roles: currentRoles.filter(r => r !== role) };
      }
    });
  };

  const handleAddUser = () => {
    if (!newUserData.name || !newUserData.email || !newUserData.mobileNumber || newUserData.roles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one role.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: newUserData.name,
      email: newUserData.email,
      mobileNumber: newUserData.mobileNumber,
      roles: newUserData.roles,
      avatarUrl: 'https://placehold.co/40x40.png',
      avatarHint: 'person avatar',
      joinDate: new Date(),
      lastLogin: null,
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
    toast({
      title: "User Added (Simulated)",
      description: `${newUser.name} has been added with roles: ${newUser.roles.join(', ')}. This is a simulation.`,
      duration: 3000,
    });
    setNewUserData({ name: '', email: '', mobileNumber: '', roles: [] });
    setIsAddUserDialogOpen(false);
  };

  // Editing existing user roles via the table is removed for now.
  // A dedicated "Edit User" dialog would be needed for more complex role management.

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <UsersRound className="mr-3 h-8 w-8 text-primary" />
          User Management
        </h1>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Add New User</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new user to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4"> {/* Increased gap for better spacing */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" value={newUserData.name} onChange={handleNewUserInputChange} className="pl-10" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={newUserData.email} onChange={handleNewUserInputChange} className="pl-10" placeholder="user@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="mobileNumber" value={newUserData.mobileNumber} onChange={handleNewUserInputChange} className="pl-10" placeholder="555-0199" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                  {availableRoles.map(role => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={newUserData.roles.includes(role)}
                        onCheckedChange={(checked) => handleNewUserRoleChange(role, !!checked)}
                      />
                      <Label htmlFor={`role-${role}`} className="font-normal">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage user accounts and their access roles. Changes are simulated and not saved permanently.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[150px]">Mobile</TableHead>
                <TableHead className="w-[120px]">Join Date</TableHead>
                <TableHead className="w-[180px]">Roles</TableHead>
                {/* <TableHead className="text-right w-[120px]">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground/70" />
                      {user.mobileNumber}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                     <div className="flex items-center">
                       <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground/70" />
                       {format(user.joinDate, 'MMM d, yyyy')}
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <Badge key={role} variant={role === 'Admin' ? 'default' : 'secondary'}>
                          {role === 'Admin' && <ShieldCheck className="mr-1 h-3 w-3" />}
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  {/* 
                  <TableCell className="text-right">
                    Button for editing user details could go here in the future
                  </TableCell>
                  */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
