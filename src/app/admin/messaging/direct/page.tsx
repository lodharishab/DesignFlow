
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PlusCircle, PackageSearch } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AdminDirectMessagesPage() {
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
        <Users className="mr-3 h-8 w-8 text-primary" />
        Direct Messages
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Direct User Conversations</CardTitle>
          <CardDescription>
            This is where you would manage one-on-one conversations with clients and designers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold">No conversations yet</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              When a user initiates a conversation, it will appear here.
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
