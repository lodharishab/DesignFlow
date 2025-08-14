
'use server';

import { askKira } from "@/ai/flows/kira-flow";

export async function askKiraAction(prompt: string): Promise<string> {
    return await askKira(prompt);
}
