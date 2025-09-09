
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Package } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

import packageJson from '../../../../../package.json';

function TechStackPage() {
    const [dependencies, setDependencies] = useState('');
    const [devDependencies, setDevDependencies] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, you might fetch this from a server endpoint
        // that reads the file to avoid exposing it directly to the client bundle.
        // For this prototype, we import it directly.
        
        const deps = JSON.stringify(packageJson.dependencies, null, 2);
        const devDeps = JSON.stringify(packageJson.devDependencies, null, 2);

        setDependencies(deps);
        setDevDependencies(devDeps);
        setIsLoading(false);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <Package className="mr-3 h-8 w-8 text-primary" />
                    Application Tech Stack
                </h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Production Dependencies</CardTitle>
                        <CardDescription>Libraries and packages used in the production build of the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                             <Skeleton className="h-[400px] w-full" />
                        ) : (
                            <Textarea 
                                readOnly 
                                value={dependencies}
                                className="font-mono text-xs h-[400px] bg-muted/50"
                            />
                        )}
                    </CardContent>
                </Card>
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Development Dependencies</CardTitle>
                        <CardDescription>Libraries and tools used only during the development and build process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-[400px] w-full" />
                        ) : (
                            <Textarea 
                                readOnly 
                                value={devDependencies}
                                className="font-mono text-xs h-[400px] bg-muted/50"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default TechStackPage;
