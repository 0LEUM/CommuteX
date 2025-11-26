'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-powered route optimization, considering real-time traffic, public transport schedules,
 * and micro-mobility options to suggest the most efficient travel route.
 *
 * @exports optimizeRoute - An async function to initiate the route optimization process.
 * @exports OptimizeRouteInput - The input type for the optimizeRoute function.
 * @exports OptimizeRouteOutput - The output type for the optimizeRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteInputSchema = z.object({
  startLocation: z
    .string()
    .describe('The starting location for the route, e.g., an address or landmark.'),
  endLocation: z
    .string()
    .describe('The destination location for the route, e.g., an address or landmark.'),
  currentTrafficConditions: z
    .string()
    .optional()
    .describe('Real-time traffic conditions, e.g., light, moderate, heavy.'),
  availablePublicTransport: z
    .string()
    .optional()
    .describe('Available public transport options, e.g., bus, train, subway.'),
  availableMicroMobility: z
    .string()
    .optional()
    .describe('Available micro-mobility options, e.g., bike, e-scooter.'),
  departureTime: z
    .string()
    .optional()
    .describe('The desired departure time for the route (e.g. now, or a specific time).'),
});
export type OptimizeRouteInput = z.infer<typeof OptimizeRouteInputSchema>;

const OptimizeRouteOutputSchema = z.object({
  optimalRoute: z.string().describe('The suggested optimal route with step-by-step instructions.'),
  estimatedTravelTime: z.string().describe('The estimated travel time for the suggested route.'),
  costEstimate: z.string().describe('The estimated cost for the suggested route.'),
  routeSummary: z.string().describe('A brief summary of the suggested route.'),
});
export type OptimizeRouteOutput = z.infer<typeof OptimizeRouteOutputSchema>;

export async function optimizeRoute(input: OptimizeRouteInput): Promise<OptimizeRouteOutput> {
  return optimizeRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeRoutePrompt',
  input: {schema: OptimizeRouteInputSchema},
  output: {schema: OptimizeRouteOutputSchema},
  prompt: `You are an AI-powered route optimization expert. Given the following information, suggest the optimal multi-modal travel route:

Start Location: {{{startLocation}}}
End Location: {{{endLocation}}}
Current Traffic Conditions: {{{currentTrafficConditions}}}
Available Public Transport: {{{availablePublicTransport}}}
Available Micro-Mobility Options: {{{availableMicroMobility}}}
Departure Time: {{{departureTime}}}

Consider real-time traffic, public transport schedules, and micro-mobility options to provide the most efficient route.

Provide the optimal route, estimated travel time, cost estimate, and a route summary.`,
});

const optimizeRouteFlow = ai.defineFlow(
  {
    name: 'optimizeRouteFlow',
    inputSchema: OptimizeRouteInputSchema,
    outputSchema: OptimizeRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
