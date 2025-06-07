
"use client";

import { useState, type ReactElement, useEffect, useMemo, ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  UsersRound, 
  Phone, 
  CalendarDays, 
  PlusCircle, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle as XCircleIcon,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Search
} from 'lucide-react';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Added AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  roles: string[];
  avatarUrl: string;
  avatarHint: string;
  joinDate: Date;
  lastLogin: Date | null;
  status: 'Active' | 'Suspended';
}

const initialUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', mobileNumber: '9876543210', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', joinDate: new Date(2023, 0, 15), lastLogin: new Date(2024, 5, 1), status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', mobileNumber: '8765432109', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man avatar', joinDate: new Date(2022, 11, 5), lastLogin: new Date(2024, 5, 3), status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', mobileNumber: '7654321098', roles: ['Client', 'Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'person avatar', joinDate: new Date(2023, 2, 20), lastLogin: new Date(2024, 4, 28), status: 'Suspended' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', mobileNumber: '6543210987', roles: ['Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', joinDate: new Date(2022, 5, 10), lastLogin: new Date(2024, 5, 4), status: 'Active' },
  { id: '5', name: 'Edward Scissorhands', email: 'edward@example.com', mobileNumber: '9988776655', roles: ['Guest'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man silhouette', joinDate: new Date(2024, 0, 1), lastLogin: null, status: 'Active' },
];

const availableRoles = ['Client', 'Designer', 'Admin', 'Guest'];
type UserStatus = 'Active' | 'Suspended';
const availableStatuses: UserStatus[] = ['Active', 'Suspended'];
type SortableUserKeys = 'name' | 'email' | 'joinDate' | 'lastLogin';

export default function UserManagementPage(): ReactElement {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [searchFilters, setSearchFilters] = useState({
    nameOrEmail: '',
    userId: '',
  });
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortableUserKeys | null; direction: 'ascending' | 'descending' }>({
    key: 'joinDate',
    direction: 'descending',
  });

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    roles: [] as string[],
    status: 'Active' as UserStatus,
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const requestSort = (key: SortableUserKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortableUserKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground/50" />;
    }
    // Swapped for intuitive sorting: ChevronDown for ascending (click to make descending), ChevronUp for descending (click to make ascending)
    return sortConfig.direction === 'ascending' ?
      <ChevronDown className="ml-1 h-4 w-4" /> : 
      <ChevronUp className="ml-1 h-4 w-4" />;
  };

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchFilters.nameOrEmail) {
      const searchTerm = searchFilters.nameOrEmail.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    if (searchFilters.userId) {
      filtered = filtered.filter(user => user.id.toLowerCase().includes(searchFilters.userId.toLowerCase()));
    }
    if (roleFilter !== 'All') {
      filtered = filtered.filter(user => user.roles.includes(roleFilter));
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        let comparison = 0;
        if (valA === null && valB !== null) comparison = -1;
        else if (valA !== null && valB === null) comparison = 1;
        else if (valA instanceof Date && valB instanceof Date) {
          comparison = valA.getTime() - valB.getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        }
        
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }
    return filtered;
  }, [users, searchFilters, roleFilter, statusFilter, sortConfig]);


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

  const handleNewUserStatusChange = (value: UserStatus) => {
    setNewUserData(prev => ({...prev, status: value}));
  }

  const validateIndianMobileNumber = (mobileNumber: string): boolean => {
    const indianMobileRegex = /^(?:\+91|0)?[6789]\d{9}$/;
    return indianMobileRegex.test(mobileNumber);
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

    if (!validateIndianMobileNumber(newUserData.mobileNumber)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9, optionally prefixed with +91 or 0).",
        variant: "destructive",
        duration: 4000,
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
      status: newUserData.status,
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
    toast({
      title: "User Added (Simulated)",
      description: `${newUser.name} has been added with roles: ${newUser.roles.join(', ')} and status: ${newUser.status}.`,
      duration: 3000,
    });
    setNewUserData({ name: '', email: '', mobileNumber: '', roles: [], status: 'Active' });
    setIsAddUserDialogOpen(false);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleSelectOne = (userId: string, checked: boolean | 'indeterminate') => {
    setSelectedUserIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (checked === true) newSelected.add(userId);
      else newSelected.delete(userId);
      return newSelected;
    });
  };
  
  const isAllDisplayedSelected = useMemo(() => {
    return filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length && filteredUsers.every(d => selectedUserIds.has(d.id));
  }, [filteredUsers, selectedUserIds]);

  const isIndeterminate = useMemo(() => {
    const displayedSelectedCount = filteredUsers.filter(d => selectedUserIds.has(d.id)).length;
    return displayedSelectedCount > 0 && displayedSelectedCount < filteredUsers.length;
  }, [filteredUsers, selectedUserIds]);


  const handleIndividualStatusChange = (userId: string, newStatus: UserStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    const user = users.find(u => u.id === userId);
    toast({
      title: `User Status Updated (Simulated)`,
      description: `${user?.name}'s status changed to ${newStatus}.`,
      duration: 3000,
    });
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const executeDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
    toast({
      title: "User Deleted (Simulated)",
      description: `User "${userToDelete.name}" has been removed.`,
      variant: "destructive",
      duration: 3000,
    });
    setSelectedUserIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userToDelete.id);
        return newSet;
    });
    setUserToDelete(null); 
  };
  
  const handleBulkStatusChange = (newStatus: UserStatus) => {
    setUsers(prevUsers =>
      prevUsers.map(u => 
        selectedUserIds.has(u.id) ? { ...u, status: newStatus } : u
      )
    );
    toast({
      title: `Bulk Status Update (Simulated)`,
      description: `${selectedUserIds.size} user(s) status changed to ${newStatus}.`,
      duration: 3000,
    });
    setSelectedUserIds(new Set());
  };
  
  const handleBulkDelete = () => {
    setUsers(prevUsers =>
      prevUsers.filter(u => !selectedUserIds.has(u.id))
    );
    toast({
      title: `Bulk Delete (Simulated)`,
      description: `${selectedUserIds.size} user(s) deleted.`,
      variant: "destructive",
      duration: 3000,
    });
    setSelectedUserIds(new Set());
  };

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Suspended': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" value={newUserData.name} onChange={handleNewUserInputChange} className="pl-10" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={newUserData.email} onChange={handleNewUserInputChange} className="pl-10" placeholder="user@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile*</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="mobileNumber" value={newUserData.mobileNumber} onChange={handleNewUserInputChange} className="pl-10" placeholder="e.g., 9876543210 or +919876543210" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Roles*</Label>
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
               <div className="space-y-2">
                <Label htmlFor="status">Status*</Label>
                <Select value={newUserData.status} onValueChange={handleNewUserStatusChange}>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
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
          <CardDescription>View and manage user accounts and their access roles. Changes are simulated.</CardDescription>
           <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
                <Label htmlFor="searchNameOrEmail" className="text-xs text-muted-foreground">Search Name/Email</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="searchNameOrEmail"
                    name="nameOrEmail"
                    placeholder="e.g., Alice or alice@example.com"
                    value={searchFilters.nameOrEmail}
                    onChange={handleSearchChange}
                    className="pl-9"
                    />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="searchUserId" className="text-xs text-muted-foreground">Search User ID</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="searchUserId"
                    name="userId"
                    placeholder="e.g., 1, 2"
                    value={searchFilters.userId}
                    onChange={handleSearchChange}
                    className="pl-9"
                    />
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="roleFilter" className="text-xs text-muted-foreground">Filter by Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger id="roleFilter"> <SelectValue placeholder="All Roles" /> </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Roles</SelectItem>
                        {availableRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-1">
                <Label htmlFor="statusFilter" className="text-xs text-muted-foreground">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | 'All')}>
                    <SelectTrigger id="statusFilter"> <SelectValue placeholder="All Statuses" /> </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        {availableStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
             </div>
           </div>
        </CardHeader>
        <CardContent>
         {selectedUserIds.size > 0 && (
            <div className="mb-4 p-3 bg-secondary/50 rounded-md flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedUserIds.size} user{selectedUserIds.size > 1 ? 's' : ''} selected
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline"> Bulk Actions <ChevronDown className="ml-2 h-4 w-4" /> </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Apply to selected</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Active')} className="text-green-600 dark:text-green-500">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Activate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange('Suspended')} className="text-red-600 dark:text-red-500">
                    <XCircleIcon className="mr-2 h-4 w-4" /> Suspend Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedUserIds.size} selected user(s)? This action cannot be undone. (Simulated)
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isIndeterminate ? 'indeterminate' : isAllDisplayedSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all displayed rows"
                    disabled={filteredUsers.length === 0}
                  />
                </TableHead>
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('name')} className="px-1 text-xs sm:text-sm -ml-2">Name {getSortIndicator('name')}</Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('email')} className="px-1 text-xs sm:text-sm -ml-2">
                        <Mail className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Email {getSortIndicator('email')}
                    </Button>
                </TableHead>
                <TableHead><Phone className="inline-block mr-1 h-4 w-4 text-muted-foreground" />Mobile</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('joinDate')} className="px-1 text-xs sm:text-sm -ml-2">
                         <CalendarDays className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Join Date {getSortIndicator('joinDate')}
                    </Button>
                </TableHead>
                 <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('lastLogin')} className="px-1 text-xs sm:text-sm -ml-2">
                         <CalendarDays className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />Last Login {getSortIndicator('lastLogin')}
                    </Button>
                </TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 && (
                 <TableRow><TableCell colSpan={10} className="text-center h-24">No users match filters.</TableCell></TableRow>
              )}
              {filteredUsers.map(user => (
                <TableRow 
                    key={user.id}
                    data-state={selectedUserIds.has(user.id) ? "selected" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUserIds.has(user.id)}
                      onCheckedChange={(checked) => handleSelectOne(user.id, checked)}
                      aria-label={`Select row for ${user.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.mobileNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{format(user.joinDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLogin ? format(user.lastLogin, 'MMM d, yyyy, p') : 'Never'}
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
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* Placeholder Links - these should navigate to actual view/edit pages */}
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/users/view/${user.id}`} className="flex items-center"> 
                                <Eye className="mr-2 h-4 w-4" /> View Details (soon)
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/users/edit/${user.id}`} className="flex items-center">
                                <Edit3 className="mr-2 h-4 w-4" /> Edit User (soon)
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === 'Active' ? (
                            <DropdownMenuItem onClick={() => handleIndividualStatusChange(user.id, 'Suspended')} className="text-orange-600 dark:text-orange-500">
                                <XCircleIcon className="mr-2 h-4 w-4" /> Suspend User
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => handleIndividualStatusChange(user.id, 'Active')} className="text-green-600 dark:text-green-500">
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Activate User
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => confirmDeleteUser(user)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {userToDelete && (
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm User Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the user "{userToDelete.name}" (ID: {userToDelete.id})? 
                This action cannot be undone. (Simulated)
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={executeDeleteUser} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

    
