
"use client";

import { useState, useEffect, type ReactElement, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, Banknote, ShieldCheck, Edit, Trash2, Loader2, IndianRupee, Wallet, Mail, SlidersHorizontal, RefreshCw, Calendar, Globe, History, Download, FileText, ArrowRight, Bell, CircleHelp, Upload } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getPaymentMethodsByUser, getPayoutRequestsByDesigner, type PaymentMethod as DbPaymentMethod, type PayoutRequest } from '@/lib/transactions-db';

const CURRENT_DESIGNER_ID = 'des001';

interface PayoutMethod {
  id: string;
  type: 'Bank Account' | 'UPI' | 'PayPal';
  details: string;
  isPrimary: boolean;
  status: 'Verified' | 'Pending';
}

function mapDbToPayoutMethod(m: DbPaymentMethod): PayoutMethod {
  return {
    id: m.id,
    type: (m.methodType || 'Bank Account') as PayoutMethod['type'],
    details: m.identifier,
    isPrimary: m.isPrimary,
    status: (m.status === 'Verified' ? 'Verified' : 'Pending') as PayoutMethod['status'],
  };
}

interface PayoutHistoryItem {
  id: string;
  date: Date;
  amount: number;
  method: string;
  status: string;
  relatedOrderId?: string;
}

function mapDbToPayout(p: PayoutRequest): PayoutHistoryItem {
  return {
    id: p.id,
    date: p.requestDate,
    amount: p.amount,
    method: p.reason || 'Bank Transfer',
    status: p.status,
    relatedOrderId: p.orderId,
  };
}

const countryCurrencyMap: Record<string, string> = {
    'India': 'INR',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Germany': 'EUR',
    'Singapore': 'SGD',
};
const countries = Object.keys(countryCurrencyMap);
const currencies = ['INR', 'USD', 'GBP', 'EUR'];

