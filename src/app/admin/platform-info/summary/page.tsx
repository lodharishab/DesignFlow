
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookText } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';

async function ProjectSummaryPage() {
    const summaryPath = path.join(process.cwd(), 'project-summary.txt');
    
    let summaryContent = '';
    let errorMessage = null;

    try {
        summaryContent = await fs.readFile(summaryPath, 'utf8');
    } catch (error) {
        console.error(`Failed to read project-summary.txt:`, error);
        errorMessage = `Error: Could not load the file project-summary.txt. Please check if the file exists.`;
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
                    <CardTitle>Feature & Page Overview (v0.04 - Current)</CardTitle>
                    <CardDescription>A high-level summary of the application's structure, pages, and implemented features.</CardDescription>
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
