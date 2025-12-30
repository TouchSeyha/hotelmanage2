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
  /**
   * Get all room types (public)
   * Optionally filter by isActive and sort
   */
  getAll: publicProcedure.input(roomTypeFiltersSchema.optional()).query(async ({ ctx, input }) => {
    const { isActive, sortBy = 'basePrice', order = 'asc' } = input ?? {};

    return ctx.db.roomType.findMany({
      where: isActive !== undefined ? { isActive } : undefined,
      orderBy: { [sortBy]: order },
      include: {
        _count: {
          select: { rooms: true },
        },
      },
    });
  }),

  /**
   * Get a single room type by slug (public)
   * Includes available rooms
   */
  getBySlug: publicProcedure.input(getRoomTypeBySlugSchema).query(async ({ ctx, input }) => {
    const roomType = await ctx.db.roomType.findUnique({
      where: { slug: input.slug },
      include: {
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

  /**
   * Create a new room type (admin only)
   */
  create: adminProcedure.input(createRoomTypeSchema).mutation(async ({ ctx, input }) => {
    // Check if slug already exists
    const existing = await ctx.db.roomType.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A room type with this slug already exists',
      });
    }

    return ctx.db.roomType.create({
      data: input,
    });
  }),

  /**
   * Update a room type (admin only)
   */
  update: adminProcedure.input(updateRoomTypeSchema).mutation(async ({ ctx, input }) => {
    const { id, data } = input;

    // Check if room type exists
    const existing = await ctx.db.roomType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room type not found',
      });
    }

    // If slug is being updated, check for conflicts
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

    return ctx.db.roomType.update({
      where: { id },
      data,
    });
  }),

  /**
   * Delete a room type (admin only)
   * Only allowed if no rooms exist for this type
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if room type has any rooms
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
