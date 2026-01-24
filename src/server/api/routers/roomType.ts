import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, adminProcedure } from '~/server/api/trpc';
import {
  createRoomTypeSchema,
  updateRoomTypeSchema,
  roomTypeFiltersSchema,
  getRoomTypeBySlugSchema,
} from '~/lib/schemas';

export const roomTypeRouter = createTRPCRouter({
  getAll: publicProcedure.input(roomTypeFiltersSchema.optional()).query(async ({ ctx, input }) => {
    const { isActive, sortBy = 'basePrice', order = 'asc' } = input ?? {};

    return ctx.db.roomType.findMany({
      where: isActive !== undefined ? { isActive } : undefined,
      orderBy: { [sortBy]: order },
      include: {
        amenities: true,
        _count: {
          select: { rooms: true },
        },
      },
    });
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const roomType = await ctx.db.roomType.findUnique({
        where: { id: input.id },
        include: {
          amenities: true,
        },
      });

      if (!roomType) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room type not found',
        });
      }

      return roomType;
    }),

  getBySlug: publicProcedure.input(getRoomTypeBySlugSchema).query(async ({ ctx, input }) => {
    const roomType = await ctx.db.roomType.findUnique({
      where: { slug: input.slug },
      include: {
        amenities: true,
        rooms: {
          where: { status: 'available' },
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            status: true,
          },
        },
      },
    });

    if (!roomType) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room type not found',
      });
    }

    return roomType;
  }),

  create: adminProcedure.input(createRoomTypeSchema).mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.roomType.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A room type with this slug already exists',
      });
    }

    const { amenityIds, ...data } = input;

    return ctx.db.roomType.create({
      data: {
        ...data,
        amenities: amenityIds?.length ? { connect: amenityIds.map((id) => ({ id })) } : undefined,
      },
      include: {
        amenities: true,
      },
    });
  }),

  update: adminProcedure.input(updateRoomTypeSchema).mutation(async ({ ctx, input }) => {
    const { id, data } = input;

    const existing = await ctx.db.roomType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room type not found',
      });
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await ctx.db.roomType.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A room type with this slug already exists',
        });
      }
    }

    const { amenityIds, ...updateData } = data;

    return ctx.db.roomType.update({
      where: { id },
      data: {
        ...updateData,
        amenities: amenityIds !== undefined ? { set: amenityIds.map((id) => ({ id })) } : undefined,
      },
      include: {
        amenities: true,
      },
    });
  }),

  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const roomType = await ctx.db.roomType.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { rooms: true },
          },
        },
      });

      if (!roomType) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room type not found',
        });
      }

      if (roomType._count.rooms > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Cannot delete room type that has rooms. Delete the rooms first.',
        });
      }

      return ctx.db.roomType.delete({
        where: { id: input.id },
      });
    }),
});
