'use server';

import { optimizeRoute, OptimizeRouteOutput } from '@/ai/flows/ai-route-optimization';
import { z } from 'zod';

const FormSchema = z.object({
  startLocation: z.string().min(3, { message: 'Start location must be at least 3 characters.' }),
  endLocation: z.string().min(3, { message: 'End location must be at least 3 characters.' }),
});

export type State = {
  message?: string | null;
  data?: OptimizeRouteOutput | null;
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
        const result = await optimizeRoute(validatedFields.data);
        return {
            message: 'Route optimized successfully.',
            data: result,
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
