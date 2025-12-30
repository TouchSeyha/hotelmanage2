import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  topic: z.enum(["booking", "itinerary", "event"]),
  message: z.string().min(1, "Message is required"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
