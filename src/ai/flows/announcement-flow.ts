
'use server';
/**
 * @fileOverview An AI flow for generating marketing announcements.
 *
 * - generateAnnouncement - A function that creates a title and message for an announcement.
 * - AnnouncementRequest - The input type for the generateAnnouncement function.
 * - AnnouncementResponse - The return type for the generateAnnouncement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Define the schema for the flow's input
export const AnnouncementRequestSchema = z.object({
  topic: z.string().describe('The core topic of the announcement. For example: "new dashboard feature", "Diwali promotion", "scheduled maintenance on Sunday".'),
});
export type AnnouncementRequest = z.infer<typeof AnnouncementRequestSchema>;


// Define the schema for the flow's structured output
export const AnnouncementResponseSchema = z.object({
    title: z.string().describe("A short, catchy, and professional title for the announcement. Should be less than 10 words."),
    message: z.string().describe("A friendly and professional message body for the announcement. It should be 2-3 sentences long, explaining the core topic clearly to users."),
});
export type AnnouncementResponse = z.infer<typeof AnnouncementResponseSchema>;

// Define the prompt for the model
const announcementPrompt = ai.definePrompt({
    name: 'announcementPrompt',
    input: {schema: AnnouncementRequestSchema},
    output: {schema: AnnouncementResponseSchema},
    prompt: `You are a marketing and communications expert for a creative services marketplace called DesignFlow. Your task is to generate a user-facing announcement based on a given topic.

    The tone should be professional, clear, and slightly enthusiastic.

    Topic: {{{topic}}}

    Generate a suitable title and message for the announcement.
    `,
});

// Define the main flow that calls the prompt
const announcementFlow = ai.defineFlow(
  {
    name: 'announcementFlow',
    inputSchema: AnnouncementRequestSchema,
    outputSchema: AnnouncementResponseSchema,
  },
  async (input) => {
    const { output } = await announcementPrompt(input);
    if (!output) {
      throw new Error('Failed to generate an announcement.');
    }
    return output;
  }
);


// Exported wrapper function to be called from the UI
export async function generateAnnouncement(request: AnnouncementRequest): Promise<AnnouncementResponse> {
  return await announcementFlow(request);
}

