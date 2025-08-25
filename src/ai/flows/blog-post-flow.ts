
'use server';
/**
 * @fileOverview An AI flow for generating blog post ideas.
 *
 * - generateBlogPostIdeas - A function that creates a title and excerpt for a blog post.
 */

import {ai} from '@/ai/genkit';
import type { BlogPostRequest, BlogPostResponse } from './blog-post-types';
import { BlogPostRequestSchema, BlogPostResponseSchema } from './blog-post-types';


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
