import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, adminProcedure } from '~/server/api/trpc';
import {
  createRoomSchema,
  updateRoomSchema,
  roomFiltersSchema,
  checkAvailabilitySchema,
  bulkCreateRoomsSchema,
  updateRoomStatusSchema,
  INACTIVE_BOOKING_STATUSES,
} from '~/lib/schemas';

export const roomRouter = createTRPCRouter({
  /**
   * Get all rooms (public for listing, includes room type info)
   */
  getAll: publicProcedure.input(roomFiltersSchema.optional()).query(async ({ ctx, input }) => {
    const { status, roomTypeId, floor } = input ?? {};

    return ctx.db.room.findMany({
      where: {
        ...(status && { status }),
        ...(roomTypeId && { roomTypeId }),
        ...(floor && { floor }),
      },
      include: {
        roomType: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            capacity: true,
            images: true,
          },
        },
      },
      orderBy: [{ roomTypeId: 'asc' }, { roomNumber: 'asc' }],
    });
  }),

  /**
   * Check room availability for a date range
   * Returns available rooms that don't have conflicting bookings
   */
  checkAvailability: publicProcedure
    .input(checkAvailabilitySchema)
    .query(async ({ ctx, input }) => {
      const { checkIn, checkOut, roomTypeId, guests } = input;

      // Find rooms that are available and don't have conflicting bookings
      const availableRooms = await ctx.db.room.findMany({
        where: {
          status: 'available',
          ...(roomTypeId && { roomTypeId }),
          ...(guests && {
            roomType: {
              capacity: { gte: guests },
            },
          }),
          // Exclude rooms with overlapping bookings
          bookings: {
            none: {
              AND: [
                { checkInDate: { lt: checkOut } },
                { checkOutDate: { gt: checkIn } },
                { status: { notIn: INACTIVE_BOOKING_STATUSES } },
              ],
            },
          },
        },
        include: {
          roomType: {
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
              capacity: true,
              images: true,
              amenities: true,
            },
          },
        },
        orderBy: [{ roomType: { basePrice: 'asc' } }, { roomNumber: 'asc' }],
      });

      // Include roomTypeId in the returned room objects for easier filtering
      const roomsWithTypeId = availableRooms.map((room) => ({
        ...room,
        roomTypeId: room.roomType.id,
      }));

      return {
        availableRooms: roomsWithTypeId,
        totalAvailable: roomsWithTypeId.length,
      };
    }),

  /**
   * Get a single room by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { id: input.id },
        include: {
          roomType: true,
          bookings: {
            where: {
              status: { notIn: INACTIVE_BOOKING_STATUSES },
            },
            orderBy: { checkInDate: 'asc' },
            take: 5,
          },
        },
      });

      if (!room) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room not found',
        });
      }

      return room;
    }),

  /**
   * Create a new room (admin only)
   */
  create: adminProcedure.input(createRoomSchema).mutation(async ({ ctx, input }) => {
    // Check if room number already exists
    const existing = await ctx.db.room.findUnique({
      where: { roomNumber: input.roomNumber },
    });

    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A room with this number already exists',
      });
    }

    // Check if room type exists
    const roomType = await ctx.db.roomType.findUnique({
      where: { id: input.roomTypeId },
    });

    if (!roomType) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room type not found',
      });
    }

    return ctx.db.room.create({
      data: input,
      include: {
        roomType: true,
      },
    });
  }),

  /**
   * Bulk create rooms (admin only)
   */
  bulkCreate: adminProcedure.input(bulkCreateRoomsSchema).mutation(async ({ ctx, input }) => {
    const { roomTypeId, floor, startNumber, count, prefix = '' } = input;

    // Check if room type exists
    const roomType = await ctx.db.roomType.findUnique({
      where: { id: roomTypeId },
    });

    if (!roomType) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room type not found',
      });
    }

    // Generate room numbers and check for conflicts
    const roomNumbers = Array.from({ length: count }, (_, i) => {
      const num = startNumber + i;
      return `${prefix}${floor}${String(num).padStart(2, '0')}`;
    });

    const existingRooms = await ctx.db.room.findMany({
      where: { roomNumber: { in: roomNumbers } },
      select: { roomNumber: true },
    });

    if (existingRooms.length > 0) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: `Some room numbers already exist: ${existingRooms.map((r) => r.roomNumber).join(', ')}`,
      });
    }

    // Create rooms
    const rooms = await ctx.db.room.createMany({
      data: roomNumbers.map((roomNumber) => ({
        roomNumber,
        roomTypeId,
        floor,
        status: 'available',
      })),
    });

    return { created: rooms.count };
  }),

  /**
   * Update a room (admin only)
   */
  update: adminProcedure.input(updateRoomSchema).mutation(async ({ ctx, input }) => {
    const { id, data } = input;

    // Check if room exists
    const existing = await ctx.db.room.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room not found',
      });
    }

    // If room number is being updated, check for conflicts
    if (data.roomNumber && data.roomNumber !== existing.roomNumber) {
      const numberExists = await ctx.db.room.findUnique({
        where: { roomNumber: data.roomNumber },
      });

      if (numberExists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A room with this number already exists',
        });
      }
    }

    return ctx.db.room.update({
      where: { id },
      data,
      include: {
        roomType: true,
      },
    });
  }),

  /**
   * Update room status (admin only)
   * Quick action to change room status (e.g., cleaning -> available)
   */
  updateStatus: adminProcedure.input(updateRoomStatusSchema).mutation(async ({ ctx, input }) => {
    const { id, status } = input;

    // Check if room exists
    const room = await ctx.db.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room not found',
      });
    }

    // Update room status
    return ctx.db.room.update({
      where: { id },
      data: { status },
      include: {
        roomType: true,
      },
    });
  }),

  /**
   * Delete a room (admin only)
   * Only allowed if no active bookings exist
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if room has any active bookings
      const room = await ctx.db.room.findUnique({
        where: { id: input.id },
        include: {
          bookings: {
            where: {
              status: { notIn: INACTIVE_BOOKING_STATUSES },
            },
          },
        },
      });

      if (!room) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room not found',
        });
      }

      if (room.bookings.length > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Cannot delete room with active bookings',
        });
      }

      return ctx.db.room.delete({
        where: { id: input.id },
      });
    }),
});
