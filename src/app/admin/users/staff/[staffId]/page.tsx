
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    UserCog, ArrowLeft, Loader2, PackageSearch, Mail, Phone, CalendarDays, 
    ShieldCheck, Activity, KeyRound, Edit, History 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock Data
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
  avatarUrl: string;
  avatarHint: string;
}

const mockStaffData: StaffMember[] = [
  { id: 'staff001', name: 'Aditi Singh', email: 'aditi.admin@designflow.in', phone: '9876543211', role: 'Admin', status: 'Active', joinDate: new Date(2022, 5, 10), lastLogin: new Date(new Date().setDate(new Date().getDate() - 1)), avatarUrl: 'https://placehold.co/100x100.png', avatarHint: 'woman avatar' },
  { id: 'staff002', name: 'Raj Mehta', email: 'raj.manager@designflow.in', phone: '9876543212', role: 'Manager', status: 'Active', joinDate: new Date(2023, 1, 1), lastLogin: new Date(new Date().setDate(new Date().getDate() - 2)), avatarUrl: 'https://placehold.co/100x100.png', avatarHint: 'man avatar' },
  { id: 'staff003', name: 'Sonia Gupta', email: 'sonia.support@designflow.in', phone: '9876543213', role: 'Support Staff', status: 'Active', joinDate: new Date(2023, 3, 15), lastLogin: new Date(new Date().setHours(new Date().getHours() - 4)), avatarUrl: 'https://placehold.co/100x100.png', avatarHint: 'person avatar' },
  { id: 'staff004', name: 'Anil Kumar', email: 'anil.accounts@designflow.in', phone: '9876543214', role: 'Accounts', status: 'Suspended', joinDate: new Date(2022, 9, 20), lastLogin: new Date(new Date().setMonth(new Date().getMonth() - 2)), avatarUrl: 'https://placehold.co/100x100.png', avatarHint: 'man silhouette' },
];

const mockActivityHistory = [
    { action: 'Approved Designer Application', target: 'Priya Sharma', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { action: 'Updated Order Status', target: 'ORD7361P', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { action: 'Published Blog Post', target: 'Top 5 Logo Trends', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { action: 'Suspended User Account', target: 'Charlie Brown', timestamp: new Date(new Date().setDate(new Date().getDate() - 3)) },
];


function StaffDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const staffId = params.staffId as string;

  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (staffId) {
      const foundStaff = mockStaffData.find(s => s.id === staffId);
      setStaff(foundStaff || null);
      setIsLoading(false);
    }
  }, [staffId]);

  if (isLoading) {
    return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/></div>;
  }
  
  if (!staff) {
     return (
        <Card className="max-w-xl mx-auto">
            <CardHeader><CardTitle className="text-center">Staff Member Not Found</CardTitle></CardHeader>
            <CardFooter>
                 <Button asChild className="w-full"><Link href="/admin/users/staff"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back</Link></Button>
            </CardFooter>
        </Card>
     )
  }
  
  const getStatusBadgeVariant = (status: StaffStatus) => {
    return status === 'Active' ? 'default' : 'destructive';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
            <UserCog className="mr-3 h-8 w-8 text-primary" />
            Staff Profile
        </h1>
        <Button variant="outline" asChild>
            <Link href="/admin/users/staff"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Staff List</Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={staff.avatarUrl} alt={staff.name} data-ai-hint={staff.avatarHint} />
                            <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="font-headline text-2xl">{staff.name}</CardTitle>
                            <CardDescription>Role: {staff.role} | ID: {staff.id}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-muted-foreground flex items-center mb-1"><Mail className="mr-2 h-4 w-4" />Email Address</p>
                            <p>{staff.email}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground flex items-center mb-1"><Phone className="mr-2 h-4 w-4" />Phone Number</p>
                            <p>{staff.phone}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4" />Date Joined</p>
                            <p>{format(staff.joinDate, 'PPP')}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4" />Last Login</p>
                            <p>{staff.lastLogin ? format(staff.lastLogin, 'PPpp') : 'Never'}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-muted-foreground flex items-center mb-1"><Activity className="mr-2 h-4 w-4" />Account Status</p>
                            <Badge variant={getStatusBadgeVariant(staff.status)}>{staff.status}</Badge>
                        </div>
                         <div>
                            <p className="font-semibold text-muted-foreground flex items-center mb-1"><ShieldCheck className="mr-2 h-4 w-4" />Role & Permissions</p>
                            <p>{staff.role}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5"/>Recent Activity</CardTitle>
                    <CardDescription>Last 10 actions performed by this user (placeholder).</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockActivityHistory.map((log, index) => (
                                <TableRow key={index}>
                                    <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                                    <TableCell>{log.target}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{formatDistanceToNow(log.timestamp, { addSuffix: true })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" disabled><Edit className="mr-2 h-4 w-4"/>Edit Role (Soon)</Button>
                    <Button variant="outline" className="w-full justify-start" disabled><KeyRound className="mr-2 h-4 w-4"/>Reset Password (Soon)</Button>
                    <Button variant={staff.status === 'Active' ? 'destructive' : 'default'} className="w-full justify-start" disabled>
                        {staff.status === 'Active' ? <Activity className="mr-2 h-4 w-4"/> : <Activity className="mr-2 h-4 w-4"/>}
                        {staff.status === 'Active' ? 'Suspend Account (Soon)' : 'Activate Account (Soon)'}
                    </Button>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Admin Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="admin-notes" className="sr-only">Admin Notes</Label>
                    <Textarea id="admin-notes" placeholder="Add internal notes about this staff member..." rows={4} />
                    <Button className="w-full mt-3">Save Note</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

export default function StaffDetailPage() {
    return (
        <Suspense fallback={<div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/></div>}>
            <StaffDetailContent />
        </Suspense>
    )
}
