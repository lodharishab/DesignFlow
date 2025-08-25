
'use server';

import { askKira } from "@/ai/flows/kira-flow";
import { summarizeChat } from "@/ai/flows/summarize-chat-flow";

export async function askKiraAction(prompt: string): Promise<string> {
    return await askKira(prompt);
}

export async function summarizeChatAction(chatHistory: string): Promise<string> {
    return await summarizeChat(chatHistory);
}
