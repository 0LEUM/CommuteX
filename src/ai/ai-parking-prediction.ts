// This is a server-side file.
'use server';

/**
 * @fileOverview AI-powered parking prediction flow.
 *
 * This file defines a Genkit flow that predicts peak parking hours and suggests alternative parking locations to users.
 *
 * @exports predictParkingAvailability - An async function that takes parking location as input and returns parking predictions.
 * @exports PredictParkingAvailabilityInput - The input type for the predictParkingAvailability function.
 * @exports PredictParkingAvailabilityOutput - The output type for the predictParkingAvailability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictParkingAvailabilityInputSchema = z.object({
  parkingLocation: z.string().describe('The location for which to predict parking availability.'),
  currentTime: z.string().describe('The current time.'),
});
export type PredictParkingAvailabilityInput = z.infer<typeof PredictParkingAvailabilityInputSchema>;

const PredictParkingAvailabilityOutputSchema = z.object({
  peakHoursPrediction: z.string().describe('Predicted peak hours for parking at the specified location.'),
  alternativeParkingSuggestions: z.string().describe('Suggestions for alternative parking locations.'),
});
export type PredictParkingAvailabilityOutput = z.infer<typeof PredictParkingAvailabilityOutputSchema>;

export async function predictParkingAvailability(input: PredictParkingAvailabilityInput): Promise<PredictParkingAvailabilityOutput> {
  return predictParkingAvailabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictParkingAvailabilityPrompt',
  input: {schema: PredictParkingAvailabilityInputSchema},
  output: {schema: PredictParkingAvailabilityOutputSchema},
  prompt: `You are an AI assistant designed to predict peak parking hours and suggest alternative parking locations.

  Based on the given location and current time, provide predictions for peak parking hours and suggestions for alternative parking.

  Location: {{{parkingLocation}}}
  Current Time: {{{currentTime}}}

  Format your response as follows:

  Peak Hours Prediction: [predicted peak hours]
  Alternative Parking Suggestions: [suggested alternative locations]`,
});

const predictParkingAvailabilityFlow = ai.defineFlow(
  {
    name: 'predictParkingAvailabilityFlow',
    inputSchema: PredictParkingAvailabilityInputSchema,
    outputSchema: PredictParkingAvailabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
