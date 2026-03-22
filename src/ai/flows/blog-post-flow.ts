'use server';

import { getOpenAI } from '@/ai/genkit';
import type { BlogPostRequest, BlogPostResponse } from './blog-post-types';

export async function generateBlogPostIdeas(request: BlogPostRequest): Promise<BlogPostResponse> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a content marketing expert for a creative services marketplace called HYPE. Your task is to generate a blog post title and a short excerpt/summary based on a given topic.

The tone should be professional, insightful, and engaging for an audience of clients and designers.

Respond with valid JSON in this exact format:
{
  "title": "A short, catchy, SEO-friendly title under 70 characters",
  "excerpt": "A concise 1-2 sentence summary suitable for a post listing preview"
}`,
      },
      { role: 'user', content: `Topic: ${request.topic}` },
    ],
    response_format: { type: 'json_object' },
    max_completion_tokens: 8192,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return {
    title: parsed.title || '',
    excerpt: parsed.excerpt || '',
  };
}
