import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { format } from 'date-fns';

import { createTRPCRouter, protectedProcedure, adminProcedure } from '~/server/api/trpc';
import {
  createBookingSchema,
  updateBookingSchema,
  cancelBookingSchema,
  bookingFiltersSchema,
  getBookingByIdSchema,
  checkInSchema,
  checkOutSchema,
  posBookingSchema,
} from '~/lib/schemas';
import { resend } from '~/server/resend';
import { env } from '~/env';
import { BookingConfirmationEmail } from '~/server/email/templates/booking-confirmation';
import { PaymentConfirmationEmail } from '~/server/email/templates/payment-confirmation';

// Helper function to generate booking number
function generateBookingNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `BK${year}${month}${day}${random}`;
}

// Helper function to calculate total price
function calculateTotalPrice(basePrice: number, checkIn: Date, checkOut: Date): number {
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  return basePrice * nights;
}

export const bookingRouter = createTRPCRouter({
  /**
   * Get all bookings (protected)
   * Users see only their own bookings, admins see all
   */
  getAll: protectedProcedure
    .input(bookingFiltersSchema.optional())
    .query(async ({ ctx, input }) => {
      const {
        status,
        paymentStatus,
        checkInDate,
        checkOutDate,
        search,
        page = 1,
        limit = 10,
      } = input ?? {};

      const isAdmin = ctx.session.user.role === 'admin';
      const skip = (page - 1) * limit;

      const where = {
        // Users can only see their own bookings
        ...(!isAdmin && { userId: ctx.session.user.id }),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(checkInDate && { checkInDate: { gte: checkInDate } }),
        ...(checkOutDate && { checkOutDate: { lte: checkOutDate } }),
        ...(search && {
          OR: [
            { bookingNumber: { contains: search, mode: 'insensitive' as const } },
            { user: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }),
      };

      const [bookings, total] = await Promise.all([
        ctx.db.booking.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            room: {
              include: {
                roomType: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        ctx.db.booking.count({ where }),
      ]);

      return {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  /**
   * Get a single booking by ID (protected)
   * Users can only see their own bookings unless admin
   */
  getById: protectedProcedure.input(getBookingByIdSchema).query(async ({ ctx, input }) => {
    const booking = await ctx.db.booking.findUnique({
      where: { id: input.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        room: {
          include: {
            roomType: true,
          },
        },
        logs: {
          include: {
            performedBy: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Booking not found',
      });
    }

    // Check authorization
    const isAdmin = ctx.session.user.role === 'admin';
    const isOwner = booking.userId === ctx.session.user.id;

    if (!isAdmin && !isOwner) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not authorized to view this booking',
      });
    }

    return booking;
  }),

  /**
   * Create a new booking (protected - logged in users)
   * Supports both roomId (direct room) and roomTypeId (auto-assign available room)
   */
  create: protectedProcedure.input(createBookingSchema).mutation(async ({ ctx, input }) => {
    const {
      roomId,
      roomTypeId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      paymentMethod,
      specialRequests,
      guestName,
      guestEmail,
      guestPhone,
    } = input;

    let targetRoom;

    if (roomId) {
      // Direct room booking
      targetRoom = await ctx.db.room.findUnique({
        where: { id: roomId },
        include: { roomType: true },
      });

      if (!targetRoom) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room not found',
        });
      }
    } else if (roomTypeId) {
      // Auto-assign an available room of the specified type
      const availableRoom = await ctx.db.room.findFirst({
        where: {
          roomTypeId,
          status: 'available',
          bookings: {
            none: {
              AND: [
                { checkInDate: { lt: checkOutDate } },
                { checkOutDate: { gt: checkInDate } },
                { status: { notIn: ['cancelled', 'completed'] } },
              ],
            },
          },
        },
        include: { roomType: true },
        orderBy: { roomNumber: 'asc' },
      });

      if (!availableRoom) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No rooms available for the selected room type and dates',
        });
      }

      targetRoom = availableRoom;
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Either roomId or roomTypeId must be provided',
      });
    }

    // Check room capacity
    if (numberOfGuests > targetRoom.roomType.capacity) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `This room can only accommodate ${targetRoom.roomType.capacity} guests`,
      });
    }

    // Verify room availability (double-check for race conditions)
    const conflictingBooking = await ctx.db.booking.findFirst({
      where: {
        roomId: targetRoom.id,
        status: { notIn: ['cancelled', 'completed'] },
        AND: [{ checkInDate: { lt: checkOutDate } }, { checkOutDate: { gt: checkInDate } }],
      },
    });

    if (conflictingBooking) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Room is not available for the selected dates',
      });
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(
      Number(targetRoom.roomType.basePrice),
      checkInDate,
      checkOutDate
    );

    // Generate unique booking number
    let bookingNumber = generateBookingNumber();
    let attempts = 0;
    while ((await ctx.db.booking.findUnique({ where: { bookingNumber } })) && attempts < 10) {
      bookingNumber = generateBookingNumber();
      attempts++;
    }

    // Get user info for guest fields if not provided
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { name: true, email: true, phone: true },
    });

    // Create booking
    const booking = await ctx.db.booking.create({
      data: {
        bookingNumber,
        userId: ctx.session.user.id,
        roomId: targetRoom.id,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        totalPrice,
        paymentMethod,
        specialRequests,
        guestName: guestName ?? user?.name ?? null,
        guestEmail: guestEmail ?? user?.email ?? null,
        guestPhone: guestPhone ?? user?.phone ?? null,
        status: 'pending',
        paymentStatus: 'pending',
      },
      include: {
        room: {
          include: {
            roomType: true,
          },
        },
      },
    });

    // Create booking log
    await ctx.db.bookingLog.create({
      data: {
        bookingId: booking.id,
        action: 'CREATED',
        performedById: ctx.session.user.id,
        newStatus: 'pending',
        notes: `Booking created with ${paymentMethod} payment method`,
      },
    });

    // Send confirmation email (don't fail booking if email fails)
    try {
      const guestEmailAddress = booking.guestEmail ?? user?.email;
      if (guestEmailAddress) {
        await resend.emails.send({
          from: env.NODE_ENV === 'production' ? 'onboarding@resend.dev' : 'onboarding@resend.dev',
          to: env.NODE_ENV === 'production' ? [guestEmailAddress] : [env.RESEND_DEV_EMAIL],
          subject: `Booking Confirmation - ${bookingNumber}`,
          react: BookingConfirmationEmail({
            guestName: booking.guestName ?? user?.name ?? 'Guest',
            bookingNumber: booking.bookingNumber,
            roomType: booking.room.roomType.name,
            roomNumber: booking.room.roomNumber,
            checkInDate: format(booking.checkInDate, 'EEEE, MMMM d, yyyy'),
            checkOutDate: format(booking.checkOutDate, 'EEEE, MMMM d, yyyy'),
            numberOfGuests: booking.numberOfGuests,
            totalPrice: Number(booking.totalPrice),
            paymentStatus: booking.paymentStatus,
          }),
        });
      }
    } catch {
      // Email failed but booking was successful
      // In production, this should be logged to a monitoring service
    }

    return booking;
  }),

  /**
   * Update booking (admin only)
   */
  update: adminProcedure.input(updateBookingSchema).mutation(async ({ ctx, input }) => {
    const { id, status, paymentStatus, notes } = input;

    const booking = await ctx.db.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Booking not found',
      });
    }

    const updatedBooking = await ctx.db.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        room: {
          include: {
            roomType: true,
          },
        },
      },
    });

    // Create booking log
    await ctx.db.bookingLog.create({
      data: {
        bookingId: id,
        action: 'UPDATED',
        performedById: ctx.session.user.id,
        previousStatus: booking.status,
        newStatus: status ?? booking.status,
        notes: notes ?? `Status updated to ${status ?? booking.status}`,
      },
    });

    return updatedBooking;
  }),

  /**
   * Check in a guest (admin only)
   */
  checkIn: adminProcedure.input(checkInSchema).mutation(async ({ ctx, input }) => {
    const booking = await ctx.db.booking.findUnique({
      where: { id: input.id },
      include: { room: true },
    });

    if (!booking) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Booking not found',
      });
    }

    // Validate booking can be checked in
    if (booking.status !== 'confirmed') {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Only confirmed bookings can be checked in',
      });
    }

    // Update booking and room status in a transaction
    const [updatedBooking] = await ctx.db.$transaction([
      ctx.db.booking.update({
        where: { id: input.id },
        data: {
          status: 'checked_in',
          checkedInAt: new Date(),
        },
      }),
      ctx.db.room.update({
        where: { id: booking.roomId },
        data: { status: 'occupied' },
      }),
      ctx.db.bookingLog.create({
        data: {
          bookingId: input.id,
          action: 'CHECK_IN',
          performedById: ctx.session.user.id,
          previousStatus: booking.status,
          newStatus: 'checked_in',
          notes: 'Guest checked in',
        },
      }),
    ]);

    return updatedBooking;
  }),

  /**
   * Check out a guest (admin only)
   */
  checkOut: adminProcedure.input(checkOutSchema).mutation(async ({ ctx, input }) => {
    const booking = await ctx.db.booking.findUnique({
      where: { id: input.id },
      include: { room: true },
    });

    if (!booking) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Booking not found',
      });
    }

    // Validate booking can be checked out
    if (booking.status !== 'checked_in') {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Only checked-in bookings can be checked out',
      });
    }

    // Update booking and room status in a transaction
    const [updatedBooking] = await ctx.db.$transaction([
      ctx.db.booking.update({
        where: { id: input.id },
        data: {
          status: 'completed',
          checkedOutAt: new Date(),
        },
      }),
      ctx.db.room.update({
        where: { id: booking.roomId },
        data: { status: 'available' },
      }),
      ctx.db.bookingLog.create({
        data: {
          bookingId: input.id,
          action: 'CHECK_OUT',
          performedById: ctx.session.user.id,
          previousStatus: booking.status,
          newStatus: 'completed',
          notes: 'Guest checked out',
        },
      }),
    ]);

    return updatedBooking;
  }),

  /**
   * Cancel a booking (protected - owner or admin)
   */
  cancel: protectedProcedure.input(cancelBookingSchema).mutation(async ({ ctx, input }) => {
    const booking = await ctx.db.booking.findUnique({
      where: { id: input.id },
    });

    if (!booking) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Booking not found',
      });
    }

    // Check authorization
    const isAdmin = ctx.session.user.role === 'admin';
    const isOwner = booking.userId === ctx.session.user.id;

    if (!isAdmin && !isOwner) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not authorized to cancel this booking',
      });
    }

    // Validate booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Only pending or confirmed bookings can be cancelled',
      });
    }

    const updatedBooking = await ctx.db.booking.update({
      where: { id: input.id },
      data: {
        status: 'cancelled',
        cancellationReason: input.cancellationReason,
      },
    });

    // Create booking log
    await ctx.db.bookingLog.create({
      data: {
        bookingId: input.id,
        action: 'CANCELLED',
        performedById: ctx.session.user.id,
        previousStatus: booking.status,
        newStatus: 'cancelled',
        notes: input.cancellationReason ?? 'Booking cancelled',
      },
    });

    return updatedBooking;
  }),

  /**
   * Confirm payment (admin only)
   */
  confirmPayment: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: true,
            },
          },
        },
      });

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        });
      }

      if (booking.paymentStatus === 'paid') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Payment has already been confirmed',
        });
      }

      const updatedBooking = await ctx.db.booking.update({
        where: { id: input.id },
        data: {
          paymentStatus: 'paid',
          status: booking.status === 'pending' ? 'confirmed' : booking.status,
        },
      });

      // Create booking log
      await ctx.db.bookingLog.create({
        data: {
          bookingId: input.id,
          action: 'PAYMENT_CONFIRMED',
          performedById: ctx.session.user.id,
          previousStatus: booking.status,
          newStatus: updatedBooking.status,
          notes: 'Payment confirmed by admin',
        },
      });

      // Send payment confirmation email (don't fail if email fails)
      try {
        const guestEmailAddress = booking.guestEmail ?? booking.user.email;
        if (guestEmailAddress) {
          await resend.emails.send({
            from: env.NODE_ENV === 'production' ? 'onboarding@resend.dev' : 'onboarding@resend.dev',
            to: env.NODE_ENV === 'production' ? [guestEmailAddress] : [env.RESEND_DEV_EMAIL],
            subject: `Payment Confirmed - ${booking.bookingNumber}`,
            react: PaymentConfirmationEmail({
              guestName: booking.guestName ?? booking.user.name ?? 'Guest',
              bookingNumber: booking.bookingNumber,
              paymentAmount: Number(booking.totalPrice),
              paymentMethod: booking.paymentMethod === 'online' ? 'Online Payment' : 'Pay at Hotel',
              paymentDate: format(new Date(), 'EEEE, MMMM d, yyyy'),
              roomType: booking.room.roomType.name,
              checkInDate: format(booking.checkInDate, 'EEEE, MMMM d, yyyy'),
              checkOutDate: format(booking.checkOutDate, 'EEEE, MMMM d, yyyy'),
            }),
          });
        }
      } catch {
        // Email failed but payment was confirmed
        // In production, this should be logged to a monitoring service
      }

      return updatedBooking;
    }),

  /**
   * POS Booking - Walk-in booking by admin
   */
  createPosBooking: adminProcedure.input(posBookingSchema).mutation(async ({ ctx, input }) => {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = input;

    // Get room and verify it exists
    const room = await ctx.db.room.findUnique({
      where: { id: roomId },
      include: {
        roomType: true,
      },
    });

    if (!room) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Room not found',
      });
    }

    // Check room capacity
    if (numberOfGuests > room.roomType.capacity) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `This room can only accommodate ${room.roomType.capacity} guests`,
      });
    }

    // Check room availability
    const conflictingBooking = await ctx.db.booking.findFirst({
      where: {
        roomId,
        status: { notIn: ['cancelled', 'completed'] },
        AND: [{ checkInDate: { lt: checkOutDate } }, { checkOutDate: { gt: checkInDate } }],
      },
    });

    if (conflictingBooking) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Room is not available for the selected dates',
      });
    }

    // Create or find guest user
    let guestUser = guestEmail
      ? await ctx.db.user.findUnique({ where: { email: guestEmail } })
      : null;

    // Create a new guest user account if not found
    guestUser ??= await ctx.db.user.create({
      data: {
        name: guestName,
        email: guestEmail ?? `walk-in-${Date.now()}@guest.local`,
        phone: guestPhone,
        role: 'user',
      },
    });

    // Calculate total price
    const totalPrice = calculateTotalPrice(
      Number(room.roomType.basePrice),
      checkInDate,
      checkOutDate
    );

    // Generate unique booking number
    let bookingNumber = generateBookingNumber();
    let attempts = 0;
    while ((await ctx.db.booking.findUnique({ where: { bookingNumber } })) && attempts < 10) {
      bookingNumber = generateBookingNumber();
      attempts++;
    }

    // Create booking (confirmed immediately for POS)
    const booking = await ctx.db.booking.create({
      data: {
        bookingNumber,
        userId: guestUser.id,
        roomId,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        totalPrice,
        paymentMethod: 'counter',
        specialRequests,
        status: 'confirmed',
        paymentStatus: 'pending', // Will be marked paid after payment
      },
      include: {
        user: true,
        room: {
          include: {
            roomType: true,
          },
        },
      },
    });

    // Create booking log
    await ctx.db.bookingLog.create({
      data: {
        bookingId: booking.id,
        action: 'POS_CREATED',
        performedById: ctx.session.user.id,
        newStatus: 'confirmed',
        notes: `Walk-in booking created by ${ctx.session.user.name ?? 'Admin'}`,
      },
    });

    return booking;
  }),
});
