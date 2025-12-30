# Hotel Management & Booking Platform - Project Overview

## Project Summary

A simplified hotel management system with customer-facing booking website and admin dashboard. Built for single hotel operations with manual payment verification system.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Database:** PostgreSQL
- **ORM:** Prisma
- **API:** tRPC v11 (End-to-end typesafe APIs)
- **State Management:** TanStack Query (React Query)
- **Auth:** NextAuth.js
- **Email:** Resend
- **Icons:** Lucide React
- **Deployment:** Vercel

## Project Goals

1. **Simplicity First:** Achievable for one developer in 2 weeks
2. **Manual Payment:** No complex payment gateway integration YET
3. **Essential Features:** Core hotel management without scope creep
4. **Two User Roles:** Normal users (guests) and Admin staff

## Core Functionality

### Public Website (Customer-Facing)

- Hotel showcase & information pages
- Room browsing with filters
- Online booking system (3-step flow)
- User dashboard for booking management
- Simple payment: Online (QR) or Pay at Counter

### Admin Dashboard

- Overview with key metrics
- Booking management system
- POS system for walk-in guests
- Check-in/Check-out interface
- Room & inventory management
- User management

## Payment Flow (Simplified)

### Option A: Pay Online

1. User selects "Pay Online"
2. Modal displays ABA Bank QR code
3. Message instructs to contact hotel for verification
4. Booking created with `status: pending`
5. Admin manually confirms after verification

### Option B: Pay at Counter

1. User selects "Pay at Counter"
2. Booking created with `status: pending`
3. Admin uses POS to show QR code
4. Admin clicks "Payment Received" after guest scans
5. Booking status updated to `confirmed`

## Email Notifications

Uses Resend to send:

1. **Booking Confirmation** → Guest
2. **New Booking Alert** → Admin
3. **Payment Confirmation** → Guest (after admin confirms)

## User Roles & Permissions

### Normal User (Guest)

- Browse hotel & rooms
- Create bookings
- View own bookings
- Cancel bookings (if allowed)
- Update profile

### Admin User

- Full access to dashboard
- Manage all bookings (view, confirm, cancel)
- POS system operations
- Check-in/Check-out guests
- Manage rooms & room types (CRUD)
- Manage users
- View reports & analytics

## Key Design Decisions

### What We're Building

✅ Manual payment verification (realistic for small hotel)
✅ Simple availability checking (date-based)
✅ Essential booking management
✅ Basic POS for walk-ins
✅ Email notifications only
✅ Static QR code image

### What We're NOT Building (MVP)

❌ Real payment gateway integration
❌ Complex availability algorithms
❌ Multi-language support
❌ Review/rating system
❌ Live chat support
❌ Discount codes/promotions

## Success Metrics

1. **Guest can book a room** in 3 clicks
2. **Admin can check-in guest** in under 30 seconds
3. **Email sent** within 5 seconds of booking
4. **Mobile responsive** on all pages
5. **Deployed & accessible** via Vercel URL

## Development Approach

1. **Phase-based development** (complete one phase before next)
2. **Mobile-first design** (responsive from the start)
3. **Component reusability** (build once, use everywhere)
4. **Type safety** (TypeScript strict mode)
5. **Clean code** (proper folder structure, naming conventions)
