
"use client";

import { useState, useEffect, type ReactElement, type ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  UsersRound, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Activity, 
  CalendarDays, 
  Save, 
  XCircle, 
  Loader2,
  UserCircle2,
  Briefcase,
  UserCog,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

// Duplicating User interface and initialUsers for prototype simplicity
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

type UserStatus = 'Active' | 'Suspended';

const initialUsersData: User[] = [ // Using a different name to avoid conflict if imported
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', mobileNumber: '9876543210', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', joinDate: new Date(2023, 0, 15), lastLogin: new Date(2024, 5, 1), status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', mobileNumber: '8765432109', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man avatar', joinDate: new Date(2022, 11, 5), lastLogin: new Date(2024, 5, 3), status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', mobileNumber: '7654321098', roles: ['Client', 'Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'person avatar', joinDate: new Date(2023, 2, 20), lastLogin: new Date(2024, 4, 28), status: 'Suspended' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', mobileNumber: '6543210987', roles: ['Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'woman avatar', joinDate: new Date(2022, 5, 10), lastLogin: new Date(2024, 5, 4), status: 'Active' },
  { id: '5', name: 'Edward Scissorhands', email: 'edward@example.com', mobileNumber: '9988776655', roles: ['Guest'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'man silhouette', joinDate: new Date(2024, 0, 1), lastLogin: null, status: 'Active' },
];

const availableRoles = ['Client', 'Designer', 'Admin', 'Guest'];
const availableStatuses: UserStatus[] = ['Active', 'Suspended'];


export default function AdminEditUserPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);


  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      const foundUser = initialUsersData.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setName(foundUser.name);
        setEmail(foundUser.email);
        setMobileNumber(foundUser.mobileNumber);
        setStatus(foundUser.status);
        setSelectedRoles([...foundUser.roles]);
      } else {
        toast({
          title: "Error",
          description: "User not found.",
          variant: "destructive",
        });
        router.push('/admin/users');
      }
      setIsLoading(false);
    }
  }, [userId, router, toast]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'mobileNumber') setMobileNumber(value);
  };

  const handleStatusChange = (value: UserStatus) => {
    setStatus(value);
  };

  const handleRoleChange = (role: string, checked: boolean | 'indeterminate') => {
    setSelectedRoles(prev => {
      const newRoles = new Set(prev);
      if (checked) {
        newRoles.add(role);
      } else {
        newRoles.delete(role);
      }
      return Array.from(newRoles);
    });
  };

  const validateIndianMobileNumber = (mobile: string): boolean => {
    const indianMobileRegex = /^(?:\+91|0)?[6789]\d{9}$/;
    return indianMobileRegex.test(mobile);
  };

  const handleSaveChanges = () => {
    if (!mobileNumber.trim() || selectedRoles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Mobile number and at least one role are required.",
        variant: "destructive",
      });
      return;
    }
    if (!validateIndianMobileNumber(mobileNumber)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid Indian mobile number.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    // Simulate saving user (in a real app, this would be an API call)
    console.log("Saving updated user:", { id: userId, name, email, mobileNumber, roles: selectedRoles, status });
    
    // Update the mock data (for prototype only)
    const userIndex = initialUsersData.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      initialUsersData[userIndex] = {
        ...initialUsersData[userIndex],
        mobileNumber,
        roles: selectedRoles,
        status,
      };
    }

    setTimeout(() => {
      toast({
        title: "User Updated (Simulated)",
        description: `User "${name}" has been successfully updated.`,
      });
      setIsSaving(false);
      router.push('/admin/users'); 
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return <p>User not found.</p>; 
  }

  const getRoleIcon = (role: string) => {
    if (role === 'Admin') return <UserCog className="mr-2 h-4 w-4 text-primary" />;
    if (role === 'Designer') return <Briefcase className="mr-2 h-4 w-4 text-green-600" />;
    if (role === 'Client') return <UserCircle2 className="mr-2 h-4 w-4 text-blue-600" />;
    return <UserCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />;
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <UsersRound className="mr-3 h-8 w-8 text-primary" />
          Edit User Profile
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
                <CardDescription>User ID: {user.id} &bull; Email: {user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name"><UserCircle2 className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Full Name</Label>
              <Input id="name" value={name} disabled />
              <p className="text-xs text-muted-foreground">Name and email are typically managed via user's own profile settings or identity provider.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email"><Mail className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Email Address</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mobileNumber"><Phone className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Mobile Number*</Label>
              <Input 
                id="mobileNumber" 
                value={mobileNumber}
                onChange={handleInputChange}
                disabled={isSaving}
                placeholder="e.g., 9876543210"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="status"><Activity className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Account Status*</Label>
              <Select value={status} onValueChange={handleStatusChange} disabled={isSaving}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

           <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Manage Roles*
            </h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md bg-secondary/30">
              {availableRoles.map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={(checked) => handleRoleChange(role, checked)}
                    disabled={isSaving}
                  />
                  <Label htmlFor={`role-${role}`} className="font-normal flex items-center text-sm">
                    {getRoleIcon(role)} {role}
                  </Label>
                </div>
              ))}
            </div>
            {selectedRoles.includes('Admin') && (
                <div className="mt-3 flex items-center text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/30 p-3 rounded-md border border-orange-200 dark:border-orange-700">
                    <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
                    Granting 'Admin' role provides full system access. Use with caution.
                </div>
            )}
          </div>

          <Separator />
          
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
                <span className="text-muted-foreground flex items-center"><CalendarDays className="inline-block mr-2 h-4 w-4" />Join Date:</span>
                <p className="font-medium">{format(user.joinDate, 'PPpp')}</p>
            </div>
            <div className="space-y-1">
                <span className="text-muted-foreground flex items-center"><CalendarDays className="inline-block mr-2 h-4 w-4" />Last Login:</span>
                 <p className="font-medium">{user.lastLogin ? format(user.lastLogin, 'PPpp') : 'Never'}</p>
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" asChild disabled={isSaving}>
            <Link href="/admin/users">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    