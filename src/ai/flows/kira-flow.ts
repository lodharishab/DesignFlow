'use server';

import { getOpenAI } from '@/ai/genkit';

export async function askKira(prompt: string): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are Kira, a helpful and friendly AI assistant for DesignFlow, a creative services marketplace for India. You help clients and designers with questions about design, branding, and the platform.',
      },
      { role: 'user', content: prompt },
    ],
    max_completion_tokens: 8192,
  });

  return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
}
