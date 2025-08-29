
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function DesignerMessagesPage() {

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline flex items-center">
                <MessageSquare className="mr-3 h-8 w-8 text-primary" />
                My Messages
            </h1>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Chat</CardTitle>
                    <CardDescription>
                        This is a placeholder page for viewing and managing your conversations with clients.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-16">
                    <MessageSquare className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
                    <p className="mt-4 text-lg font-semibold">Messaging Feature Coming Soon</p>
                    <p className="text-muted-foreground">
                        A dedicated interface to manage all your project communications will be available here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
