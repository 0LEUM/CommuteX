'use server';

/**
 * @fileOverview This file is now deprecated. Google Maps integration is used instead.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateMapImageInputSchema = z.object({
  startLocation: z.string().describe('The starting point of the route.'),
  endLocation: z.string().describe('The ending point of the route.'),
  routeSummary: z.string().describe('A summary of the route provided by the route optimizer.'),
});
export type GenerateMapImageInput = z.infer<typeof GenerateMapImageInputSchema>;

const GenerateMapImageOutputSchema = z.object({
  mapImageUrl: z.string().describe('A data URI of the generated map image.'),
});
export type GenerateMapImageOutput = z.infer<typeof GenerateMapImageOutputSchema>;

export async function generateMapImage(input: GenerateMapImageInput): Promise<GenerateMapImageOutput> {
  // This flow is deprecated and will return an empty URL.
  // The functionality has been replaced by a live Google Map component.
  return Promise.resolve({ mapImageUrl: '' });
}
