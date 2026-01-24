import { z } from 'zod';

export const createAmenitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  icon: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
});

export const updateAmenitySchema = z.object({
  id: z.string().cuid(),
  data: z.object({
    name: z.string().min(1, 'Name is required').max(100).optional(),
    icon: z.string().max(50).optional().nullable(),
    category: z.string().max(50).optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const getAmenityByIdSchema = z.object({
  id: z.string().cuid(),
});

export const deleteAmenitySchema = z.object({
  id: z.string().cuid(),
});

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityInput = z.infer<typeof updateAmenitySchema>;
export type GetAmenityByIdInput = z.infer<typeof getAmenityByIdSchema>;
export type DeleteAmenityInput = z.infer<typeof deleteAmenitySchema>;
