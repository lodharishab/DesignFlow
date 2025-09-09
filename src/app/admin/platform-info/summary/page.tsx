
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookText } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

import projectSummary from '../../../../../project-summary.txt';

function ProjectSummaryPage() {
    const [summaryContent, setSummaryContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch/import of the project summary file
        const mockSummary = projectSummary;
        setSummaryContent(mockSummary);
        setIsLoading(false);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <BookText className="mr-3 h-8 w-8 text-primary" />
                    Project Summary
                </h1>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Feature & Page Overview</CardTitle>
                    <CardDescription>A high-level summary of the application's structure, pages, and implemented features.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-40 w-full mt-4" />
                        </div>
                    ) : (
                        <Textarea 
                            readOnly 
                            value={summaryContent}
                            className="font-mono text-xs h-[600px] bg-muted/50"
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ProjectSummaryPage;
