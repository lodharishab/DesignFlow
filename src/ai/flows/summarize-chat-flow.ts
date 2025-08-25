
'use server';
/**
 * @fileOverview An AI flow for summarizing chat conversations.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for the flow's input
const SummarizeChatSchema = z.string();

// Define the flow
const summarizeChatFlow = ai.defineFlow(
  {
    name: 'summarizeChatFlow',
    inputSchema: SummarizeChatSchema,
    outputSchema: z.string(),
  },
  async (chatHistory) => {
    const llmResponse = await ai.generate({
      prompt: `You are an expert admin assistant. Briefly summarize the following conversation. Focus on the main points, user sentiment, and any unresolved questions or action items. Keep it to 3-4 bullet points.

<conversation_history>
${chatHistory}
</conversation_history>`,
    });

    return llmResponse.text;
  }
);

// Define an exported function that wraps the flow
export async function summarizeChat(chatHistory: string): Promise<string> {
  return await summarizeChatFlow(chatHistory);
}
