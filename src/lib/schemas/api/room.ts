import { z } from 'zod';
import { dateRangeSchema } from '../common';

// Room status enum matching Prisma
export const roomStatusSchema = z.enum([
  'available',
  'occupied',
  'cleaning',
  'maintenance',
  'out_of_service',
]);

export type RoomStatus = z.infer<typeof roomStatusSchema>;

/**
 * Valid room status transitions.
 * Key: current status, Value: array of allowed target statuses.
 * - available → occupied (check-in), maintenance, out_of_service
 * - occupied → cleaning (checkout), maintenance (emergency)
 * - cleaning → available (ready), maintenance
 * - maintenance → available, cleaning, out_of_service
 * - out_of_service → maintenance, available
 */
export const validRoomStatusTransitions: Record<RoomStatus, RoomStatus[]> = {
  available: ['occupied', 'maintenance', 'out_of_service'],
  occupied: ['cleaning', 'maintenance'],
  cleaning: ['available', 'maintenance'],
  maintenance: ['available', 'cleaning', 'out_of_service'],
  out_of_service: ['maintenance', 'available'],
};

// Room create schema
export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required').max(20),
  roomTypeId: z.string().cuid(),
  floor: z.number().int().optional(),
  status: roomStatusSchema.default('available'),
  notes: z.string().optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

// Room update schema
export const updateRoomSchema = z.object({
  id: z.string().cuid(),
  data: createRoomSchema.partial(),
});

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

// Room query filters
export const roomFiltersSchema = z.object({
  status: roomStatusSchema.optional(),
  roomTypeId: z.string().cuid().optional(),
  floor: z.number().int().optional(),
});

export type RoomFiltersInput = z.infer<typeof roomFiltersSchema>;

// Check availability schema
export const checkAvailabilitySchema = dateRangeSchema.safeExtend({
  roomTypeId: z.string().cuid().optional(),
  guests: z.number().int().positive().optional(),
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;

// Bulk room create schema
export const bulkCreateRoomsSchema = z.object({
  roomTypeId: z.string().cuid(),
  floor: z.number().int(),
  startNumber: z.number().int().positive(),
  count: z.number().int().positive().max(50),
  prefix: z.string().optional(),
});

export type BulkCreateRoomsInput = z.infer<typeof bulkCreateRoomsSchema>;

// Update room status schema
export const updateRoomStatusSchema = z.object({
  id: z.string().cuid(),
  status: roomStatusSchema,
});

export type UpdateRoomStatusInput = z.infer<typeof updateRoomStatusSchema>;
