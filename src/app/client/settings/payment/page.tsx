
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, PlusCircle } from 'lucide-react';

// Mock data for saved cards
const mockSavedMethods = [
  { id: 'card_1', type: 'Visa', last4: '4242', expiry: '08/26' },
  { id: 'card_2', type: 'Mastercard', last4: '5555', expiry: '11/25' },
];

export default function ClientPaymentSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockSavedMethods);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <CreditCard className="mr-3 h-8 w-8 text-primary" />
        Payment Methods
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Payment Methods</CardTitle>
          <CardDescription>Manage your credit and debit cards for faster checkouts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length > 0 ? (
            paymentMethods.map(method => (
              <div key={method.id} className="p-4 border rounded-lg flex items-center justify-between bg-secondary/50">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{method.type} ending in {method.last4}</p>
                    <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">No payment methods saved yet.</p>
          )}
           <Button variant="outline" className="mt-4" disabled>
             <PlusCircle className="mr-2 h-4 w-4" /> Add New Card (Coming Soon)
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
