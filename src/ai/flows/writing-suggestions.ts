'use server';

/**
 * @fileOverview AI-powered writing assistance for spell-check, grammar-check, and vocabulary enhancement.
 *
 * - getWritingSuggestions - A function that takes a writing essay as input and returns AI-powered suggestions.
 * - WritingSuggestionsInput - The input type for the getWritingSuggestions function.
 * - WritingSuggestionsOutput - The return type for the getWritingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WritingSuggestionsInputSchema = z.object({
  essay: z
    .string()
    .describe('The writing essay submitted by the user.'),
});
export type WritingSuggestionsInput = z.infer<typeof WritingSuggestionsInputSchema>;

const WritingSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-powered suggestions for spell-check, grammar-check, and vocabulary enhancement.'),
});
export type WritingSuggestionsOutput = z.infer<typeof WritingSuggestionsOutputSchema>;

export async function getWritingSuggestions(input: WritingSuggestionsInput): Promise<WritingSuggestionsOutput> {
  return writingSuggestionsFlow(input);
}

const writingSuggestionsPrompt = ai.definePrompt({
  name: 'writingSuggestionsPrompt',
  input: {schema: WritingSuggestionsInputSchema},
  output: {schema: WritingSuggestionsOutputSchema},
  prompt: `You are an AI writing assistant that provides suggestions for spell-check, grammar-check, and vocabulary enhancement for a given essay.

Essay: {{{essay}}}

Suggestions:`,
});

const writingSuggestionsFlow = ai.defineFlow(
  {
    name: 'writingSuggestionsFlow',
    inputSchema: WritingSuggestionsInputSchema,
    outputSchema: WritingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await writingSuggestionsPrompt(input);
    return output!;
  }
);
