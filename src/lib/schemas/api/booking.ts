import { z } from 'zod';
import { paginationSchema } from '../common';

// Booking status enum matching Prisma
export const bookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'checked_in',
  'checked_out',
  'completed',
  'cancelled',
]);

export type BookingStatus = z.infer<typeof bookingStatusSchema>;

// Payment method enum matching Prisma
export const paymentMethodSchema = z.enum(['online', 'counter']);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// Payment status enum matching Prisma
export const paymentStatusSchema = z.enum(['pending', 'paid', 'refunded']);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

// Create booking schema (supports both roomId and roomTypeId)
export const createBookingSchema = z
  .object({
    roomId: z.string().cuid().optional(),
    roomTypeId: z.string().cuid().optional(),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    numberOfGuests: z.number().int().positive('Number of guests must be at least 1'),
    paymentMethod: paymentMethodSchema,
    specialRequests: z.string().max(500).optional(),
    guestName: z.string().min(1).optional(),
    guestEmail: z.string().email().optional(),
    guestPhone: z.string().optional(),
  })
  .refine((data) => data.roomId ?? data.roomTypeId, {
    message: 'Either roomId or roomTypeId must be provided',
    path: ['roomId'],
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  })
  .refine((data) => data.checkInDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Check-in date cannot be in the past',
    path: ['checkInDate'],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// Update booking schema (admin only)
export const updateBookingSchema = z.object({
  id: z.string().cuid(),
  status: bookingStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  notes: z.string().optional(),
});

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

// Cancel booking schema
export const cancelBookingSchema = z.object({
  id: z.string().cuid(),
  cancellationReason: z.string().max(500).optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

// Booking query filters
export const bookingFiltersSchema = paginationSchema.extend({
  status: bookingStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  checkInDate: z.coerce.date().optional(),
  checkOutDate: z.coerce.date().optional(),
  search: z.string().optional(),
});

export type BookingFiltersInput = z.infer<typeof bookingFiltersSchema>;

// Get booking by ID schema
export const getBookingByIdSchema = z.object({
  id: z.string().cuid(),
});

export type GetBookingByIdInput = z.infer<typeof getBookingByIdSchema>;

// Check-in schema
export const checkInSchema = z.object({
  id: z.string().cuid(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

// Check-out schema
export const checkOutSchema = z.object({
  id: z.string().cuid(),
});

export type CheckOutInput = z.infer<typeof checkOutSchema>;

// Early check-out schema
export const earlyCheckOutSchema = z.object({
  id: z.string().cuid(),
});

// POS booking schema (admin walk-in)
export const posBookingSchema = z
  .object({
    roomId: z.string().cuid(),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    numberOfGuests: z.number().int().positive(),
    guestName: z.string().min(1, 'Guest name is required'),
    guestEmail: z.string().email('Invalid email').optional(),
    guestPhone: z.string().optional(),
    specialRequests: z.string().max(500).optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  });

export type PosBookingInput = z.infer<typeof posBookingSchema>;

export type EarlyCheckOutInput = z.infer<typeof earlyCheckOutSchema>;
