import { TRPCError } from '@trpc/server';
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import {
  createReviewSchema,
  updateReviewSchema,
  approveReviewSchema,
  rejectReviewSchema,
  deleteReviewSchema,
  getReviewByIdSchema,
  reviewFiltersSchema,
  publicReviewFiltersSchema,
  getUserReviewsSchema,
  canReviewBookingSchema,
  getStatsSchema,
} from '~/lib/schemas';

export const reviewRouter = createTRPCRouter({
  // ========================================
  // PUBLIC PROCEDURES (for displaying reviews on website)
  // ========================================

  /**
   * Get all approved reviews (public-facing)
   * Used for displaying reviews on room pages and home page
   */
  getApproved: publicProcedure
    .input(publicReviewFiltersSchema.optional())
    .query(async ({ ctx, input }) => {
      const {
        page = 1,
        limit = 10,
        roomTypeId,
        roomId,
        minRating,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = input ?? {};

      const skip = (page - 1) * limit;

      const where = {
        status: 'approved' as const,
        ...(roomTypeId && { roomTypeId }),
        ...(roomId && { roomId }),
        ...(minRating && { rating: { gte: minRating } }),
      };

      const [reviews, total, stats] = await Promise.all([
        ctx.db.review.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            room: {
              select: {
                roomNumber: true,
              },
            },
            roomType: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        ctx.db.review.count({ where }),
        // Get average rating and count
        ctx.db.review.aggregate({
          where,
          _avg: { rating: true },
          _count: { rating: true },
        }),
      ]);

      return {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          averageRating: stats._avg.rating ?? 0,
          totalReviews: stats._count.rating,
        },
      };
    }),

  /**
   * Get review statistics for a specific room or room type
   */
  getStats: publicProcedure.input(getStatsSchema).query(async ({ ctx, input }) => {
    const where = {
      status: 'approved' as const,
      ...(input.roomTypeId && { roomTypeId: input.roomTypeId }),
      ...(input.roomId && { roomId: input.roomId }),
    };

    // Get rating distribution and average
    const [stats, ratingDistribution] = await Promise.all([
      ctx.db.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
      ctx.db.review.groupBy({
        by: ['rating'],
        where,
        _count: { rating: true },
        orderBy: { rating: 'desc' },
      }),
    ]);

    // Format rating distribution as object { 5: count, 4: count, etc }
    const distribution = [5, 4, 3, 2, 1].reduce(
      (acc, rating) => {
        const found = ratingDistribution.find((r) => r.rating === rating);
        acc[rating] = found?._count.rating ?? 0;
        return acc;
      },
      {} as Record<number, number>,
    );

    return {
      averageRating: stats._avg.rating ?? 0,
      totalReviews: stats._count.rating,
      ratingDistribution: distribution,
    };
  }),

  // ========================================
  // PROTECTED PROCEDURES (authenticated users)
  // ========================================

  /**
   * Check if user can review a booking
   * Business rules:
   * - Booking must belong to user
   * - Booking must be completed or checked_out
   * - No existing review for this booking
   */
  canReview: protectedProcedure
    .input(canReviewBookingSchema)
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          review: true,
        },
      });

      if (!booking) {
        return {
          canReview: false,
          reason: 'Booking not found',
        };
      }

      // Check ownership
      if (booking.userId !== ctx.session.user.id) {
        return {
          canReview: false,
          reason: 'You can only review your own bookings',
        };
      }

      // Check if already reviewed
      if (booking.review) {
        return {
          canReview: false,
          reason: 'You have already reviewed this booking',
          existingReviewId: booking.review.id,
        };
      }

      // Check booking status
      const validStatuses = ['completed', 'checked_out'];
      if (!validStatuses.includes(booking.status)) {
        return {
          canReview: false,
          reason: 'You can only review completed stays',
        };
      }

      return {
        canReview: true,
        reason: null,
      };
    }),

  /**
   * Create a new review (customer-facing)
   * Validates business rules before creating
   */
  create: protectedProcedure
    .input(createReviewSchema)
    .mutation(async ({ ctx, input }) => {
      // Get booking with relations
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          review: true,
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

      // Verify ownership
      if (booking.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only review your own bookings',
        });
      }

      // Check if already reviewed
      if (booking.review) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already reviewed this booking',
        });
      }

      // Check booking status - only completed or checked_out bookings can be reviewed
      const validStatuses = ['completed', 'checked_out'];
      if (!validStatuses.includes(booking.status)) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'You can only review completed stays',
        });
      }

      // Create review
      const review = await ctx.db.review.create({
        data: {
          bookingId: input.bookingId,
          userId: ctx.session.user.id,
          roomId: booking.roomId,
          roomTypeId: booking.room.roomTypeId,
          rating: input.rating,
          comment: input.comment,
          status: 'pending', // Requires admin approval
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            select: {
              roomNumber: true,
            },
          },
          roomType: {
            select: {
              name: true,
            },
          },
        },
      });

      // TODO: Send notification to admin about new review pending approval

      return review;
    }),

  /**
   * Get current user's reviews
   */
  getMyReviews: protectedProcedure
    .input(getUserReviewsSchema.optional())
    .query(async ({ ctx, input }) => {
      const { page = 1, limit = 10, status } = input ?? {};
      const skip = (page - 1) * limit;

      const where = {
        userId: ctx.session.user.id,
        ...(status && { status }),
      };

      const [reviews, total] = await Promise.all([
        ctx.db.review.findMany({
          where,
          include: {
            booking: {
              select: {
                bookingNumber: true,
                checkInDate: true,
                checkOutDate: true,
              },
            },
            room: {
              select: {
                roomNumber: true,
              },
            },
            roomType: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        ctx.db.review.count({ where }),
      ]);

      return {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // ========================================
  // ADMIN PROCEDURES
  // ========================================

  /**
   * Get all reviews with filters (admin only)
   */
  getAll: adminProcedure.input(reviewFiltersSchema.optional()).query(async ({ ctx, input }) => {
    const {
      page = 1,
      limit = 10,
      status,
      rating,
      roomTypeId,
      roomId,
      userId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = input ?? {};

    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(rating && { rating }),
      ...(roomTypeId && { roomTypeId }),
      ...(roomId && { roomId }),
      ...(userId && { userId }),
      ...(search && {
        comment: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const [reviews, total, pendingCount] = await Promise.all([
      ctx.db.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          booking: {
            select: {
              bookingNumber: true,
              checkInDate: true,
              checkOutDate: true,
            },
          },
          room: {
            select: {
              roomNumber: true,
            },
          },
          roomType: {
            select: {
              name: true,
              slug: true,
            },
          },
          approvedBy: {
            select: {
              name: true,
            },
          },
          rejectedBy: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      ctx.db.review.count({ where }),
      ctx.db.review.count({ where: { status: 'pending' } }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      pendingCount,
    };
  }),

  /**
   * Get single review by ID (admin only)
   */
  getById: adminProcedure.input(getReviewByIdSchema).query(async ({ ctx, input }) => {
    const review = await ctx.db.review.findUnique({
      where: { id: input.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            checkInDate: true,
            checkOutDate: true,
            numberOfGuests: true,
            totalPrice: true,
          },
        },
        room: {
          select: {
            id: true,
            roomNumber: true,
          },
        },
        roomType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
          },
        },
        rejectedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!review) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Review not found',
      });
    }

    return review;
  }),

  /**
   * Approve a review (admin only)
   * Sets status to approved and makes it visible on public site
   */
  approve: adminProcedure.input(approveReviewSchema).mutation(async ({ ctx, input }) => {
    const review = await ctx.db.review.findUnique({
      where: { id: input.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!review) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Review not found',
      });
    }

    if (review.status === 'approved') {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Review is already approved',
      });
    }

    const updatedReview = await ctx.db.review.update({
      where: { id: input.id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        approvedById: ctx.session.user.id,
        // Clear rejection data if previously rejected
        rejectedAt: null,
        rejectedById: null,
        rejectionReason: null,
      },
    });

    // TODO: Send notification email to user that their review was approved

    return updatedReview;
  }),

  /**
   * Reject a review (admin only)
   * Sets status to rejected and hides from public site
   */
  reject: adminProcedure.input(rejectReviewSchema).mutation(async ({ ctx, input }) => {
    const review = await ctx.db.review.findUnique({
      where: { id: input.id },
    });

    if (!review) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Review not found',
      });
    }

    if (review.status === 'rejected') {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Review is already rejected',
      });
    }

    const updatedReview = await ctx.db.review.update({
      where: { id: input.id },
      data: {
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedById: ctx.session.user.id,
        rejectionReason: input.rejectionReason,
        // Clear approval data if previously approved
        approvedAt: null,
        approvedById: null,
      },
    });

    // TODO: Optionally send notification to user about rejection

    return updatedReview;
  }),

  /**
   * Update a review (admin only)
   * Allows admin to edit review content if needed
   */
  update: adminProcedure.input(updateReviewSchema).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;

    const review = await ctx.db.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Review not found',
      });
    }

    return ctx.db.review.update({
      where: { id },
      data,
    });
  }),

  /**
   * Delete a review (admin only)
   * Permanently removes the review
   */
  delete: adminProcedure.input(deleteReviewSchema).mutation(async ({ ctx, input }) => {
    const review = await ctx.db.review.findUnique({
      where: { id: input.id },
    });

    if (!review) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Review not found',
      });
    }

    return ctx.db.review.delete({
      where: { id: input.id },
    });
  }),
});
