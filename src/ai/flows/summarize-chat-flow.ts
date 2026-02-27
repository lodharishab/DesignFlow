'use server';

import { openai } from '@/ai/genkit';

export async function summarizeChat(chatHistory: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert admin assistant. Briefly summarize the following conversation. Focus on the main points, user sentiment, and any unresolved questions or action items. Keep it to 3-4 bullet points.',
      },
      { role: 'user', content: chatHistory },
    ],
    max_completion_tokens: 8192,
  });

  return response.choices[0]?.message?.content || 'Could not generate a summary.';
}
