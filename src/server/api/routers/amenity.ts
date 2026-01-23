import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure, adminProcedure } from '~/server/api/trpc';
import {
  createAmenitySchema,
  updateAmenitySchema,
  getAmenityByIdSchema,
  deleteAmenitySchema,
} from '~/lib/schemas';

export const amenityRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.amenity.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
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
