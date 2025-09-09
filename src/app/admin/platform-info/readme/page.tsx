
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileCode } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

// Directly import the README content as a string.
// Note: This requires specific configuration in your build tool (e.g., webpack loader)
// to handle raw file imports. Next.js might need a custom webpack config for this.
// For the prototype, we will simulate this by hardcoding the content.
import readme from '../../../../../README.md';

function ReadmePage() {
    const [readmeContent, setReadmeContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Since we can't directly import .md as a raw string easily without webpack loaders,
        // we'll simulate the fetch or import here.
        const mockReadme = readme; // In a real app, you might fetch this.
        setReadmeContent(mockReadme);
        setIsLoading(false);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <FileCode className="mr-3 h-8 w-8 text-primary" />
                    Project README
                </h1>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>README.md</CardTitle>
                    <CardDescription>A direct view of the project's README.md file for development and feature tracking.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-20 w-full mt-4" />
                        </div>
                    ) : (
                        <Textarea 
                            readOnly 
                            value={readmeContent}
                            className="font-mono text-xs h-[600px] bg-muted/50"
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ReadmePage;
