'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Card } from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { contactFormSchema, type ContactFormValues } from '~/lib/schemas';

const channels = [
  {
    icon: MessageCircle,
    title: 'Concierge chat',
    detail: 'Reply in under 5 minutes via in-app messaging or Telegram @LuxeStayPP.',
  },
  {
    icon: Phone,
    title: 'Voice assistant',
    detail: '+855 (0)89 555 120 • Dedicated riverfront stylist line.',
  },
  {
    icon: Mail,
    title: 'Private inbox',
    detail: 'concierge.phnompenh@luxestay.com • 24/7 coverage.',
  },
];

const propertyDetails = [
  {
    label: 'Address',
    value: '325 Sisowath Quay, Daun Penh, Phnom Penh',
    helper: 'Lobby open daily 07:00 – 23:00 · Access code after hours',
    icon: MapPin,
  },
  {
    label: 'Payments',
    value: 'QR transfer or pay-at-counter only',
    helper: 'Concierge verifies every transaction manually for your comfort.',
  },
  {
    label: 'Response time',
    value: 'Average 3 minutes',
    helper: 'Always-on stylists coordinate airport transfers, dining, and rituals.',
  },
];

export default function ContactPage() {
  const [success, setSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      topic: 'booking',
      message: '',
    },
  });

  const sendContactEmail = api.send.sendContactEmail.useMutation({
    onSuccess: () => {
      form.reset();
      setSuccess(true);
    },
  });

  const onSubmit = (values: ContactFormValues) => {
    sendContactEmail.mutate(values);
  };

  return (
    <div className="space-y-16">
      <section className="border-base-200 from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden border-b bg-linear-to-br py-16">
        <div className="hero-orbit" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="border-primary/30 bg-base-100/70 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs tracking-[0.3em] uppercase">
            <Sparkles className="h-4 w-4" />
            Concierge desk
          </div>
          <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
            Your Phnom Penh host is always one message away.
          </h1>
          <p className="text-base-content/70 mt-4">
            We confirm transfers, suites, and rituals manually so you never worry about payments or
            timing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold">Send us a note</h2>
            <p className="text-base-content/60 text-sm">
              Stylists reply with suite pairings, hydro circuit times, or help with in-house stays.
            </p>

            {success && (
              <div className="border-success/40 bg-success/10 text-success mt-4 rounded-2xl border px-4 py-3 text-sm">
                Thank you—your concierge will respond shortly.
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Taylor Morgan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@studio.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+855 (0)89 555 120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="booking">New booking</SelectItem>
                            <SelectItem value="itinerary">Itinerary design</SelectItem>
                            <SelectItem value="event">Private dinner or event</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell us everything *</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Dates, suite preferences, rituals—share as much as you like."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={sendContactEmail.isPending} className="w-full">
                  {sendContactEmail.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-base-content/60 text-xs tracking-[0.4em] uppercase">Channels</p>
              <div className="mt-6 space-y-5">
                {channels.map((channel) => (
                  <div key={channel.title} className="flex gap-3">
                    <channel.icon className="text-primary mt-1 h-5 w-5" />
                    <div>
                      <p className="font-semibold">{channel.title}</p>
                      <p className="text-base-content/70 text-sm">{channel.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-base-content/60 text-xs tracking-[0.4em] uppercase">
                Riverside address
              </p>
              <div className="mt-4 space-y-4">
                {propertyDetails.map((detail) => (
                  <div key={detail.label} className="border-base-200/70 rounded-2xl border p-4">
                    {detail.icon && <detail.icon className="text-primary h-4 w-4" />}
                    <p className="text-base-content/50 text-xs tracking-[0.3em] uppercase">
                      {detail.label}
                    </p>
                    <p className="mt-2 text-base font-semibold">{detail.value}</p>
                    <p className="text-base-content/60 text-sm">{detail.helper}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
