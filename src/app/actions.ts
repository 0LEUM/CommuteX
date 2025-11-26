'use server';

import { optimizeRoute, OptimizeRouteOutput } from '@/ai/flows/ai-route-optimization';
import { generateMapImage } from '@/ai/flows/generate-map-image';
import { z } from 'zod';

const FormSchema = z.object({
  startLocation: z.string().min(3, { message: 'Start location must be at least 3 characters.' }),
  endLocation: z.string().min(3, { message: 'End location must be at least 3 characters.' }),
});

export type State = {
  message?: string | null;
  data?: (OptimizeRouteOutput & { mapImageUrl?: string }) | null;
  errors?: {
    startLocation?: string[];
    endLocation?: string[];
    _form?: string[];
  };
};

export async function getOptimalRoute(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    startLocation: formData.get('startLocation'),
    endLocation: formData.get('endLocation'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid input. Please check the fields.',
    };
  }

  try {
    const routeResult = await optimizeRoute(validatedFields.data);

    let mapImageUrl: string | undefined;
    try {
      const mapResult = await generateMapImage({
        startLocation: validatedFields.data.startLocation,
        endLocation: validatedFields.data.endLocation,
        routeSummary: routeResult.routeSummary,
      });
      mapImageUrl = mapResult.mapImageUrl;
    } catch (e) {
      console.error('Map generation failed, proceeding without map.', e);
      // We don't block the user if map generation fails.
    }

    return {
      message: 'Route optimized successfully.',
      data: {
        ...routeResult,
        mapImageUrl,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        _form: ['An unexpected error occurred while optimizing the route. Please try again.'],
      },
      message: 'An error occurred.',
    };
  }
}
