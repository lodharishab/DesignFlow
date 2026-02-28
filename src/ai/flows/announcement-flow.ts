'use server';

import { getOpenAI } from '@/ai/genkit';
import type { AnnouncementRequest, AnnouncementResponse } from './announcement-types';

export async function generateAnnouncement(request: AnnouncementRequest): Promise<AnnouncementResponse> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a marketing and communications expert for a creative services marketplace called DesignFlow. Your task is to generate a user-facing announcement based on a given topic.

The tone should be professional, clear, and slightly enthusiastic.

Respond with valid JSON in this exact format:
{
  "title": "A short, catchy title under 10 words",
  "message": "A friendly 2-3 sentence message explaining the topic clearly to users"
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
    message: parsed.message || '',
  };
}
