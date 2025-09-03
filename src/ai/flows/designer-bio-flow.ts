
'use server';
/**
 * @fileOverview An AI flow for generating a professional designer bio.
 *
 * - generateDesignerBio - A function that creates a bio based on specialties and tone.
 */

import {ai} from '@/ai/genkit';
import type { DesignerBioRequest, DesignerBioResponse } from './designer-bio-types';
import { DesignerBioRequestSchema, DesignerBioResponseSchema } from './designer-bio-types';

// Define the prompt for the model
const designerBioPrompt = ai.definePrompt({
    name: 'designerBioPrompt',
    input: {schema: DesignerBioRequestSchema},
    output: {schema: DesignerBioResponseSchema},
    prompt: `You are a professional copywriter for a creative marketplace called DesignFlow. Your task is to generate a short, engaging bio for a designer's profile page. The bio should be around 2-4 sentences (max 300 characters).

    The designer's name is {{{name}}}.
    Their specialties are: {{{specialties}}}.
    The desired tone is: {{{tone}}}.

    Based on this, write a compelling bio that highlights their skills and invites collaboration.
    `,
});

// Define the main flow that calls the prompt
const designerBioFlow = ai.defineFlow(
  {
    name: 'designerBioFlow',
    inputSchema: DesignerBioRequestSchema,
    outputSchema: DesignerBioResponseSchema,
  },
  async (input) => {
    const { output } = await designerBioPrompt(input);
    if (!output) {
      throw new Error('Failed to generate a designer bio.');
    }
    return output;
  }
);


// Exported wrapper function to be called from the UI
export async function generateDesignerBio(request: DesignerBioRequest): Promise<DesignerBioResponse> {
  return await designerBioFlow(request);
}
