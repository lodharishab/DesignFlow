
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function ClientDisputesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <ShieldAlert className="mr-3 h-8 w-8 text-primary" />
        Disputes
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Dispute History</CardTitle>
          <CardDescription>Track any disputes you have opened for your orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">A list of your open and resolved disputes will appear here. This feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
