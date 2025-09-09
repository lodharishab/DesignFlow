
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

function PlatformInfoPage() {
    const [readmeContent, setReadmeContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This is a mock fetch. In a real scenario, you might have an API route
        // that securely reads the file from the server.
        // For this prototype, we'll just use a hardcoded string.
        const mockReadme = `
# DesignFlow - Creative Services Marketplace

This is a Next.js project for DesignFlow, a marketplace connecting clients with expert designers, primarily focused on the Indian market. The platform aims to provide high-quality creative work through a streamlined process with transparent pricing.

## Project Progress & Features Checklist (as of last update)

**I. Core Structure & Public Pages:**

*   [✓] Basic Project Setup: Next.js, React, ShadCN UI, Tailwind.
*   [✓] Homepage (\`/\`): Hero, How it Works, Featured Services, Portfolio Glance, CTAs.
*   [✓] Services Landing Page (\`/design-services\`): Hero with auto-scrolling category carousel, Popular Services, Portfolio Glance.
*   ... (rest of README content would be dynamically loaded here) ...
`;
        // Simulate network delay
        setTimeout(() => {
            setReadmeContent(mockReadme);
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <Info className="mr-3 h-8 w-8 text-primary" />
                    Platform Information
                </h1>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>README & Project Info</CardTitle>
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

export default PlatformInfoPage;

    