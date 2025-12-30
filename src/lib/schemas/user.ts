import { z } from "zod";
import { paginationSchema } from "./common";

// Role enum matching Prisma
export const roleSchema = z.enum(["user", "admin"]);

export type Role = z.infer<typeof roleSchema>;

// Update user profile schema (for own profile)
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  phone: z.string().max(20).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Admin update user schema
export const adminUpdateUserSchema = z.object({
  id: z.string().cuid(),
  data: z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
    role: roleSchema.optional(),
  }),
});

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;

// User query filters (admin)
export const userFiltersSchema = paginationSchema.extend({
  role: roleSchema.optional(),
  search: z.string().optional(), // Search by name or email
});

export type UserFiltersInput = z.infer<typeof userFiltersSchema>;

// Get user by ID schema
export const getUserByIdSchema = z.object({
  id: z.string().cuid(),
});

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;

// Delete user schema
export const deleteUserSchema = z.object({
  id: z.string().cuid(),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
