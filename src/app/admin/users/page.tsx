"use client";

import { useState, type ReactElement } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsersRound, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialUsers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', level: 'Client', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', level: 'Designer', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man avatar' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', level: 'Client', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'person avatar' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', level: 'Admin', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar' },
  { id: '5', name: 'Edward Scissorhands', email: 'edward@example.com', level: 'Guest', avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man silhouette' },
];

const availableLevels = ['Client', 'Designer', 'Admin', 'Guest'];

interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  avatarUrl: string;
  avatarHint: string;
}

export default function UserManagementPage(): ReactElement {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();

  const handleLevelChange = (userId: string, newLevel: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, level: newLevel } : user
      )
    );
  };

  const handleSaveChanges = (userId: string) => {
    const user = users.find(u => u.id === userId);
    // In a real app, you'd send this to a backend API
    console.log(`Saving changes for user ${user?.name}: New level ${user?.level}`);
    toast({
      title: "User Updated (Simulated)",
      description: `${user?.name}'s level changed to ${user?.level}. This is a simulation and not saved permanently.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <UsersRound className="mr-3 h-8 w-8 text-primary" />
          User Management
        </h1>
        <Button onClick={() => toast({ title: "Coming Soon!", description: "Adding new users will be available in a future update."})}>
          <Users className="mr-2 h-4 w-4" /> Add New User
        </Button>
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
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
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
