'use server';

import { getOpenAI } from '@/ai/genkit';
import type { DesignerBioRequest, DesignerBioResponse } from './designer-bio-types';

export async function generateDesignerBio(request: DesignerBioRequest): Promise<DesignerBioResponse> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional copywriter for a creative marketplace called DesignFlow. Your task is to generate a short, engaging bio for a designer's profile page. The bio should be around 2-4 sentences (max 300 characters).

Respond with valid JSON in this exact format:
{
  "bio": "The generated bio text"
}`,
      },
      {
        role: 'user',
        content: `Designer name: ${request.name}
Specialties: ${request.specialties}
Desired tone: ${request.tone}

Write a compelling bio that highlights their skills and invites collaboration.`,
      },
    ],
    response_format: { type: 'json_object' },
    max_completion_tokens: 8192,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return {
    bio: parsed.bio || '',
  };
}
