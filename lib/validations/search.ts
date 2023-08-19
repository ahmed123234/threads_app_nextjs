import * as z from 'zod';

export const searchValidation = z.object({
    searchTerm: z.string()
})

