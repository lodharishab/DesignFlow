
"use client";

import { useState, type ReactElement, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, CreditCard, Banknote, ShieldCheck, User, Eye, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

type MethodType = 'Card' | 'UPI' | 'PayPal' | 'Bank Transfer';
type VerificationStatus = 'Verified' | 'Pending' | 'Rejected';

interface PaymentMethod {
  id: string;
  userId: string;
  userName: string;
  userRole: 'Client' | 'Designer';
  methodType: MethodType;
  identifier: string; // e.g., **** **** **** 4242 or abc***@okhdfc
  isPrimary: boolean;
  status: VerificationStatus;
  lastUpdated: Date;
}

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm_1', userId: 'usr001', userName: 'Priya Sharma', userRole: 'Client', methodType: 'Card', identifier: '**** **** **** 4242', isPrimary: true, status: 'Verified', lastUpdated: new Date(2024, 5, 1) },
  { id: 'pm_2', userId: 'usr003', userName: 'Aarav Patel', userRole: 'Client', methodType: 'UPI', identifier: 'aarav.patel@okhdfc', isPrimary: true, status: 'Verified', lastUpdated: new Date(2024, 4, 20) },
  { id: 'pm_3', userId: 'usr006', userName: 'Sneha Reddy', userRole: 'Client', methodType: 'Card', identifier: '**** **** **** 5555', isPrimary: false, status: 'Pending', lastUpdated: new Date(2024, 6, 18) },
  { id: 'pm_4', userId: 'usr002', userName: 'Rohan Kapoor', userRole: 'Designer', methodType: 'Bank Transfer', identifier: '********5678', isPrimary: true, status: 'Verified', lastUpdated: new Date(2023, 11, 5) },
  { id: 'pm_5', userId: 'des003', userName: 'Aisha Khan', userRole: 'Designer', methodType: 'PayPal', identifier: 'aisha.k***@example.com', isPrimary: true, status: 'Verified', lastUpdated: new Date(2024, 1, 20) },
  { id: 'pm_6', userId: 'des004', userName: 'Vikram Singh', userRole: 'Designer', methodType: 'Bank Transfer', identifier: '********1121', isPrimary: true, status: 'Rejected', lastUpdated: new Date(2024, 3, 10) },
];


function PaymentMethodsTable({ methods }: { methods: PaymentMethod[] }) {
    const { toast } = useToast();
    
    const getStatusBadgeVariant = (status: VerificationStatus) => {
        switch (status) {
            case 'Verified': return 'default';
            case 'Pending': return 'secondary';
            case 'Rejected': return 'destructive';
        }
    };

    const handleAction = (action: string, method: PaymentMethod) => {
        toast({
            title: `Action: ${action} (Simulated)`,
            description: `Performed '${action}' on payment method ${method.id} for ${method.userName}.`,
        });
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Method Type</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {methods.map((method) => (
                    <TableRow key={method.id}>
                        <TableCell>
                            <p className="font-medium">{method.userName}</p>
                            <p className="text-xs text-muted-foreground">{method.userRole}</p>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{method.methodType}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{method.identifier}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusBadgeVariant(method.status)}>{method.status}</Badge>
                        </TableCell>
                        <TableCell>{format(method.lastUpdated, 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> Details</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Method Details: {method.id}</DialogTitle>
                                        <DialogDescription>
                                            Detailed view for {method.userName}'s {method.methodType}.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 space-y-2">
                                        <p><strong>User:</strong> {method.userName} ({method.userId})</p>
                                        <p><strong>Method:</strong> {method.methodType} - {method.identifier}</p>
                                        <p><strong>KYC/Verification:</strong> {method.status}</p>
                                        <p><strong>Last Updated:</strong> {format(method.lastUpdated, 'PPpp')}</p>
                                    </div>
                                    <DialogFooter className="gap-2">
                                        <Button variant="secondary" onClick={() => handleAction('Resend Verification', method)}>
                                            <RefreshCw className="mr-2 h-4 w-4" /> Resend Verification
                                        </Button>
                                         <Button onClick={() => handleAction('Refresh Status', method)}>
                                            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function AdminPaymentSettingsPage(): ReactElement {
  
  const clientMethods = useMemo(() => mockPaymentMethods.filter(m => m.userRole === 'Client'), []);
  const designerMethods = useMemo(() => mockPaymentMethods.filter(m => m.userRole === 'Designer'), []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Settings className="mr-3 h-8 w-8 text-primary" />
          Payment Methods & Payout Settings
        </h1>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Manage Payment & Payout Methods</CardTitle>
          <CardDescription>
            Review saved client payment methods and designer payout details. Manage verification statuses as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="clients" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="clients">
                        <CreditCard className="mr-2 h-4 w-4"/> Client Payment Methods
                    </TabsTrigger>
                    <TabsTrigger value="designers">
                        <Banknote className="mr-2 h-4 w-4"/> Designer Payout Methods
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="clients" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Payment Methods</CardTitle>
                            <CardDescription>Saved payment methods used by clients for orders.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PaymentMethodsTable methods={clientMethods} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="designers" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Designer Payout Methods</CardTitle>
                            <CardDescription>Registered methods for designers to receive payments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PaymentMethodsTable methods={designerMethods} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
