
'use server';
/**
 * @fileOverview An AI flow for generating blog post ideas.
 *
 * - generateBlogPostIdeas - A function that creates a title and excerpt for a blog post.
 * - BlogPostRequest - The input type for the function.
 * - BlogPostResponse - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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

// Define the prompt for the model
const blogPostPrompt = ai.definePrompt({
    name: 'blogPostPrompt',
    input: {schema: BlogPostRequestSchema},
    output: {schema: BlogPostResponseSchema},
    prompt: `You are a content marketing expert for a creative services marketplace called DesignFlow. Your task is to generate a blog post title and a short excerpt/summary based on a given topic.

    The tone should be professional, insightful, and engaging for an audience of clients and designers.

    Topic: {{{topic}}}

    Generate a suitable title and excerpt for the blog post.
    `,
});

// Define the main flow that calls the prompt
const blogPostFlow = ai.defineFlow(
  {
    name: 'blogPostFlow',
    inputSchema: BlogPostRequestSchema,
    outputSchema: BlogPostResponseSchema,
  },
  async (input) => {
    const { output } = await blogPostPrompt(input);
    if (!output) {
      throw new Error('Failed to generate blog post ideas.');
    }
    return output;
  }
);


// Exported wrapper function to be called from the UI
export async function generateBlogPostIdeas(request: BlogPostRequest): Promise<BlogPostResponse> {
  return await blogPostFlow(request);
}
