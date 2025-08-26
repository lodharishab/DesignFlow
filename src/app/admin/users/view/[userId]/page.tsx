
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersRound, ArrowLeft, PackageSearch } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock user data for placeholder
interface UserDetail {
  id: string;
  name: string;
  email: string;
  roles: string[];
  joinDate: string;
  lastLogin?: string;
  status: string;
  // Add more fields as needed
}

const mockUsers: { [key: string]: UserDetail } = {
  'usr001': { id: 'usr001', name: 'Priya Sharma', email: 'priya.sharma@example.in', roles: ['Client'], joinDate: '2023-01-15', lastLogin: '2024-07-01', status: 'Active' },
  'staff001': { id: 'staff001', name: 'Aditi Singh', email: 'aditi.admin@example.in', roles: ['Admin'], joinDate: '2022-05-10', lastLogin: '2024-07-04', status: 'Active' },
};


export default function AdminViewUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // Simulate data fetching
      const foundUser = mockUsers[userId];
      setUser(foundUser || null);
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    return <div className="container mx-auto py-12 px-5 text-center">Loading user details...</div>;
  }

  if (!user) {
     return (
      <div className="container mx-auto py-12 px-5 text-center">
        <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
        <h1 className="mt-6 text-2xl font-semibold">User Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The user (ID: {userId}) you are looking for does not exist.
        </p>
        <Button asChild className="mt-6" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users List
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-headline flex items-center">
            <UsersRound className="mr-3 h-8 w-8 text-primary" />
            View User Details
            </h1>
            <Button variant="outline" asChild>
                <Link href="/admin/users">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users List
                </Link>
            </Button>
       </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>User: {user.name} (ID: {user.id})</CardTitle>
          <CardDescription>
            Detailed information for this user account. This page is a placeholder.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Roles:</span> {user.roles.join(', ')}</p>
          <p><span className="font-semibold">Status:</span> {user.status}</p>
          <p><span className="font-semibold">Join Date:</span> {user.joinDate}</p>
          <p><span className="font-semibold">Last Login:</span> {user.lastLogin || 'Never'}</p>
          
          <div className="pt-6">
            <h3 className="font-semibold text-lg mb-2">Placeholder Sections:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Order History (if client)</li>
                <li>Assigned Projects (if designer)</li>
                <li>Activity Log</li>
                <li>Membership Details (if applicable)</li>
                <li>Additional Admin Actions (e.g., impersonate, view logs)</li>
            </ul>
          </div>
           <Button asChild className="mt-6">
            <Link href={`/admin/users/edit/${user.id}`}>Edit User</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    