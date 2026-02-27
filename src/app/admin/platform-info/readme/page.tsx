
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileCode, Info } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface ReadmePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function ReadmePage({ searchParams }: ReadmePageProps) {
    const resolvedSearchParams = await searchParams;
    const version = resolvedSearchParams.version || '0.05';

    const getFileNameForVersion = (v: string) => {
        if (v === '0.05') return 'README.md';
        return `README.v${v}.md`;
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
    const versions = ['0.05', '0.04', '0.03', '0.02', '0.01'];

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
                    <CardTitle>Project README Files</CardTitle>
                    <CardDescription>A direct view of the project's README.md files for different versions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={version as string} className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
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

export default ReadmePage;
