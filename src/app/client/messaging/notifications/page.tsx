
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function ClientNotificationsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Bell className="mr-3 h-8 w-8 text-primary" />
        Notifications
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Notifications</CardTitle>
          <CardDescription>A log of all important alerts and updates regarding your account and orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">A list of your notifications will appear here. This feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
