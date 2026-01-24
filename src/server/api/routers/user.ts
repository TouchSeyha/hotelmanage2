import { TRPCError } from '@trpc/server';
import { startOfDay } from 'date-fns';

import { createTRPCRouter, protectedProcedure, adminProcedure } from '~/server/api/trpc';
import {
  updateProfileSchema,
  adminUpdateUserSchema,
  userFiltersSchema,
  getUserByIdSchema,
  deleteUserSchema,
  INACTIVE_BOOKING_STATUSES,
} from '~/lib/schemas';

export const userRouter = createTRPCRouter({
  /**
   * Get all users (admin only)
   * Paginated with optional filters
   */
  getAll: adminProcedure.input(userFiltersSchema.optional()).query(async ({ ctx, input }) => {
    const { role, search, page = 1, limit = 10 } = input ?? {};
    const skip = (page - 1) * limit;

    const where = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      ctx.db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          image: true,
          createdAt: true,
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      ctx.db.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }),

  /**
   * Get a single user by ID (admin only)
   * Includes booking history and stats
   */
  getById: adminProcedure.input(getUserByIdSchema).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            room: {
              include: {
                roomType: {
                  select: { name: true },
                },
              },
            },
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Calculate total revenue from this user
    const totalRevenue = await ctx.db.booking.aggregate({
      where: {
        userId: input.id,
        status: { in: ['confirmed', 'checked_in', 'completed'] },
      },
      _sum: {
        totalPrice: true,
      },
    });

    return {
      ...user,
      totalRevenue: totalRevenue._sum.totalPrice ?? 0,
    };
  }),

  /**
   * Get current user's profile (protected)
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return user;
  }),

  /**
   * Get dashboard statistics (protected)
   * Returns booking statistics for the current user
   */
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const startOfToday = startOfDay(today);

    const [upcomingBookings, completedBookings, cancelledBookings, totalSpent] = await Promise.all([
      ctx.db.booking.count({
        where: {
          userId: ctx.session.user.id,
          status: { in: ['confirmed', 'checked_in'] },
          checkInDate: { gte: startOfToday },
        },
      }),
      ctx.db.booking.count({
        where: {
          userId: ctx.session.user.id,
          status: 'completed',
        },
      }),
      ctx.db.booking.count({
        where: {
          userId: ctx.session.user.id,
          status: 'cancelled',
        },
      }),
      ctx.db.booking.aggregate({
        where: {
          userId: ctx.session.user.id,
          paymentStatus: 'paid',
        },
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      totalSpent: totalSpent._sum.totalPrice ?? 0,
    };
  }),

  /**
   * Get next upcoming booking (protected)
   * Returns the nearest upcoming booking for the current user
   */
  getNextBooking: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();

    const booking = await ctx.db.booking.findFirst({
      where: {
        userId: ctx.session.user.id,
        status: { in: ['confirmed', 'checked_in'] },
        checkInDate: { gte: today },
      },
      include: {
        room: {
          include: {
            roomType: true,
          },
        },
      },
      orderBy: { checkInDate: 'asc' },
    });

    return booking;
  }),

  /**
   * Update current user's profile (protected)
   */
  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: input,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
      },
    });
  }),

  /**
   * Update a user (admin only)
   * Can update name, phone, and role
   */
  update: adminProcedure.input(adminUpdateUserSchema).mutation(async ({ ctx, input }) => {
    const { id, data } = input;

    // Check if user exists
    const existing = await ctx.db.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Prevent admin from demoting themselves
    if (id === ctx.session.user.id && data.role === 'user') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot demote yourself from admin',
      });
    }

    return ctx.db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
      },
    });
  }),

  /**
   * Delete a user (admin only)
   * Cannot delete user with active bookings
   */
  delete: adminProcedure.input(deleteUserSchema).mutation(async ({ ctx, input }) => {
    // Check if user exists
    const user = await ctx.db.user.findUnique({
      where: { id: input.id },
      include: {
        bookings: {
          where: {
            status: { notIn: INACTIVE_BOOKING_STATUSES },
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (input.id === ctx.session.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot delete your own account',
      });
    }

    // Prevent deleting user with active bookings
    if (user.bookings.length > 0) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Cannot delete user with active bookings',
      });
    }

    return ctx.db.user.delete({
      where: { id: input.id },
    });
  }),
});
