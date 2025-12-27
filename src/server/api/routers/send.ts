import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { env } from '~/env';
import { resend } from '~/server/resend';
import { ContactEmail } from '~/server/email/templates/contact';
import { contactFormSchema } from '~/lib/schemas';

export const sendRouter = createTRPCRouter({
  sendContactEmail: publicProcedure.input(contactFormSchema).mutation(async ({ input }) => {
    const { data, error } = await resend.emails.send({
      from: env.NODE_ENV === 'production' ? 'onboarding@resend.dev' : 'onboarding@resend.dev',
      to: env.NODE_ENV === 'production' ? ['hacurly13@gmail.com'] : [env.RESEND_DEV_EMAIL],
      subject: `New Message: ${input.topic} from ${input.name}`,
      react: ContactEmail(input),
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
