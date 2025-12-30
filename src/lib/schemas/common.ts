import { z } from "zod";

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// Date range schema for check-in/check-out
export const dateRangeSchema = z
  .object({
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

// Sort order schema
export const sortOrderSchema = z.enum(["asc", "desc"]).default("asc");

// ID schema (cuid)
export const idSchema = z.string().cuid();

// Slug schema
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase with hyphens only",
  });
