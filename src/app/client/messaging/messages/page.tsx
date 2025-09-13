
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';

export default function ClientMessagesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <MessagesSquare className="mr-3 h-8 w-8 text-primary" />
        Messages
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Conversations</CardTitle>
          <CardDescription>A centralized place for all your project communications.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">Your chat interface with designers will appear here. This feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
