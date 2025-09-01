
"use client";

import { useState, type ReactElement, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, Banknote, ShieldCheck, Edit, Trash2, Loader2, IndianRupee, Wallet, Mail } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';


interface PayoutMethod {
  id: string;
  type: 'Bank Account' | 'UPI' | 'PayPal';
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
  
  // State for Bank Transfer form
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // State for UPI form
  const [upiId, setUpiId] = useState('');
  
  // State for PayPal form
  const [paypalEmail, setPaypalEmail] = useState('');


  const primaryMethod = methods.find(m => m.isPrimary);

  const handleBankSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!accountHolderName || !accountNumber || !ifscCode) {
        toast({ title: "Missing Information", description: "Please fill all the bank account fields.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    console.log("Saving new Bank Account:", { accountHolderName, accountNumber, ifscCode });
    setTimeout(() => {
      toast({ title: "Bank Account Added (Simulated)", description: "Your bank account details have been added and are pending verification.", });
      setIsSaving(false);
      setMethods(prev => [...prev, {id: `meth_${Date.now()}`, type: 'Bank Account', details: `**** **** **** ${accountNumber.slice(-4)}`, isPrimary: prev.length === 0, status: 'Pending'}]);
    }, 1500);
  };
  
   const handleUpiSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) {
      toast({ title: "Missing Information", description: "Please enter your UPI ID.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    console.log("Saving new UPI ID:", { upiId });
    setTimeout(() => {
      toast({ title: "UPI ID Added (Simulated)", description: "Your UPI ID has been added and is pending verification." });
      setIsSaving(false);
       setMethods(prev => [...prev, {id: `meth_${Date.now()}`, type: 'UPI', details: upiId, isPrimary: prev.length === 0, status: 'Pending'}]);
    }, 1500);
  };
  
  const handlePaypalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!paypalEmail.trim()) {
      toast({ title: "Missing Information", description: "Please enter your PayPal email.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    console.log("Saving new PayPal Email:", { paypalEmail });
    setTimeout(() => {
      toast({ title: "PayPal Added (Simulated)", description: "Your PayPal email has been added." });
      setIsSaving(false);
      setMethods(prev => [...prev, {id: `meth_${Date.now()}`, type: 'PayPal', details: paypalEmail, isPrimary: prev.length === 0, status: 'Verified'}]);
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

      <Card className="shadow-lg bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg"><Wallet className="mr-2 h-5 w-5"/>Current Payout Method</CardTitle>
        </CardHeader>
        <CardContent>
          {primaryMethod ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-xl">{primaryMethod.type}: <span className="font-mono">{primaryMethod.details}</span></p>
                <div className="flex items-center gap-2 mt-1">
                   <Badge variant={getStatusBadgeVariant(primaryMethod.status)}>{primaryMethod.status}</Badge>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No primary payout method has been set up.</p>
          )}
        </CardContent>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Banknote className="mr-2 h-5 w-5"/>Manage Payout Methods</CardTitle>
          <CardDescription>View your saved payout methods. You can only have one primary method.</CardDescription>
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
          <CardHeader>
              <CardTitle className="flex items-center">Add New Payout Method</CardTitle>
              <CardDescription>Add a new method to receive your earnings.</CardDescription>
          </CardHeader>
          <CardContent>
              <Tabs defaultValue="bank" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="bank"><IndianRupee className="mr-2 h-4 w-4"/>Bank Account</TabsTrigger>
                      <TabsTrigger value="upi"><Wallet className="mr-2 h-4 w-4"/>UPI</TabsTrigger>
                      <TabsTrigger value="paypal"><Mail className="mr-2 h-4 w-4"/>PayPal</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bank" className="mt-6">
                      <form onSubmit={handleBankSubmit} className="space-y-4">
                           <div className="space-y-2">
                              <Label htmlFor="accountHolderName">Account Holder Name (as per bank records)*</Label>
                              <Input id="accountHolderName" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="e.g., Priya Sharma" required disabled={isSaving}/>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="accountNumber">Account Number*</Label>
                              <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter your bank account number" required disabled={isSaving}/>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="ifscCode">IFSC Code*</Label>
                              <Input id="ifscCode" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="Enter your bank's IFSC code" required disabled={isSaving}/>
                          </div>
                           <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isSaving}>
                                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                  {isSaving ? 'Saving...' : 'Save Bank Account'}
                              </Button>
                           </div>
                      </form>
                  </TabsContent>
                  <TabsContent value="upi" className="mt-6">
                       <form onSubmit={handleUpiSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="upiId">UPI ID*</Label>
                            <Input id="upiId" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g., yourname@okhdfc" required disabled={isSaving}/>
                          </div>
                           <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isSaving}>
                                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                  {isSaving ? 'Saving...' : 'Save UPI ID'}
                              </Button>
                           </div>
                       </form>
                  </TabsContent>
                  <TabsContent value="paypal" className="mt-6">
                        <form onSubmit={handlePaypalSubmit} className="space-y-4">
                           <div className="space-y-2">
                              <Label htmlFor="paypalEmail">PayPal Email Address*</Label>
                              <Input id="paypalEmail" type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="e.g., you@example.com" required disabled={isSaving}/>
                           </div>
                           <div className="flex justify-end pt-2">
                              <Button type="submit" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSaving ? 'Saving...' : 'Save PayPal'}
                            </Button>
                           </div>
                       </form>
                  </TabsContent>
              </Tabs>
          </CardContent>
      </Card>

    </div>
  );
}
