
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookText } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

interface ProjectSummaryPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function ProjectSummaryPage({ searchParams }: ProjectSummaryPageProps) {
    const version = searchParams.version || '0.04';

    const getFileNameForVersion = (v: string) => {
        if (v === '0.04') return 'project-summary.txt';
        return `project-summary.v${v}.txt`;
    }

    const readFileContent = async (fileName: string) => {
        try {
            const filePath = path.join(process.cwd(), fileName);
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            console.error(`Failed to read ${fileName}:`, error);
            return `Error: Could not load the file ${fileName}. Please check if the file exists.`;
        }
    };

    const content = await readFileContent(getFileNameForVersion(version as string));
    const versions = ['0.04', '0.03', '0.02', '0.01'];

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
                    <CardTitle>Feature & Page Overviews by Version</CardTitle>
                    <CardDescription>A high-level summary of the application's structure and features at different points in its development.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={version as string} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                             {versions.map(v => (
                                <TabsTrigger key={v} value={v} asChild>
                                    <Link href={`?version=${v}`}>v{v}</Link>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value={version as string} className="mt-4">
                            <Textarea 
                                readOnly 
                                value={content}
                                className="font-mono text-xs h-[600px] bg-muted/50"
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProjectSummaryPage;
