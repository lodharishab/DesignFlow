
"use client";

import { useState, type ReactElement, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, Banknote, ShieldCheck, Edit, Trash2, Loader2, IndianRupee, Wallet, Mail, SlidersHorizontal, RefreshCw, Calendar, Globe } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
  
  // State for Payout Preferences
  const [payoutFrequency, setPayoutFrequency] = useState('monthly');
  const [payoutThreshold, setPayoutThreshold] = useState('500');
  const [preferredCurrency, setPreferredCurrency] = useState('INR');
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);


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
      setAccountHolderName('');
      setAccountNumber('');
      setIfscCode('');
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
       setUpiId('');
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
      setPaypalEmail('');
    }, 1500);
  };

  const handleDeleteMethod = (methodId: string) => {
    const methodToRemove = methods.find(m => m.id === methodId);
    if (!methodToRemove) return;
    
    setMethods(prev => prev.filter(m => m.id !== methodId));
    toast({
        title: "Method Removed",
        description: `Your ${methodToRemove.type} has been removed.`,
        variant: "destructive"
    });
  }
  
  const getStatusBadgeVariant = (status: PayoutMethod['status']) => {
    return status === 'Verified' ? 'default' : 'secondary';
  };
  
  const handleSavePreferences = (e: FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    console.log("Saving preferences:", { payoutFrequency, payoutThreshold, preferredCurrency });
    setTimeout(() => {
        toast({
            title: "Preferences Saved (Simulated)",
            description: "Your payout preferences have been updated."
        });
        setIsSavingPrefs(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Settings className="mr-3 h-8 w-8 text-primary" />
        Payout Settings
      </h1>

      <Card className="shadow-lg bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg"><Wallet className="mr-2 h-5 w-5"/>Current Primary Payout Method</CardTitle>
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
        <CardFooter>
            <Button variant="outline">Manage Methods</Button>
        </CardFooter>
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
                                    This action will remove the payout method: {method.type} - {method.details}. You will need to add and verify a new one to receive payments.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMethod(method.id)}>Remove</AlertDialogAction>
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
            <CardTitle className="flex items-center"><SlidersHorizontal className="mr-2 h-5 w-5"/>Payout Preferences</CardTitle>
            <CardDescription>Control how and when you receive your payouts.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSavePreferences}>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="payout-frequency" className="flex items-center"><Calendar className="mr-2 h-4 w-4"/>Payout Frequency</Label>
                        <Select value={payoutFrequency} onValueChange={setPayoutFrequency}>
                            <SelectTrigger id="payout-frequency"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="bi-weekly">Bi-weekly (Every 2 weeks)</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payout-threshold" className="flex items-center"><IndianRupee className="mr-2 h-4 w-4"/>Minimum Payout Threshold (INR)</Label>
                        <Input id="payout-threshold" type="number" value={payoutThreshold} onChange={(e) => setPayoutThreshold(e.target.value)} placeholder="e.g., 500" />
                        <p className="text-xs text-muted-foreground">Payouts will only be processed once your balance exceeds this amount.</p>
                    </div>
                </div>
                <div className="space-y-2 md:w-1/2 md:pr-3">
                    <Label htmlFor="preferred-currency" className="flex items-center"><Globe className="mr-2 h-4 w-4"/>Preferred Currency</Label>
                    <Select value={preferredCurrency} onValueChange={setPreferredCurrency}>
                        <SelectTrigger id="preferred-currency"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                            <SelectItem value="USD" disabled>USD (US Dollar) - Coming Soon</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={isSavingPrefs}>
                    {isSavingPrefs ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSavingPrefs ? 'Saving...' : 'Save Preferences'}
                </Button>
            </CardFooter>
        </form>
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
