import { postRouter } from '~/server/api/routers/post';
import { sendRouter } from '~/server/api/routers/send';
import { roomTypeRouter } from '~/server/api/routers/roomType';
import { roomRouter } from '~/server/api/routers/room';
import { bookingRouter } from '~/server/api/routers/booking';
import { userRouter } from '~/server/api/routers/user';
import { adminRouter } from '~/server/api/routers/admin';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // Legacy/example router
  post: postRouter,

  // Contact form email
  send: sendRouter,

  // Hotel domain routers
  roomType: roomTypeRouter,
  room: roomRouter,
  booking: bookingRouter,
  user: userRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
