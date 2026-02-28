
'use server';

import { askKira } from "@/ai/flows/kira-flow";
import { summarizeChat } from "@/ai/flows/summarize-chat-flow";

export async function askKiraAction(prompt: string): Promise<string> {
    try {
        return await askKira(prompt);
    } catch (error) {
        console.error('Kira AI action failed:', error);
        return 'Sorry, I\'m having trouble responding right now. Please try again in a moment.';
    }
}

export async function summarizeChatAction(chatHistory: string): Promise<string> {
    try {
        return await summarizeChat(chatHistory);
    } catch (error) {
        console.error('Summarize chat action failed:', error);
        return 'Unable to generate summary at this time. Please try again later.';
    }
}
