'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft, Key } from 'lucide-react';

import { Button } from '~/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Noise Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient Mesh - Primary */}
        <div
          className="bg-primary/8 absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full blur-[100px]"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />

        {/* Gradient Mesh - Secondary */}
        <div
          className="bg-muted-foreground/5 absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full blur-[80px]"
          style={{ animation: 'float 10s ease-in-out infinite 2s' }}
        />

        {/* Accent Orb */}
        <div
          className="bg-primary/5 absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
          style={{ animation: 'pulse 6s ease-in-out infinite' }}
        />

        {/* Geometric Decorative Lines */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line
            x1="10%"
            y1="0"
            x2="10%"
            y2="100%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            className="opacity-50"
          />
          <line
            x1="90%"
            y1="0"
            x2="90%"
            y2="100%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            className="opacity-50"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center">
        {/* 404 Number */}
        <div
          className="relative mb-8"
          style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards', opacity: 0 }}
        >
          {/* Decorative brackets */}
          <span
            className="text-muted-foreground/20 absolute top-1/2 -left-8 -translate-y-1/2 font-(family-name:--font-playfair) text-6xl sm:-left-12 sm:text-8xl"
            style={{ animation: 'fadeInLeft 0.6s ease-out 0.8s forwards', opacity: 0 }}
          >
            &#x275D;
          </span>
          <span
            className="text-muted-foreground/20 absolute top-1/2 -right-8 -translate-y-1/2 font-(family-name:--font-playfair) text-6xl sm:-right-12 sm:text-8xl"
            style={{ animation: 'fadeInRight 0.6s ease-out 0.8s forwards', opacity: 0 }}
          >
            &#x275E;
          </span>

          <h1 className="text-foreground relative font-(family-name:--font-playfair) text-[10rem] leading-none font-bold tracking-tighter sm:text-[13rem] md:text-[16rem]">
            <span
              className="inline-block"
              style={{ animation: 'fadeInLeft 0.7s ease-out 0.2s forwards', opacity: 0 }}
            >
              4
            </span>
            <span
              className="from-primary via-primary to-primary/60 inline-block bg-linear-to-br bg-clip-text text-transparent"
              style={{ animation: 'fadeInScale 0.7s ease-out 0.35s forwards', opacity: 0 }}
            >
              0
            </span>
            <span
              className="inline-block"
              style={{ animation: 'fadeInRight 0.7s ease-out 0.5s forwards', opacity: 0 }}
            >
              4
            </span>
          </h1>

          {/* Subtle underline accent */}
          <div
            className="via-primary/40 mx-auto mt-2 h-[2px] w-32 bg-linear-to-r from-transparent to-transparent"
            style={{ animation: 'scaleX 1s ease-out 1s forwards', transform: 'scaleX(0)' }}
          />
        </div>

        {/* Key Icon with Ring */}
        <div
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center"
          style={{ animation: 'fadeInScale 0.6s ease-out 0.6s forwards', opacity: 0 }}
        >
          <div className="relative">
            {/* Outer ring */}
            <div
              className="border-muted-foreground/20 absolute inset-0 rounded-full border-2 border-dashed"
              style={{ animation: 'spin 20s linear infinite' }}
            />
            {/* Inner circle */}
            <div className="bg-muted/50 m-2 flex h-20 w-20 items-center justify-center rounded-full">
              <Key className="text-primary/70 h-10 w-10" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Message */}
        <div
          className="mb-3"
          style={{
            animation: 'fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards',
            opacity: 0,
          }}
        >
          <h2 className="text-foreground font-(family-name:--font-playfair) text-2xl font-semibold tracking-wide sm:text-3xl">
            Page Not Found
          </h2>
        </div>

        <p
          className="text-muted-foreground mx-auto mb-10 max-w-md text-base leading-relaxed"
          style={{
            animation: 'fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards',
            opacity: 0,
          }}
        >
          The key you&apos;re looking for doesn&apos;t open any door here. This page may have been
          moved or never existed in our hotel.
        </p>

        {/* Action Buttons */}
        <div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{
            animation: 'fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.9s forwards',
            opacity: 0,
          }}
        >
          <Button size="lg" asChild className="group relative w-full overflow-hidden sm:w-auto">
            <Link href="/">
              <span className="relative z-10 flex items-center">
                <Home className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Return Home
              </span>
              <span className="bg-primary/10 absolute inset-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild className="group w-full sm:w-auto">
            <Link href="/rooms">
              <Search className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Browse Rooms
            </Link>
          </Button>
        </div>

        {/* Back Link */}
        <div
          style={{ animation: 'fadeIn 0.6s ease-out 1.1s forwards', opacity: 0 }}
          className="mt-10"
        >
          <button
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:text-primary inline-flex items-center text-sm transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Go Back
          </button>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div
        className="via-primary/40 absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent to-transparent"
        style={{ animation: 'scaleX 1.2s ease-out 1.3s forwards', transform: 'scaleX(0)' }}
      />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleX {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-20px, 20px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
