
import {z} from 'zod';

/**
 * @fileOverview Shared types and schemas for the designer bio generation flow.
 */

// Define the schema for the flow's input
export const DesignerBioRequestSchema = z.object({
  name: z.string().describe('The full name of the designer.'),
  specialties: z.string().describe('A comma-separated list of the designer\'s skills and specialties (e.g., "Logo Design, UI/UX, Branding").'),
  tone: z.string().describe('The desired tone for the bio (e.g., "Professional", "Friendly", "Creative", "Formal").'),
});
export type DesignerBioRequest = z.infer<typeof DesignerBioRequestSchema>;


// Define the schema for the flow's structured output
export const DesignerBioResponseSchema = z.object({
    bio: z.string().describe("The generated bio for the designer. It should be engaging, professional, and around 2-4 sentences long, suitable for a profile page."),
});
export type DesignerBioResponse = z.infer<typeof DesignerBioResponseSchema>;
