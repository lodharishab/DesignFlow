
import {z} from 'zod';

/**
 * @fileOverview Shared types and schemas for the announcement generation flow.
 */

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
