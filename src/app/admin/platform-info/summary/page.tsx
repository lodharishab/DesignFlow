
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookText } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


const versionToFileMap: Record<string, string> = {
    'v0.01': 'project-summary.v0.01.txt',
    'v0.02': 'project-summary.v0.02.txt',
    'v0.03': 'project-summary.v0.03.txt',
    'v0.04': 'project-summary.txt',
};

async function ProjectSummaryPage({ searchParams }: { searchParams: { version?: string } }) {
    const selectedVersion = searchParams.version || 'v0.04';
    const fileName = versionToFileMap[selectedVersion] || 'project-summary.txt';
    const summaryPath = path.join(process.cwd(), fileName);
    
    let summaryContent = '';
    let errorMessage = null;

    try {
        summaryContent = await fs.readFile(summaryPath, 'utf8');
    } catch (error) {
        console.error(`Failed to read ${fileName}:`, error);
        errorMessage = `Error: Could not load the file ${fileName}. Please check if the file exists.`;
    }

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
                    <Tabs defaultValue={selectedVersion} className="w-full">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Feature & Page Overview</CardTitle>
                                <CardDescription>A high-level summary of the application's structure, pages, and implemented features.</CardDescription>
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
