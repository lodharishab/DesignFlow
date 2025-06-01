
"use client";

import { useState, type ReactElement, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsersRound, Users, Phone, CalendarDays, PlusCircle, Mail, User, KeyRound } from 'lucide-react';
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

interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  level: string;
  avatarUrl: string;
  avatarHint: string;
  joinDate: Date;
  lastLogin: Date | null;
}

const initialUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', mobileNumber: '555-0101', level: 'Client', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', joinDate: new Date(2023, 0, 15), lastLogin: new Date(2024, 5, 1) },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', mobileNumber: '555-0102', level: 'Designer', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man avatar', joinDate: new Date(2022, 11, 5), lastLogin: new Date(2024, 5, 3) },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', mobileNumber: '555-0103', level: 'Client', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'person avatar', joinDate: new Date(2023, 2, 20), lastLogin: new Date(2024, 4, 28) },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', mobileNumber: '555-0104', level: 'Admin', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', joinDate: new Date(2022, 5, 10), lastLogin: new Date(2024, 5, 4) },
  { id: '5', name: 'Edward Scissorhands', email: 'edward@example.com', mobileNumber: '555-0105', level: 'Guest', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man silhouette', joinDate: new Date(2024, 0, 1), lastLogin: null },
];

const availableLevels = ['Client', 'Designer', 'Admin', 'Guest'];

export default function UserManagementPage(): ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    level: 'Client',
  });

  useEffect(() => {
    setUsers(initialUsers);
  }, []);

  const handleLevelChange = (userId: string, newLevel: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, level: newLevel } : user
      )
    );
  };

  const handleSaveChanges = (userId: string) => {
    const user = users.find(u => u.id === userId);
    console.log(`Saving changes for user ${user?.name}: New level ${user?.level}`);
    toast({
      title: "User Updated (Simulated)",
      description: `${user?.name}'s level changed to ${user?.level}. This is a simulation and not saved permanently.`,
      duration: 3000,
    });
  };

  const handleNewUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewUserData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleNewUserLevelChange = (value: string) => {
    setNewUserData(prev => ({ ...prev, level: value }));
  }

  const handleAddUser = () => {
    if (!newUserData.name || !newUserData.email || !newUserData.mobileNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
      level: newUserData.level,
      avatarUrl: 'https://placehold.co/40x40.png',
      avatarHint: 'person avatar',
      joinDate: new Date(),
      lastLogin: null,
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
    toast({
      title: "User Added (Simulated)",
      description: `${newUser.name} has been added to the list. This is a simulation and not saved permanently.`,
      duration: 3000,
    });
    setNewUserData({ name: '', email: '', mobileNumber: '', level: 'Client' });
    setIsAddUserDialogOpen(false);
  };

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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name
                </Label>
                <div className="col-span-3 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" value={newUserData.name} onChange={handleNewUserInputChange} className="pl-10" placeholder="John Doe" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={newUserData.email} onChange={handleNewUserInputChange} className="pl-10" placeholder="user@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mobileNumber" className="text-right">
                  Mobile
                </Label>
                <div className="col-span-3 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="mobileNumber" value={newUserData.mobileNumber} onChange={handleNewUserInputChange} className="pl-10" placeholder="555-0199" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">
                  Level
                </Label>
                <div className="col-span-3">
                  <Select value={newUserData.level} onValueChange={handleNewUserLevelChange}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLevels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          <CardDescription>View and manage user accounts and their access levels. Changes are simulated and not saved.</CardDescription>
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
                <TableHead className="w-[180px]">Level</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
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
                    <Select
                      value={user.level}
                      onValueChange={(newLevel) => handleLevelChange(user.id, newLevel)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLevels.map(level => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleSaveChanges(user.id)}>
                       Save
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

