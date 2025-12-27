'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Sparkles } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'booking',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      topic: 'booking',
      message: '',
    });
    setTimeout(() => setSuccess(false), 3500);
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
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-2xl font-semibold">Send us a note</h2>
            <p className="text-base-content/60 text-sm">
              Stylists reply with suite pairings, hydro circuit times, or help with in-house stays.
            </p>

            {success && (
              <div className="border-success/40 bg-success/10 text-success mt-4 rounded-2xl border px-4 py-3 text-sm">
                Thank you—your concierge will respond shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-control">
                  <span className="label-text text-sm font-semibold">Full name *</span>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="Taylor Morgan"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text text-sm font-semibold">Email *</span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="you@studio.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-control">
                  <span className="label-text text-sm font-semibold">Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="+855 (0)89 555 120"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text text-sm font-semibold">Topic *</span>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="select select-bordered"
                  >
                    <option value="booking">New booking</option>
                    <option value="itinerary">Itinerary design</option>
                    <option value="event">Private dinner or event</option>
                  </select>
                </label>
              </div>

              <label className="form-control">
                <span className="label-text text-sm font-semibold">Tell us everything *</span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="textarea textarea-bordered"
                  placeholder="Dates, suite preferences, rituals—share as much as you like."
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-block text-white"
              >
                {isSubmitting ? 'Sending...' : 'Send to stylist'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="card border-base-200 bg-base-100 rounded-3xl border p-6">
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
            </div>

            <div className="card border-base-200 bg-base-100 rounded-3xl border p-6">
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
            </div>

            <div className="card border-base-200 bg-base-100 rounded-3xl border p-6">
              <div className="flex items-center gap-3">
                <Clock className="text-primary h-5 w-5" />
                <div>
                  <p className="font-semibold">Always-on concierge</p>
                  <p className="text-base-content/60 text-sm">
                    Humanity-first service, real humans 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
