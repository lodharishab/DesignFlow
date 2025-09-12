
'use server';
/**
 * @fileOverview An AI flow for generating brand identity suggestions.
 *
 * - generateBrandSuggestions - A function that creates suggestions for design styles, fonts, and colors.
 */

import {ai} from '@/ai/genkit';
import type { BrandSuggestionsRequest, BrandSuggestionsResponse } from './brand-suggestions-types';
import { BrandSuggestionsRequestSchema, BrandSuggestionsResponseSchema } from './brand-suggestions-types';


// Define the prompt for the model
const brandSuggestionsPrompt = ai.definePrompt({
    name: 'brandSuggestionsPrompt',
    input: {schema: BrandSuggestionsRequestSchema},
    output: {schema: BrandSuggestionsResponseSchema},
    prompt: `You are a world-class branding expert for a creative services marketplace called DesignFlow. Your task is to generate branding suggestions for a client based on their profile.

    The client's profile is as follows:
    - Industry: {{{industry}}}
    - Target Audience: {{{targetAudience}}}
    - Brand Values: {{{brandValues}}}
    {{#if existingTags}}
    - Existing Brand Tags: {{{existingTags}}}
    {{/if}}
    
    Based on this, generate:
    1.  A list of 3-4 suitable design styles.
    2.  A list of 2-3 suitable font pairings (a heading font and a body font for each). Use well-known, professional fonts (e.g., from Google Fonts).
    3.  A list of 2-3 suitable color palettes. Each palette should have a descriptive name and a list of 4-5 hex color codes.

    The suggestions should be creative, professional, and well-aligned with the client's profile.
    `,
});

// Define the main flow that calls the prompt
const brandSuggestionsFlow = ai.defineFlow(
  {
    name: 'brandSuggestionsFlow',
    inputSchema: BrandSuggestionsRequestSchema,
    outputSchema: BrandSuggestionsResponseSchema,
  },
  async (input) => {
    const { output } = await brandSuggestionsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate brand suggestions.');
    }
    return output;
  }
);


// Exported wrapper function to be called from the UI
export async function generateBrandSuggestions(request: BrandSuggestionsRequest): Promise<BrandSuggestionsResponse> {
  return await brandSuggestionsFlow(request);
}
