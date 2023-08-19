import * as z from 'zod';
export const userValidation =  z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3, "Minimum 3 characters").max(30, "Minimum 30 characters"),
    username: z.string().min(3, "Minimum 3 characters").max(30, "Minimum 30 characters"),
    bio: z.string().min(3, "Minimum 3 characters").max(1000, "Minimum 1000 characters"),
})