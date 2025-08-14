
'use server';
/**
 * @fileOverview A simple conversational flow for Kira AI.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for the flow's input
const KiraPromptSchema = z.string();

// Define the flow
const kiraFlow = ai.defineFlow(
  {
    name: 'kiraFlow',
    inputSchema: KiraPromptSchema,
    outputSchema: z.string(),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      // You can add more configuration here, like history, etc.
    });

    return llmResponse.text;
  }
);

// Define an exported function that wraps the flow
export async function askKira(prompt: string): Promise<string> {
  // In a real app, you might add authentication or logging here.
  return await kiraFlow(prompt);
}
