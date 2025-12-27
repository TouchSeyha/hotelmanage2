import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { resend } from '~/server/resend';
import { EmailTemplate } from '~/server/email/templates/welcome';

export const sendRouter = createTRPCRouter({
  sendEmail: publicProcedure
    .input(
      z.object({
        to: z.array(z.string().email()),
        subject: z.string(),
        firstName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: input.to,
        subject: input.subject,
        react: EmailTemplate({ firstName: input.firstName }),
      });

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error?.message ?? 'Failed to send email',
        });
      }

      return data;
    }),
});
