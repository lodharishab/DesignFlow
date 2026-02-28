'use server';

import { getOpenAI } from '@/ai/genkit';
import type { BrandSuggestionsRequest, BrandSuggestionsResponse } from './brand-suggestions-types';

export async function generateBrandSuggestions(request: BrandSuggestionsRequest): Promise<BrandSuggestionsResponse> {
  const existingTagsLine = request.existingTags ? `\n- Existing Brand Tags: ${request.existingTags}` : '';

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      {
        role: 'system',
        content: `You are a world-class branding expert for a creative services marketplace called DesignFlow. Your task is to generate branding suggestions for a client based on their profile.

Based on the client profile, generate:
1. A list of 3-4 suitable design styles.
2. A list of 2-3 suitable font pairings (a heading font and a body font for each). Use well-known, professional fonts (e.g., from Google Fonts).
3. A list of 2-3 suitable color palettes. Each palette should have a descriptive name and a list of 4-5 hex color codes.

The suggestions should be creative, professional, and well-aligned with the client's profile.

Respond with valid JSON in this exact format:
{
  "designStyles": ["Style 1", "Style 2", "Style 3"],
  "fontPairings": [{"headingFont": "Font A", "bodyFont": "Font B"}],
  "colorPalettes": [{"name": "Palette Name", "colors": ["#AABBCC", "#DDEEFF", "#112233", "#445566"]}]
}`,
      },
      {
        role: 'user',
        content: `Client profile:
- Industry: ${request.industry}
- Target Audience: ${request.targetAudience}
- Brand Values: ${request.brandValues}${existingTagsLine}`,
      },
    ],
    response_format: { type: 'json_object' },
    max_completion_tokens: 8192,
  });

  const content = response.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return {
    designStyles: parsed.designStyles || [],
    fontPairings: parsed.fontPairings || [],
    colorPalettes: parsed.colorPalettes || [],
  };
}
