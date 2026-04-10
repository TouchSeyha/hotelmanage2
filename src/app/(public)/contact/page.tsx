'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { PhoneInput } from '~/components/ui/phoneInput';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { contactFormSchema, type ContactFormValues } from '~/lib/schemas';
import { Reveal } from '~/components/motion/reveal';

const channels = [
  {
    icon: MessageCircle,
    title: 'Concierge chat',
    detail: 'Reply in under 5 minutes via in-app messaging or Telegram @LuxeStayPP.',
    accent: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Phone,
    title: 'Voice assistant',
    detail: '+855 (0)89 555 120 · Dedicated riverfront stylist line.',
    accent: 'from-sky-500/20 to-indigo-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: Mail,
    title: 'Private inbox',
    detail: 'concierge.phnompenh@luxestay.com · 24/7 coverage.',
    accent: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

const propertyDetails = [
  {
    label: 'Address',
    value: '325 Sisowath Quay, Daun Penh, Phnom Penh',
    helper: 'Lobby open daily 07:00 – 23:00 · Access code after hours',
    icon: MapPin,
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
    <div>
      <section className="border-border/50 from-primary/20 relative isolate overflow-hidden border-b bg-linear-to-b via-transparent to-transparent">
        <div className="bg-primary/5 pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-foreground/5 pointer-events-none absolute bottom-0 -left-16 h-60 w-60 rounded-full blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal variant="hero">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Write to us.
                  <br />
                  <span className="text-foreground/40">We write back.</span>
                </h1>
                <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed">
                  Every message is read by a human concierge. Transfers, suites, rituals & confirmed
                  manually, never automated.
                </p>
              </div>

              <div className="flex gap-12 text-center lg:text-right">
                <div>
                  <p className="text-primary text-3xl font-light tabular-nums">3m</p>
                  <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">
                    Avg. reply
                  </p>
                </div>
                <div className="bg-border h-12 w-px" />
                <div>
                  <p className="text-3xl font-light tabular-nums">24/7</p>
                  <p className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">
                    Coverage
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal delay={0} className="lg:col-span-7">
            <div className="border-border/60 bg-card relative rounded-2xl border p-8 shadow-sm sm:p-10">
              <div className="via-primary/30 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />

              <div className="flex items-center gap-3">
                <div className="border-primary/20 bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border">
                  <Send className="text-primary h-4 w-4 -rotate-12" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Send a note</h2>
                  <p className="text-muted-foreground text-sm">
                    Suite pairings, hydro circuits, stays — we reply within minutes.
                  </p>
                </div>
              </div>

              {success && (
                <div className="mt-6 overflow-hidden rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-emerald-900 dark:text-emerald-100">
                        Message received
                      </p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Your concierge will respond shortly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-xs tracking-wider uppercase">
                            Full name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Taylor Morgan"
                              className="bg-background/50 hover:bg-background/80 focus:bg-background h-11 transition-colors"
                              {...field}
                            />
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
                          <FormLabel className="font-mono text-xs tracking-wider uppercase">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@studio.com"
                              className="bg-background/50 hover:bg-background/80 focus:bg-background h-11 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-xs tracking-wider uppercase">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value ?? ''}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
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
                          <FormLabel className="font-mono text-xs tracking-wider uppercase">
                            Topic
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 hover:bg-background/80 focus:bg-background h-11 transition-colors">
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
                        <FormLabel className="font-mono text-xs tracking-wider uppercase">
                          Your message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Dates, suite preferences, rituals — share as much as you like."
                            className="bg-background/50 hover:bg-background/80 focus:bg-background resize-none transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={sendContactEmail.isPending}
                    className="group bg-primary text-primary-foreground hover:shadow-primary/25 relative h-12 w-full overflow-hidden rounded-xl font-medium tracking-wide transition-all hover:shadow-lg"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-500 group-hover:translate-x-full" />
                    <span className="relative flex items-center justify-center gap-2">
                      {sendContactEmail.isPending ? 'Sending...' : 'Send message'}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Button>
                </form>
              </Form>
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal delay={1} className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="bg-border h-px flex-1" />
                <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
                  Direct channels
                </span>
                <div className="bg-border h-px flex-1" />
              </div>

              <div className="motion-stagger space-y-3">
                {channels.map((channel) => (
                  <div
                    key={channel.title}
                    className="motion-card-hover group border-border/60 bg-card relative overflow-hidden rounded-xl border p-5"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${channel.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <div className="relative flex items-start gap-4">
                      <div
                        className={`border-border/60 bg-background/80 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${channel.iconColor}`}
                      >
                        <channel.icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold tracking-tight">{channel.title}</p>
                        <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                          {channel.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="bg-border h-px flex-1" />
                <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
                  Riverside
                </span>
                <div className="bg-border h-px flex-1" />
              </div>

              <div className="motion-stagger space-y-3">
                {propertyDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="motion-card-hover group border-border/60 bg-card rounded-xl border p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="border-primary/15 bg-primary/5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
                        <detail.icon className="text-primary h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground/70 font-mono text-[10px] tracking-[0.2em] uppercase">
                          {detail.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold">{detail.value}</p>
                        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                          {detail.helper}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-border/60 from-primary/6 overflow-hidden rounded-xl border bg-linear-to-br to-transparent p-6">
                <p className="text-sm font-medium">
                  Walk in anytime — <span className="text-primary">we keep the lobby warm.</span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  After-hours access code provided at check-in.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
