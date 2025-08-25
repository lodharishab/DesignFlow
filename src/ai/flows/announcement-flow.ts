
'use server';
/**
 * @fileOverview An AI flow for generating marketing announcements.
 *
 * - generateAnnouncement - A function that creates a title and message for an announcement.
 */

import {ai} from '@/ai/genkit';
import type { AnnouncementRequest, AnnouncementResponse } from './announcement-types';
import { AnnouncementRequestSchema, AnnouncementResponseSchema } from './announcement-types';


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
