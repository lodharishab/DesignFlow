
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileCode } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';

// This is now a server component, so we can use Node.js APIs like fs.
async function ReadmePage() {
    // Construct the absolute path to the README.md file
    const readmePath = path.join(process.cwd(), 'README.md');
    let readmeContent = '';
    let isLoading = true;
    let errorMessage = null;

    try {
        readmeContent = await fs.readFile(readmePath, 'utf8');
        isLoading = false;
    } catch (error) {
        console.error("Failed to read README.md:", error);
        errorMessage = "Error: Could not load the README.md file. Please check if the file exists at the root of the project.";
        isLoading = false;
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
                    <CardTitle>README.md</CardTitle>
                    <CardDescription>A direct view of the project's README.md file for development and feature tracking.</CardDescription>
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
