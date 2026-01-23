import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, adminProcedure } from '~/server/api/trpc';
import {
  createAmenitySchema,
  updateAmenitySchema,
  getAmenityByIdSchema,
  deleteAmenitySchema,
} from '~/lib/schemas';

/** Schema for filtering and paginating amenities */
const amenityFiltersSchema = z
  .object({
    category: z.string().optional(),
    isActive: z.boolean().optional(),
    search: z.string().optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(50),
  })
  .optional();

export const amenityRouter = createTRPCRouter({
  /**
   * Get all amenities with optional filtering and pagination.
   * Public endpoint for displaying amenities on room pages.
   */
  getAll: publicProcedure.input(amenityFiltersSchema).query(async ({ ctx, input }) => {
    const { category, isActive, search, page = 1, limit = 50 } = input ?? {};
    const skip = (page - 1) * limit;

    const where = {
      ...(category && { category }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [amenities, total] = await Promise.all([
      ctx.db.amenity.findMany({
        where,
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      ctx.db.amenity.count({ where }),
    ]);

    return {
      items: amenities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }),

  getById: publicProcedure.input(getAmenityByIdSchema).query(async ({ ctx, input }) => {
    const amenity = await ctx.db.amenity.findUnique({
      where: { id: input.id },
    });

    if (!amenity) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Amenity not found',
      });
    }

    return amenity;
  }),

  create: adminProcedure.input(createAmenitySchema).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.amenity.findUnique({
      where: { name: input.name },
    });

    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'An amenity with this name already exists',
      });
    }

    return ctx.db.amenity.create({
      data: input,
    });
  }),

  update: adminProcedure.input(updateAmenitySchema).mutation(async ({ ctx, input }) => {
    const { id, data } = input;

    const existing = await ctx.db.amenity.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Amenity not found',
      });
    }

    if (data.name && data.name !== existing.name) {
      const nameConflict = await ctx.db.amenity.findUnique({
        where: { name: data.name },
      });

      if (nameConflict) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'An amenity with this name already exists',
        });
      }
    }

    return ctx.db.amenity.update({
      where: { id },
      data,
    });
  }),

  delete: adminProcedure.input(deleteAmenitySchema).mutation(async ({ ctx, input }) => {
    const amenity = await ctx.db.amenity.findUnique({
      where: { id: input.id },
      include: {
        _count: {
          select: { roomTypes: true },
        },
      },
    });

    if (!amenity) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Amenity not found',
      });
    }

    if (amenity._count.roomTypes > 0) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: `Cannot delete amenity. It is used by ${amenity._count.roomTypes} room type(s).`,
      });
    }

    return ctx.db.amenity.delete({
      where: { id: input.id },
    });
  }),
});
