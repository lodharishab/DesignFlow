
import {z} from 'zod';

/**
 * @fileOverview Shared types and schemas for the brand suggestions generation flow.
 */

// Define the schema for the flow's input
export const BrandSuggestionsRequestSchema = z.object({
  industry: z.string().describe('The client\'s industry (e.g., "Technology", "Healthcare", "Retail").'),
  targetAudience: z.string().describe('A description of the client\'s target audience.'),
  brandValues: z.string().describe('A comma-separated list of the client\'s brand values (e.g., "Innovation, Trust, Community").'),
  existingTags: z.string().optional().describe('An optional comma-separated list of existing tags the client has chosen (e.g., "Minimal, Luxury").'),
});
export type BrandSuggestionsRequest = z.infer<typeof BrandSuggestionsRequestSchema>;


// Define the schema for the flow's structured output
export const BrandSuggestionsResponseSchema = z.object({
    designStyles: z.array(z.string()).describe("A list of 3-4 suggested design styles (e.g., 'Modern & Minimalist', 'Classic & Elegant')."),
    fontPairings: z.array(z.object({
        headingFont: z.string().describe("The name of a suggested heading font."),
        bodyFont: z.string().describe("The name of a suggested body font that pairs well with the heading font."),
    })).describe("A list of 2-3 font pairing suggestions."),
    colorPalettes: z.array(z.object({
        name: z.string().describe("A descriptive name for the color palette (e.g., 'Ocean Breeze', 'Earthy Tones')."),
        colors: z.array(z.string().regex(/^#[0-9A-F]{6}$/i)).describe("An array of 4-5 hex color codes for the palette."),
    })).describe("A list of 2-3 color palette suggestions."),
});
export type BrandSuggestionsResponse = z.infer<typeof BrandSuggestionsResponseSchema>;
