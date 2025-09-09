
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Bot, FileText, CheckCircle2 } from "lucide-react";
import Link from 'next/link';

// In a real app, you might dynamically generate this list by inspecting files or from a manifest.
// For the prototype, we will hardcode the list based on the known flow files.
const aiFlows = [
  { 
    name: 'Kira Conversational Flow', 
    file: 'kira-flow.ts', 
    description: 'A simple, general-purpose conversational flow for the Kira AI assistant.',
    purpose: 'Chatbot',
    input: 'string (prompt)',
    output: 'string (response)'
  },
  { 
    name: 'Marketing Announcement Flow', 
    file: 'announcement-flow.ts', 
    description: 'Generates a title and message for a platform announcement based on a topic.',
    purpose: 'Content Generation',
    input: '{ topic: string }',
    output: '{ title: string, message: string }'
  },
  { 
    name: 'Blog Post Idea Flow', 
    file: 'blog-post-flow.ts', 
    description: 'Generates a blog post title and a short excerpt/summary from a topic.',
    purpose: 'Content Generation',
    input: '{ topic: string }',
    output: '{ title: string, excerpt: string }'
  },
  { 
    name: 'Designer Bio Flow', 
    file: 'designer-bio-flow.ts', 
    description: 'Creates a professional bio for a designer based on their name, specialties, and a desired tone.',
    purpose: 'Content Generation',
    input: '{ name: string, specialties: string, tone: string }',
    output: '{ bio: string }'
  },
  { 
    name: 'Chat Summary Flow', 
    file: 'summarize-chat-flow.ts', 
    description: 'Summarizes a given chat history, focusing on main points and action items.',
    purpose: 'Summarization',
    input: 'string (chat history)',
    output: 'string (summary)'
  },
];

export default function AiFlowsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline flex items-center">
                    <Sparkles className="mr-3 h-8 w-8 text-primary" />
                    AI Flows (Genkit)
                </h1>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Integrated AI Capabilities</CardTitle>
                    <CardDescription>An overview of the Genkit flows powering the AI features in this application.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aiFlows.map(flow => (
                        <Card key={flow.file} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <Bot className="mr-2 h-5 w-5 text-primary"/>
                                    {flow.name}
                                </CardTitle>
                                <CardDescription className="text-xs font-mono">{flow.file}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3">
                                <p className="text-sm text-muted-foreground">{flow.description}</p>
                                <div className="text-xs space-y-1">
                                    <p><strong className="font-medium">Input:</strong> <code className="bg-muted px-1 py-0.5 rounded">{flow.input}</code></p>
                                    <p><strong className="font-medium">Output:</strong> <code className="bg-muted px-1 py-0.5 rounded">{flow.output}</code></p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