export default function DesignerPaymentSettingsPage(): ReactElement {
  const { toast } = useToast();
  const [methods, setMethods] = useState<PayoutMethod[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getPaymentMethodsByUser(CURRENT_DESIGNER_ID).then(dbMethods =>
      setMethods(dbMethods.map(mapDbToPayoutMethod))
    );
    getPayoutRequestsByDesigner(CURRENT_DESIGNER_ID).then(dbPayouts =>
      setPayoutHistory(dbPayouts.map(mapDbToPayout))
    );
  }, []);
  
  // State for Bank Transfer form
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [swiftBic, setSwiftBic] = useState('');
  const [accountType, setAccountType] = useState('');
  const [country, setCountry] = useState('India');
  const [currency, setCurrency] = useState('INR');
  const [bankProof, setBankProof] = useState<File | null>(null);
  const [setAsPrimary, setSetAsPrimary] = useState(false);
  

  // State for UPI form
  const [upiId, setUpiId] = useState('');
  
  // State for PayPal form
  const [paypalEmail, setPaypalEmail] = useState('');
  
  // State for Payout Preferences
  const [payoutFrequency, setPayoutFrequency] = useState('monthly');
  const [payoutThreshold, setPayoutThreshold] = useState('500');
  const [preferredCurrency, setPreferredCurrency] = useState('INR');
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // State for Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    payoutFailed: true,
    reVerification: true,
    payoutTriggered: false,
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  const primaryMethod = methods.find(m => m.isPrimary);

  const handleCountryChange = (selectedCountry: string) => {
      setCountry(selectedCountry);
      setCurrency(countryCurrencyMap[selectedCountry] || 'INR');
  };

  const handleBankSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName || !accountType || !country || !currency) {
        toast({ title: "Missing Information", description: "Please fill all required bank account fields.", variant: "destructive" });
        return;
    }
    if (accountNumber !== confirmAccountNumber) {
        toast({ title: "Account Numbers Mismatch", description: "The account numbers you entered do not match.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    console.log("Saving new Bank Account:", { accountHolderName, accountNumber, ifscCode, bankProof: bankProof?.name, setAsPrimary });
    setTimeout(() => {
      toast({ title: "Bank Account Added", description: "Your bank account has been added successfully and is pending verification.", });
      setIsSaving(false);
      setMethods(prev => {
          let updatedMethods = [...prev];
          if (setAsPrimary) {
              updatedMethods = updatedMethods.map(m => ({ ...m, isPrimary: false }));
          }
          return [...updatedMethods, {id: `meth_${Date.now()}`, type: 'Bank Account', details: `**** **** **** ${accountNumber.slice(-4)}`, isPrimary: setAsPrimary || prev.length === 0, status: 'Pending'}];
      });
      setAccountHolderName('');
      setAccountNumber('');
      setConfirmAccountNumber('');
      setBankName('');
      setIfscCode('');
      setSwiftBic('');
      setAccountType('');
      setCountry('India');
      setCurrency('INR');
      setBankProof(null);
      setSetAsPrimary(false);
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

  const handleNotificationPrefChange = (pref: keyof typeof notificationPrefs, checked: boolean) => {
    setNotificationPrefs(prev => ({...prev, [pref]: checked}));
  }

  const handleSaveNotifications = (e: FormEvent) => {
      e.preventDefault();
      setIsSavingNotifications(true);
      console.log("Saving notification preferences:", notificationPrefs);
      setTimeout(() => {
          toast({ title: "Notification Settings Saved" });
          setIsSavingNotifications(false);
      }, 1000);
  };

  return (
    <TooltipProvider>
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
         <CardFooter className="pt-4 border-t">
            <Button variant="link" asChild className="p-0 h-auto text-xs text-muted-foreground">
                <Link href="/contact-support?topic=payouts">
                    <CircleHelp className="mr-1.5 h-3.5 w-3.5" />
                    Having issues with your payouts? Contact Support.
                </Link>
            </Button>
        </CardFooter>
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
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountNumber">Account Number / IBAN*</Label>
                                <Input id="accountNumber" type="password" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter account number" required disabled={isSaving}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmAccountNumber">Confirm Account Number*</Label>
                                <Input id="confirmAccountNumber" type="password" value={confirmAccountNumber} onChange={(e) => setConfirmAccountNumber(e.target.value)} placeholder="Confirm account number" required disabled={isSaving}/>
                            </div>
                          </div>
                           <div className="grid md:grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <Label htmlFor="bankName">Bank Name*</Label>
                                  <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., HDFC Bank" required disabled={isSaving}/>
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor="accountType">Account Type*</Label>
                                  <Select value={accountType} onValueChange={setAccountType} required>
                                    <SelectTrigger id="accountType"><SelectValue placeholder="Select account type..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Savings">Savings</SelectItem>
                                        <SelectItem value="Current">Current</SelectItem>
                                        <SelectItem value="Business">Business</SelectItem>
                                    </SelectContent>
                                  </Select>
                              </div>
                           </div>
                           <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                     <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Label htmlFor="ifscCode" className="flex items-center gap-1 cursor-help">IFSC / Routing Number* <CircleHelp className="h-3 w-3 text-muted-foreground"/></Label>
                                        </TooltipTrigger>
                                        <TooltipContent><p>IFSC for Indian banks, Routing Number for US banks.</p></TooltipContent>
                                    </Tooltip>
                                    <Input id="ifscCode" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="Enter IFSC or Routing Number" required disabled={isSaving}/>
                                </div>
                                <div className="space-y-2">
                                     <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Label htmlFor="swiftBic" className="flex items-center gap-1 cursor-help">SWIFT/BIC Code (Optional) <CircleHelp className="h-3 w-3 text-muted-foreground"/></Label>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Required for international payouts outside of certain regions.</p></TooltipContent>
                                    </Tooltip>
                                    <Input id="swiftBic" value={swiftBic} onChange={(e) => setSwiftBic(e.target.value)} placeholder="For international payouts" disabled={isSaving}/>
                                </div>
                           </div>
                             <div className="grid md:grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <Label htmlFor="country">Country*</Label>
                                  <Select value={country} onValueChange={handleCountryChange} required>
                                      <SelectTrigger id="country"><SelectValue placeholder="Select country..." /></SelectTrigger>
                                      <SelectContent>
                                        {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor="currency">Currency*</Label>
                                  <Select value={currency} onValueChange={setCurrency} required>
                                      <SelectTrigger id="currency"><SelectValue placeholder="Select currency..." /></SelectTrigger>
                                      <SelectContent>
                                        {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                              </div>
                           </div>
                            <div className="space-y-2">
                                <Label htmlFor="bankProof">Upload Bank Proof (Cancelled Cheque, Statement)*</Label>
                                <div className="flex items-center gap-2">
                                  <Upload className="h-4 w-4 text-muted-foreground" />
                                  <Input id="bankProof" type="file" onChange={(e) => setBankProof(e.target.files ? e.target.files[0] : null)} accept=".pdf,image/*" disabled={isSaving}/>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch id="setAsPrimary" checked={setAsPrimary} onCheckedChange={setSetAsPrimary} disabled={isSaving} />
                                <Label htmlFor="setAsPrimary">Set as my primary payout method</Label>
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
          <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5"/>Notification Settings</CardTitle>
          <CardDescription>Manage alerts related to your payouts.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveNotifications}>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="payoutFailed" className="text-base">Payout Failures</Label>
                        <p className="text-sm text-muted-foreground">
                            Get an immediate notification if a payout to your account fails.
                        </p>
                    </div>
                    <Switch
                        id="payoutFailed"
                        checked={notificationPrefs.payoutFailed}
                        onCheckedChange={(checked) => handleNotificationPrefChange('payoutFailed', checked)}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="reVerification" className="text-base">Re-verification Requests</Label>
                        <p className="text-sm text-muted-foreground">
                            Notify me if my payout method requires re-verification.
                        </p>
                    </div>
                    <Switch
                        id="reVerification"
                        checked={notificationPrefs.reVerification}
                        onCheckedChange={(checked) => handleNotificationPrefChange('reVerification', checked)}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="payoutTriggered" className="text-base">Payout Triggered</Label>
                        <p className="text-sm text-muted-foreground">
                           Send an alert when a payout is processed based on your threshold/frequency.
                        </p>
                    </div>
                    <Switch
                         id="payoutTriggered"
                        checked={notificationPrefs.payoutTriggered}
                        onCheckedChange={(checked) => handleNotificationPrefChange('payoutTriggered', checked)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isSavingNotifications}>
                    {isSavingNotifications ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                    {isSavingNotifications ? 'Saving...' : 'Save Notification Settings'}
                </Button>
            </CardFooter>
        </form>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5"/>Payout History</CardTitle>
          <CardDescription>A mini-statement of your recent payouts.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Invoice</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payoutHistory.map(payout => (
                        <TableRow key={payout.id}>
                            <TableCell>{format(payout.date, 'MMM d, yyyy')}</TableCell>
                            <TableCell className="font-medium">₹{payout.amount.toLocaleString('en-IN')}</TableCell>
                            <TableCell>{payout.method}</TableCell>
                            <TableCell>
                                <Badge variant={payout.status === 'Completed' ? 'default' : 'destructive'}>
                                    {payout.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/invoice/${payout.relatedOrderId}`}>
                                        <FileText className="mr-2 h-4 w-4" /> View
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download Report</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem><FileText className="mr-2 h-4 w-4"/>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem disabled><FileText className="mr-2 h-4 w-4"/>Export as PDF (Soon)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild>
                <Link href="/designer/earnings">
                    View Full Ledger <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
    </TooltipProvider>
  );
}

