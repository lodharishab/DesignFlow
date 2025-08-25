
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, PlusCircle, PackageSearch } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AdminMonitorChatsPage() {
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
        <Eye className="mr-3 h-8 w-8 text-primary" />
        Monitor Chats
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monitor Order Conversations</CardTitle>
          <CardDescription>
            This is where you would view ongoing conversations between clients and designers on specific orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold">No active order chats</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              When a project starts, the conversation will be available for monitoring here.
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
