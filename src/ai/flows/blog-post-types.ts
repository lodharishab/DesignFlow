
import {z} from 'zod';

/**
 * @fileOverview Shared types and schemas for the blog post generation flow.
 */

// Define the schema for the flow's input
export const BlogPostRequestSchema = z.object({
  topic: z.string().describe('The core topic of the blog post. For example: "The impact of color psychology in branding", "Top 5 UI trends for mobile apps".'),
});
export type BlogPostRequest = z.infer<typeof BlogPostRequestSchema>;


// Define the schema for the flow's structured output
export const BlogPostResponseSchema = z.object({
    title: z.string().describe("A short, catchy, and professional title for the blog post. It should be SEO-friendly and less than 70 characters."),
    excerpt: z.string().describe("A concise and engaging summary of the blog post. It should be 1-2 sentences long and summarize the key points, suitable for a post listing preview."),
});
export type BlogPostResponse = z.infer<typeof BlogPostResponseSchema>;
