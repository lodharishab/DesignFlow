
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileCode } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


const versionToFileMap: Record<string, string> = {
    'v0.01': 'README.v0.01.md',
    'v0.02': 'README.v0.02.md',
    'v0.03': 'README.v0.03.md',
    'v0.04': 'README.md',
};

async function ReadmePage({ searchParams }: { searchParams: { version?: string } }) {
    const selectedVersion = searchParams.version || 'v0.04';
    const fileName = versionToFileMap[selectedVersion] || 'README.md';
    const readmePath = path.join(process.cwd(), fileName);
    
    let readmeContent = '';
    let errorMessage = null;

    try {
        readmeContent = await fs.readFile(readmePath, 'utf8');
    } catch (error) {
        console.error(`Failed to read ${fileName}:`, error);
        errorMessage = `Error: Could not load the file ${fileName}. Please check if the file exists.`;
    }

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
                    <Tabs defaultValue={selectedVersion} className="w-full">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>README.md</CardTitle>
                                <CardDescription>A direct view of the project's README.md file for development and feature tracking.</CardDescription>
                            </div>
                            <TabsList>
                                <TabsTrigger value="v0.01" asChild><Link href="?version=v0.01">v0.01</Link></TabsTrigger>
                                <TabsTrigger value="v0.02" asChild><Link href="?version=v0.02">v0.02</Link></TabsTrigger>
                                <TabsTrigger value="v0.03" asChild><Link href="?version=v0.03">v0.03</Link></TabsTrigger>
                                <TabsTrigger value="v0.04" asChild><Link href="?version=v0.04">v0.04 (Current)</Link></TabsTrigger>
                            </TabsList>
                        </div>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    {errorMessage ? (
                        <p className="text-destructive">{errorMessage}</p>
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
