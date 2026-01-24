import { z } from 'zod';
import { slugSchema, sortOrderSchema } from '../common';

// Room type create schema
export const createRoomTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: slugSchema,
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required').max(200),
  basePrice: z.number().positive('Price must be positive'),
  capacity: z.number().int().positive('Capacity must be at least 1'),
  size: z.number().int().positive().optional(),
  images: z.array(z.string().url()).default([]),
  amenityIds: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;

// Room type update schema (all fields optional except id)
export const updateRoomTypeSchema = z.object({
  id: z.string().cuid(),
  data: createRoomTypeSchema.partial(),
});

export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;

// Room type query filters
export const roomTypeFiltersSchema = z.object({
  isActive: z.boolean().optional(),
  sortBy: z.enum(['name', 'basePrice', 'capacity', 'createdAt']).default('basePrice'),
  order: sortOrderSchema,
});

export type RoomTypeFiltersInput = z.infer<typeof roomTypeFiltersSchema>;

// Get room type by slug
export const getRoomTypeBySlugSchema = z.object({
  slug: slugSchema,
});

export type GetRoomTypeBySlugInput = z.infer<typeof getRoomTypeBySlugSchema>;
