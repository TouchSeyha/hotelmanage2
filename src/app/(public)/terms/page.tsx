import {
  Scale,
  FileSignature,
  CreditCard,
  CalendarCheck,
  ShieldCheck,
  AlertTriangle,
  Gavel,
  Ban,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Reveal } from '~/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Terms of Service | LuxeStay',
  description:
    'Read the Terms of Service for LuxeStay. Understand your rights and responsibilities when using our hotel booking platform.',
};

const sections = [
  {
    icon: FileSignature,
    title: 'Acceptance of Terms',
    id: 'acceptance-of-terms',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing or using the LuxeStay website, mobile application, or booking services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of our services immediately.',
      },
      {
        subtitle: 'Modifications',
        text: 'LuxeStay reserves the right to modify these Terms at any time. Changes become effective upon posting to our website. Continued use of our services after modifications constitutes acceptance of the revised Terms. We will make reasonable efforts to notify you of material changes.',
      },
      {
        subtitle: 'Conflict with Other Terms',
        text: 'In the event of a conflict between these Terms and any specific terms agreed to for a particular booking or promotion, the specific terms shall prevail to the extent of the inconsistency.',
      },
    ],
  },
  {
    icon: CalendarCheck,
    title: 'Booking & Reservations',
    id: 'booking-and-reservations',
    content: [
      {
        subtitle: 'Making a Reservation',
        text: 'When you submit a booking request, it constitutes an offer to reserve a room. A binding reservation is formed only upon our confirmation, which we will send to the email address you provide. All reservations are subject to availability and may be declined.',
      },
      {
        subtitle: 'Check-In & Check-Out',
        text: 'Standard check-in time is 2:00 PM and check-out time is 12:00 PM (noon). Early check-in or late check-out is subject to availability and may incur additional charges. Guests must present a valid government-issued photo ID at check-in that matches the reservation name.',
      },
      {
        subtitle: 'Guest Responsibility',
        text: 'The person who makes the reservation is responsible for all charges incurred during the stay, including room charges, damages, and incidentals. Guests must be at least 18 years of age to reserve a room.',
      },
    ],
  },
  {
    icon: CreditCard,
    title: 'Pricing, Payments & Fees',
    id: 'pricing-payments-and-fees',
    content: [
      {
        subtitle: 'Room Rates',
        text: 'All room rates are displayed in the currency selected during booking and include applicable taxes unless otherwise stated. Rates may vary based on season, availability, and promotional offers. We reserve the right to correct pricing errors and will notify you within 24 hours if a correction affects your booking.',
      },
      {
        subtitle: 'Payment Methods',
        text: 'We accept major credit and debit cards. Payment is processed at the time of booking confirmation unless a deposit or guarantee arrangement is specified. A valid payment method must be on file for the duration of your stay to cover any incidental charges.',
      },
      {
        subtitle: 'Additional Charges',
        text: 'Incidental charges such as room service, spa treatments, minibar usage, laundry, and damage will be billed to your account. A detailed folio will be provided upon request. Local taxes and resort fees, if applicable, are added to the room rate as disclosed during booking.',
      },
    ],
  },
  {
    icon: Ban,
    title: 'Cancellation & Refund Policy',
    id: 'cancellation-and-refund-policy',
    content: [
      {
        subtitle: 'Cancellation Window',
        text: 'Free cancellation is available up to 48 hours before the scheduled check-in date. Cancellations made within 48 hours of check-in are subject to a charge equivalent to one night\u2019s room rate. No-shows will be charged the full reservation amount.',
      },
      {
        subtitle: 'Refund Processing',
        text: 'Approved refunds will be processed within 7\u201314 business days to the original payment method. Bank processing times may vary. Non-refundable rate bookings and promotional packages are subject to their specific terms and may not be eligible for cancellation or refund.',
      },
      {
        subtitle: 'Early Departure',
        text: 'If you check out earlier than your reserved departure date, the remainder of your reservation may still be charged depending on the rate plan booked. Please review your booking confirmation for early departure policies specific to your reservation.',
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Guest Conduct & Liability',
    id: 'guest-conduct-and-liability',
    content: [
      {
        subtitle: 'Code of Conduct',
        text: 'Guests are expected to conduct themselves in a respectful manner. We reserve the right to refuse service or remove any guest whose behavior is disruptive, illegal, or poses a safety risk to other guests, staff, or property, without refund.',
      },
      {
        subtitle: 'Property Damage',
        text: 'Guests are financially responsible for any damage caused to the room, hotel property, or furnishings during their stay, whether intentional or accidental. An inspection will be conducted upon check-out, and damage charges will be applied to the payment method on file.',
      },
      {
        subtitle: 'Personal Belongings',
        text: 'LuxeStay is not liable for lost, stolen, or damaged personal belongings. We recommend using in-room safes for valuables. A lost-and-found service is maintained, and items not claimed within 30 days will be donated or disposed of.',
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    id: 'limitation-of-liability',
    content: [
      {
        subtitle: 'Service Limitations',
        text: 'LuxeStay strives to provide excellent service but does not guarantee uninterrupted or error-free operation of our website or services. We are not liable for any indirect, incidental, consequential, or punitive damages arising from your use of our services.',
      },
      {
        subtitle: 'Third-Party Services',
        text: 'Our website may link to or integrate third-party services such as transportation, tours, or dining reservations. We are not responsible for the quality, safety, or availability of these third-party services and recommend reviewing their terms independently.',
      },
      {
        subtitle: 'Force Majeure',
        text: 'We are not liable for failure to fulfill obligations due to circumstances beyond our control, including natural disasters, pandemics, government actions, strikes, or other force majeure events. In such cases, we will make reasonable efforts to offer alternative arrangements or credits.',
      },
    ],
  },
  {
    icon: Scale,
    title: 'Intellectual Property',
    id: 'intellectual-property',
    content: [
      {
        subtitle: 'Ownership',
        text: 'All content on this website \u2014 including text, graphics, logos, images, photographs, and software \u2014 is the property of LuxeStay or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.',
      },
      {
        subtitle: 'Use Restrictions',
        text: 'You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any content from our website without prior written consent. Use of our branding, logos, or trademarks for commercial purposes is strictly prohibited.',
      },
    ],
  },
  {
    icon: Gavel,
    title: 'Dispute Resolution & Governing Law',
    id: 'dispute-resolution',
    content: [
      {
        subtitle: 'Governing Law',
        text: 'These Terms shall be governed by and construed in accordance with the laws of the Kingdom of Cambodia, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our services shall be resolved in the courts of Phnom Penh, Cambodia.',
      },
      {
        subtitle: 'Informal Resolution',
        text: 'Before initiating any formal proceeding, you agree to attempt to resolve disputes informally by contacting us at the address below. We will attempt to resolve the dispute within 60 days. If the dispute is not resolved, either party may proceed with formal legal action.',
      },
      {
        subtitle: 'Severability',
        text: 'If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect. The unenforceable provision will be modified to the minimum extent necessary to make it enforceable.',
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <Reveal
          variant="hero"
          className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs tracking-[0.3em] text-white/80 uppercase">
            <Scale className="h-4 w-4" />
            Terms of Service
          </div>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-lg text-white/60">
            Please review these terms carefully before using our services. They define the agreement
            between you and LuxeStay.
          </p>
          <p className="mt-3 text-sm text-white/40">Last updated: April 10, 2026</p>
        </Reveal>
      </section>

      <Reveal delay={1} className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-primary/5 mb-12 rounded-2xl border p-6">
          <h2 className="text-primary mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
            Important Notice
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            By making a reservation or using our website and services, you confirm that you have
            read, understood, and agree to be bound by these Terms of Service. If you have any
            questions, please contact us before making a booking.
          </p>
        </div>

        <nav className="bg-muted/30 mb-12 rounded-2xl border p-6">
          <h2 className="text-muted-foreground mb-4 text-sm font-semibold tracking-[0.2em] uppercase">
            Table of Contents
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="group text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
                >
                  <section.icon className="h-4 w-4 shrink-0" />
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <section.icon className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="space-y-6">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <h3 className="mb-2 font-semibold">{item.subtitle}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="bg-muted/30 rounded-2xl border p-8">
            <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="text-muted-foreground mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-primary font-semibold">Email:</span>
                <a
                  href="mailto:legal@luxestay.com"
                  className="decoration-primary/30 hover:text-primary underline underline-offset-4 transition-colors"
                >
                  legal@luxestay.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-semibold">Phone:</span>
                <a
                  href="tel:+855234567890"
                  className="decoration-primary/30 hover:text-primary underline underline-offset-4 transition-colors"
                >
                  +855 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-semibold">Address:</span>
                325 Sisowath Quay, Phnom Penh, Cambodia
              </li>
            </ul>
            <p className="text-muted-foreground mt-6 text-sm">
              Your use of our services is also governed by our{' '}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              . Please review it to understand our data practices.
            </p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
