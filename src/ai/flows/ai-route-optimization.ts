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
    .describe('The starting location for the route. Must be a specific address or well-known landmark in India for accurate routing, e.g., "India Gate, New Delhi" or "Gateway of India, Mumbai".'),
  endLocation: z
    .string()
    .describe('The destination location for the route. Must be a specific address or well-known landmark in India, e.g., "Taj Mahal, Agra" or "Qutub Minar, New Delhi".'),
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
    .describe('Available micro-mobility options, eg., bike, e-scooter.'),
  departureTime: z
    .string()
    .optional()
    .describe('The desired departure time for the route (e.g. now, or a specific time).'),
});
export type OptimizeRouteInput = z.infer<typeof OptimizeRouteInputSchema>;

const OptimizeRouteOutputSchema = z.object({
  optimalRoute: z.string().describe('The suggested optimal route with step-by-step instructions.'),
  estimatedTravelTime: z.string().describe('The estimated travel time for the suggested route.'),
  costEstimate: z.string().describe('The estimated cost for the suggested route in INR.'),
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
  prompt: `You are an AI-powered route optimization expert specializing in Indian locations. Your primary goal is to provide a valid, navigable route. Given the following information, suggest the optimal multi-modal travel route within India.

IMPORTANT: Use the exact, full addresses or specific, well-known landmark names provided for start and end locations to ensure the mapping service can find them. Do not abbreviate or alter them. Provide cost estimates in Indian Rupees (INR).

Start Location: {{{startLocation}}}
End Location: {{{endLocation}}}
Current Traffic Conditions: {{{currentTrafficConditions}}}
Available Public Transport: {{{availablePublicTransport}}}
Available Micro-Mobility Options: {{{availableMicroMobility}}}
Departure Time: {{{departureTime}}}

Consider real-time traffic, public transport schedules, and micro-mobility options to provide the most efficient route.

Provide the optimal route, estimated travel time, cost estimate in INR, and a route summary.`,
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
