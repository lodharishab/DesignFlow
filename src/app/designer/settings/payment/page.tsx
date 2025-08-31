
"use client";

import { useState, type ReactElement, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, Banknote, ShieldCheck, Edit, Trash2, Loader2, IndianRupee } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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


interface PayoutMethod {
  id: string;
  type: 'Bank Account' | 'UPI';
  details: string;
  isPrimary: boolean;
  status: 'Verified' | 'Pending';
}

const mockPayoutMethods: PayoutMethod[] = [
  { id: 'meth_1', type: 'Bank Account', details: '**** **** **** 5678', isPrimary: true, status: 'Verified' },
  { id: 'meth_2', type: 'UPI', details: 'designer@okhdfc', isPrimary: false, status: 'Pending' },
];

export default function DesignerPaymentSettingsPage(): ReactElement {
  const { toast } = useToast();
  const [methods, setMethods] = useState<PayoutMethod[]>(mockPayoutMethods);
  const [isSaving, setIsSaving] = useState(false);
  
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const handleSaveChanges = (e: FormEvent) => {
    e.preventDefault();
    if (!accountHolderName || !accountNumber || !ifscCode) {
        toast({ title: "Missing Information", description: "Please fill all the bank account fields.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    // Simulate API call
    console.log("Saving payout details:", { accountHolderName, accountNumber, ifscCode });
    setTimeout(() => {
      toast({
        title: "Payout Details Saved (Simulated)",
        description: "Your bank account details have been securely saved.",
      });
      setIsSaving(false);
    }, 1500);
  };
  
  const getStatusBadgeVariant = (status: PayoutMethod['status']) => {
    return status === 'Verified' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Settings className="mr-3 h-8 w-8 text-primary" />
        Payout Settings
      </h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Banknote className="mr-2 h-5 w-5"/>Manage Payout Methods</CardTitle>
          <CardDescription>Add and manage your bank account or UPI for receiving payments.</CardDescription>
        </CardHeader>
        <CardContent>
            {methods.map(method => (
                <div key={method.id} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                           <p className="font-semibold">{method.type}</p>
                           {method.isPrimary && <Badge>Primary</Badge>}
                        </div>
                        <p className="text-muted-foreground font-mono">{method.details}</p>
                        <Badge variant={getStatusBadgeVariant(method.status)} className="mt-1">{method.status}</Badge>
                    </div>
                    <div className="flex gap-2 self-start sm:self-center">
                        <Button variant="outline" size="icon" disabled><Edit className="h-4 w-4"/></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4"/></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will remove the payout method. You will need to add and verify a new one to receive payments.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Remove</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <form onSubmit={handleSaveChanges}>
            <CardHeader>
                <CardTitle className="flex items-center"><IndianRupee className="mr-2 h-5 w-5"/>Add Bank Account</CardTitle>
                <CardDescription>Enter your Indian bank account details for direct payouts. All information is encrypted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name (as per bank records)</Label>
                    <Input id="accountHolderName" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="e.g., Priya Sharma" required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter your bank account number" required/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input id="ifscCode" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="Enter your bank's IFSC code" required/>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <p className="text-xs text-muted-foreground">Your financial information is encrypted and stored securely.</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save Bank Account'}
                </Button>
            </CardFooter>
        </form>
      </Card>

    </div>
  );
}
