
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, PlusCircle, PackageSearch } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AdminAnnouncementsPage() {
  const { toast } = useToast();

  const handleSimulateData = () => {
    toast({
      title: "Action Simulated",
      description: "This is a placeholder action. In a real app, this might refresh the data or open a modal.",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline flex items-center">
        <Megaphone className="mr-3 h-8 w-8 text-primary" />
        Announcements
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Platform Announcements</CardTitle>
          <CardDescription>
            This is where you would send and view broadcast messages to all users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold">No announcements sent</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              The history of sent announcements will appear here.
            </p>
            <Button onClick={handleSimulateData}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Simulate Adding Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
