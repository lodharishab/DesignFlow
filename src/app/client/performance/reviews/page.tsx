
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function ClientReviewsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Star className="mr-3 h-8 w-8 text-primary" />
        My Reviews
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Reviews You've Left</CardTitle>
          <CardDescription>A history of the feedback you've provided on completed projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">A list of your submitted reviews will appear here. This feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
