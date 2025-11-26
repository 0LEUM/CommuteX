'use server';

/**
 * @fileOverview AI-powered map image generation flow.
 *
 * This file defines a Genkit flow that generates a map image based on a route description.
 *
 * @exports generateMapImage - An async function that takes a route description and returns a map image URL.
 * @exports GenerateMapImageInput - The input type for the generateMapImage function.
 * @exports GenerateMapImageOutput - The output type for the generateMapImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  return generateMapImageFlow(input);
}

const generateMapImageFlow = ai.defineFlow(
  {
    name: 'generateMapImageFlow',
    inputSchema: GenerateMapImageInputSchema,
    outputSchema: GenerateMapImageOutputSchema,
  },
  async ({ startLocation, endLocation, routeSummary }) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a visually appealing and clear map image that shows a route from "${startLocation}" to "${endLocation}". The style should be a modern digital map. The route should be clearly highlighted. The map should be conceptual and represent the journey described: "${routeSummary}". Do not include any real-world street names unless they are in the locations. The image should be clean, with a clear path from start to finish.`,
      config: {
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      },
    });

    if (!media.url) {
      throw new Error('Failed to generate map image.');
    }

    return {
      mapImageUrl: media.url,
    };
  }
);
