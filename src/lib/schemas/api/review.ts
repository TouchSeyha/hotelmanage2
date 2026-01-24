import { z } from 'zod';
import { paginationSchema } from '../common';

// Review status enum matching Prisma
export const reviewStatusSchema = z.enum(['pending', 'approved', 'rejected']);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

// Create review schema (customer-facing)
export const createReviewSchema = z.object({
  bookingId: z.string().cuid(),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating must be at most 5 stars'),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be at most 1000 characters')
    .trim(),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// Update review schema (admin only - for editing customer reviews if needed)
export const updateReviewSchema = z.object({
  id: z.string().cuid(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).trim().optional(),
});
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

// Approve review schema
export const approveReviewSchema = z.object({
  id: z.string().cuid(),
});
export type ApproveReviewInput = z.infer<typeof approveReviewSchema>;

// Reject review schema
export const rejectReviewSchema = z.object({
  id: z.string().cuid(),
  rejectionReason: z.string().min(5).max(500).optional(),
});
export type RejectReviewInput = z.infer<typeof rejectReviewSchema>;

// Delete review schema
export const deleteReviewSchema = z.object({
  id: z.string().cuid(),
});
export type DeleteReviewInput = z.infer<typeof deleteReviewSchema>;

// Get review by ID
export const getReviewByIdSchema = z.object({
  id: z.string().cuid(),
});
export type GetReviewByIdInput = z.infer<typeof getReviewByIdSchema>;

// Review filters for admin listing
export const reviewFiltersSchema = paginationSchema.extend({
  status: reviewStatusSchema.optional(),
  rating: z.number().int().min(1).max(5).optional(),
  roomTypeId: z.string().cuid().optional(),
  roomId: z.string().cuid().optional(),
  userId: z.string().cuid().optional(),
  search: z.string().optional(), // Search in comment
  sortBy: z.enum(['createdAt', 'rating', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type ReviewFiltersInput = z.infer<typeof reviewFiltersSchema>;

// Public review filters (only approved reviews)
export const publicReviewFiltersSchema = paginationSchema.extend({
  roomTypeId: z.string().cuid().optional(),
  roomId: z.string().cuid().optional(),
  minRating: z.number().int().min(1).max(5).optional(),
  sortBy: z.enum(['createdAt', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type PublicReviewFiltersInput = z.infer<typeof publicReviewFiltersSchema>;

// Get user's own reviews
export const getUserReviewsSchema = paginationSchema.extend({
  status: reviewStatusSchema.optional(),
});
export type GetUserReviewsInput = z.infer<typeof getUserReviewsSchema>;

// Check if user can review a booking
export const canReviewBookingSchema = z.object({
  bookingId: z.string().cuid(),
});
export type CanReviewBookingInput = z.infer<typeof canReviewBookingSchema>;

// Get stats schema
export const getStatsSchema = z.object({
  roomTypeId: z.string().cuid().optional(),
  roomId: z.string().cuid().optional(),
});
export type GetStatsInput = z.infer<typeof getStatsSchema>;
