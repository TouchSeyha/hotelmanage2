import { z } from 'zod';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, format } from 'date-fns';

import { createTRPCRouter, adminProcedure } from '~/server/api/trpc';

export const adminRouter = createTRPCRouter({
  /**
   * Get dashboard statistics (admin only)
   * Returns key metrics for the admin dashboard
   */
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfCurrentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);

    // Run all queries in parallel for better performance
    const [
      todayCheckIns,
      todayCheckOuts,
      pendingBookings,
      totalRooms,
      occupiedRooms,
      monthlyRevenue,
      recentBookings,
    ] = await Promise.all([
      // Today's check-ins (confirmed bookings with check-in date today)
      ctx.db.booking.count({
        where: {
          checkInDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
          status: { in: ['confirmed', 'checked_in'] },
        },
      }),

      // Today's check-outs (checked-in bookings with check-out date today)
      ctx.db.booking.count({
        where: {
          checkOutDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
          status: 'checked_in',
        },
      }),

      // Pending bookings (awaiting confirmation)
      ctx.db.booking.count({
        where: {
          status: 'pending',
        },
      }),

      // Total available rooms
      ctx.db.room.count({
        where: {
          status: { in: ['available', 'occupied'] },
        },
      }),

      // Currently occupied rooms
      ctx.db.room.count({
        where: {
          status: 'occupied',
        },
      }),

      // Monthly revenue (sum of confirmed/completed bookings)
      ctx.db.booking.aggregate({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
          status: { in: ['confirmed', 'checked_in', 'completed'] },
          paymentStatus: 'paid',
        },
        _sum: {
          totalPrice: true,
        },
      }),

      // Recent bookings (last 10)
      ctx.db.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: { name: true },
              },
            },
          },
        },
      }),
    ]);

    // Calculate occupancy rate
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      todayCheckIns,
      todayCheckOuts,
      pendingBookings,
      occupancyRate,
      totalRevenue: monthlyRevenue._sum.totalPrice ?? 0,
      availableRooms: totalRooms - occupiedRooms,
      totalRooms,
      recentBookings,
    };
  }),

  /**
   * Get revenue data for charts (admin only)
   */
  getRevenue: adminProcedure
    .input(
      z.object({
        period: z.enum(['day', 'week', 'month', 'year']).default('month'),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { period, startDate, endDate } = input;

      // Default date range based on period
      const today = new Date();
      let dateFrom = startDate;
      const dateTo = endDate ?? today;

      if (!dateFrom) {
        switch (period) {
          case 'day':
            dateFrom = subDays(today, 1);
            break;
          case 'week':
            dateFrom = subDays(today, 7);
            break;
          case 'month':
            dateFrom = subDays(today, 30);
            break;
          case 'year':
            dateFrom = subDays(today, 365);
            break;
        }
      }

      // Get bookings within date range
      const bookings = await ctx.db.booking.findMany({
        where: {
          createdAt: {
            gte: dateFrom,
            lte: dateTo,
          },
          status: { in: ['confirmed', 'checked_in', 'completed'] },
          paymentStatus: 'paid',
        },
        select: {
          totalPrice: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      // Group by date
      const revenueByDate = new Map<string, { revenue: number; bookings: number }>();

      bookings.forEach((booking) => {
        const dateKey = format(booking.createdAt, 'yyyy-MM-dd');
        const existing = revenueByDate.get(dateKey) ?? { revenue: 0, bookings: 0 };
        revenueByDate.set(dateKey, {
          revenue: existing.revenue + Number(booking.totalPrice),
          bookings: existing.bookings + 1,
        });
      });

      // Convert to array
      const data = Array.from(revenueByDate.entries()).map(([date, stats]) => ({
        date,
        revenue: stats.revenue,
        bookings: stats.bookings,
      }));

      return data;
    }),

  /**
   * Get today's schedule (admin only)
   * Returns check-ins and check-outs for today
   */
  getTodaySchedule: adminProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const [checkIns, checkOuts] = await Promise.all([
      // Today's expected check-ins
      ctx.db.booking.findMany({
        where: {
          checkInDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
          status: { in: ['confirmed', 'checked_in'] },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { checkInDate: 'asc' },
      }),

      // Today's check-outs (scheduled and early check-outs)
      ctx.db.booking.findMany({
        where: {
          OR: [
            {
              checkOutDate: {
                gte: startOfToday,
                lte: endOfToday,
              },
              status: 'checked_in',
            },
            {
              checkedOutAt: {
                gte: startOfToday,
                lte: endOfToday,
              },
              status: 'checked_out',
            },
          ],
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          room: {
            include: {
              roomType: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { checkOutDate: 'asc' },
      }),
    ]);

    return {
      checkIns,
      checkOuts,
      totalCheckIns: checkIns.length,
      totalCheckOuts: checkOuts.length,
      pendingCheckIns: checkIns.filter((b) => b.status === 'confirmed').length,
      pendingCheckOuts: checkOuts.length,
    };
  }),

  /**
   * Get booking status distribution (admin only)
   * For pie chart visualization
   */
  getBookingStatusDistribution: adminProcedure.query(async ({ ctx }) => {
    const statusCounts = await ctx.db.booking.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    return statusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }),

  /**
   * Get room type occupancy (admin only)
   * Shows occupancy by room type
   */
  getRoomTypeOccupancy: adminProcedure.query(async ({ ctx }) => {
    const roomTypes = await ctx.db.roomType.findMany({
      where: { isActive: true },
      include: {
        rooms: {
          select: {
            status: true,
          },
        },
      },
    });

    return roomTypes.map((type) => {
      const totalRooms = type.rooms.length;
      const occupiedRooms = type.rooms.filter((r) => r.status === 'occupied').length;
      const availableRooms = type.rooms.filter((r) => r.status === 'available').length;

      return {
        id: type.id,
        name: type.name,
        totalRooms,
        occupiedRooms,
        availableRooms,
        occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
      };
    });
  }),
});
