# Features Breakdown

## Overview

Detailed feature list organized by user role and functionality area.

---

## Public Features (No Authentication Required)

### 1. Home Page

**Purpose:** Showcase hotel and capture bookings

**Components:**

- Hero section with background image/video
- Quick booking widget (dates, guests, search)
- Featured room types carousel
- Hotel amenities grid (6-8 key amenities with icons)
- Guest testimonials slider
- Call-to-action sections
- Footer with contact info

**Technical:**

- Server component for SEO
- Dynamic data from database
- Optimized images with `next/image`
- Mobile-responsive design

---

### 2. Rooms Listing Page

**Purpose:** Display all available room types

**Features:**

- Grid/list view toggle
- Filter by:
    - Price range (slider)
    - Capacity (dropdown)
    - Amenities (checkboxes)
- Sort by:
    - Price (low to high, high to low)
    - Capacity
    - Name
- Room cards showing:
    - Main image
    - Room type name
    - Short description
    - Price per night
    - Capacity
    - Key amenities (icons)
    - "View Details" button

**Technical:**

- URL-based filters (shareable links)
- Client component for interactivity
- Skeleton loaders for better UX

---

### 3. Room Details Page

**Purpose:** Showcase individual room type

**Features:**

- Image gallery (lightbox)
- Full description
- Amenities list with icons
- Room specifications (size, capacity, bed type)
- Pricing information
- Availability calendar
- "Book Now" button
- Related rooms section

**Technical:**

- Dynamic route: `/rooms/[slug]`
- Server component with client islands
- Optimized image gallery
- Calendar component

---

### 4. About Page

**Purpose:** Tell hotel story

**Features:**

- Hotel history
- Mission & values
- Team section (optional)
- Awards & certifications
- Location map

---

### 5. Contact Page

**Purpose:** Enable guest communication

**Features:**

- Contact form (name, email, message)
- Hotel address & directions
- Phone & email display
- Social media links
- Google Maps embed

**Technical:**

- Form validation with Zod
- Email sending via Resend

---

## User Features (Normal User Role)

### 6. Authentication

**Sign Up:**

- Email & password registration
- Name & phone number
- Email verification (optional for MVP)
- Auto-login after signup

**Sign In:**

- Email & password login
- "Remember me" option
- Password reset (email link)

**Technical:**

- NextAuth.js implementation
- Bcrypt password hashing
- JWT session management

---

### 7. Booking Flow (3 Steps)

**Step 1: Select Room & Dates**

- Room type selection
- Check-in/check-out date picker
- Number of guests
- See total price calculation
- Availability validation

**Step 2: Guest Information**

- Pre-filled from profile
- Editable contact info
- Special requests textarea
- Terms & conditions checkbox

**Step 3: Payment Selection**

- Two options:
    - **Pay Online:** QR code modal
    - **Pay at Counter:** Confirmation message
- Payment instructions
- Final confirmation button

**After Booking:**

- Confirmation page with booking number
- Email sent to user & admin
- Redirect to user dashboard

**Technical:**

- Multi-step form with state management
- Form validation at each step
- Progress indicator
- Back/Next navigation
- tRPC `booking.create` mutation with full type safety

---

### 8. User Dashboard

**Purpose:** Manage personal bookings

**Navigation:**

- My Bookings
- Profile Settings
- Sign Out

**My Bookings:**

- Tabs: All / Upcoming / Past / Cancelled
- Booking cards showing:
    - Booking number
    - Room type & number
    - Check-in/out dates
    - Status badge (color-coded)
    - Total price
    - Payment status
    - "View Details" button
- Empty state for no bookings

**Booking Details Modal:**

- Full booking information
- Guest details
- Room details
- Payment info
- Special requests
- Cancel button (if allowed)
- Download receipt (bonus)

**Profile Settings:**

- Update name, phone, email
- Change password
- Profile picture upload (optional)
- Delete account option

**Technical:**

- Protected route (middleware)
- Client component for interactivity
- Real-time status updates with React Query
- tRPC queries and mutations for full type safety

---

## Admin Features (Admin Role)

### 9. Admin Dashboard Overview

**Purpose:** At-a-glance hotel status

**Metrics Cards:**

- Today's Check-ins (count + list)
- Today's Check-outs (count + list)
- Pending Bookings (count)
- Current Occupancy Rate (percentage)
- Total Revenue (this month)
- Available Rooms (count)

**Charts:**

- Revenue chart (last 30 days)
- Occupancy rate trend
- Bookings by status (pie chart)

**Recent Activity:**

- Latest 10 bookings
- Quick actions (view, confirm, check-in)

**Quick Access:**

- Create walk-in booking
- Check-in guest
- View all bookings

**Technical:**

- Server component with real-time data
- Recharts for visualizations
- Auto-refresh every 30 seconds via React Query
- tRPC `admin.getDashboardStats` query with polling

---

### 10. Bookings Management

**Purpose:** Manage all reservations

**Features:**

- Data table with columns:
    - Booking number
    - Guest name & contact
    - Room number
    - Check-in/out dates
    - Status
    - Payment status
    - Total price
    - Actions

**Filters:**

- Status (pending, confirmed, checked_in, completed, cancelled)
- Payment status (pending, paid, refunded)
- Date range picker
- Search by booking number or guest name

**Actions per booking:**

- View details
- Confirm payment
- Check-in guest
- Check-out guest
- Cancel booking
- Send email reminder

**Bulk Actions:**

- Select multiple bookings
- Bulk status update
- Export to CSV

**Technical:**

- shadcn Table component
- Server-side pagination via tRPC
- Real-time updates with React Query
- Optimistic UI updates using tRPC context
- Full type safety from server to client

---

### 11. POS System (Walk-in Bookings)

**Purpose:** Quick booking for walk-in guests

**Features:**

- Quick booking form:
    - Guest info input
    - Room selection dropdown (only available rooms)
    - Check-in/out date picker
    - Number of guests
    - Auto-calculate total price

- Payment process:
    - Click "Collect Payment"
    - Modal shows QR code
    - "Payment Received" button
    - Booking auto-confirms

**After Payment:**

- Booking created with `confirmed` status
- Print receipt option
- Check-in guest immediately option

**Technical:**

- Client component
- Real-time room availability check via tRPC query
- tRPC mutations for booking creation
- Receipt generation (bonus)

---

### 12. Check-in/Check-out Interface

**Purpose:** Process guest arrivals and departures

**Check-in:**

- Search booking by:
    - Booking number
    - Guest name
    - Room number
- Display booking details
- Verify ID (manual process)
- "Check In" button
- Update room status to `occupied`
- Print room key card (bonus)

**Check-out:**

- Search checked-in guests
- Display billing summary
- Verify room condition (manual)
- "Check Out" button
- Update room status to `available`
- Send thank you email

**Today's Schedule:**

- Expected check-ins list
- Expected check-outs list
- Late check-out requests
- No-show alerts

**Technical:**

- Auto-complete search
- Status transition validation
- Booking log creation

---

### 13. Room Type Management

**Purpose:** Manage room categories

**Features:**

- Data table of room types
- Actions:
    - Create new room type
    - Edit existing
    - Delete (if no rooms)
    - Toggle active/inactive

**Create/Edit Form:**

- Name & slug
- Description (rich text editor)
- Short description
- Base price
- Capacity
- Room size
- Image upload (multiple)
- Amenities selection (multi-select)
- Active status toggle

**Image Upload:**

- Drag & drop interface
- Multiple images
- Preview thumbnails
- Reorder images
- Delete images

**Technical:**

- Form validation with Zod (shared with tRPC)
- Image upload to Vercel Blob/Cloudinary
- Rich text editor (Tiptap or similar)
- tRPC mutations with automatic type inference

---

### 14. Room Inventory Management

**Purpose:** Manage individual rooms

**Features:**

- Data table grouped by room type
- Columns:
    - Room number
    - Room type
    - Floor
    - Status (available, occupied, maintenance, out_of_service)
    - Actions

**Actions:**

- Add new room
- Edit room
- Change status
- Delete room (if no bookings)
- View booking history

**Create/Edit Form:**

- Room number (unique)
- Room type dropdown
- Floor number
- Status dropdown
- Internal notes

**Bulk Operations:**

- Add multiple rooms at once
- Bulk status update (e.g., mark floor for maintenance)

**Technical:**

- Grouped table view
- Status color coding
- Quick status toggle

---

### 15. User Management

**Purpose:** Manage user accounts

**Features:**

- Data table of users
- Columns:
    - Name
    - Email
    - Role
    - Phone
    - Bookings count
    - Created date
    - Actions

**Filters:**

- Role (user, admin)
- Search by name or email

**Actions:**

- View user details
- View user's bookings
- Promote to admin
- Reset password
- Delete account

**User Details:**

- Full profile info
- Booking history
- Total revenue generated
- Last login

**Technical:**

- Role-based access control
- Soft delete option
- Activity logging

---

## Email Notifications

### 16. Automated Emails

**Booking Confirmation (to User):**

```
Subject: Booking Confirmation - [Hotel Name]

Dear [Guest Name],

Thank you for booking with us!

Booking Details:
- Booking Number: BK20250110001
- Room Type: Deluxe Room
- Check-in: January 15, 2025
- Check-out: January 17, 2025
- Guests: 2
- Total: $160.00
- Payment Status: Pending

[Payment Instructions if applicable]

Check-in time: 2:00 PM
Check-out time: 11:00 AM

Contact us: phone | email

See you soon!
```

**New Booking Alert (to Admin):**

```
Subject: New Booking Received - BK20250110001

A new booking has been received:

Guest: John Doe
Email: john@example.com
Phone: +855-12-345-678

Room: Deluxe Room (201)
Check-in: January 15, 2025
Check-out: January 17, 2025
Guests: 2
Total: $160.00

Payment Method: Online
Status: Pending

[View in Dashboard Button]
```

**Payment Confirmation (to User):**

```
Subject: Payment Confirmed - [Booking Number]

Dear [Guest Name],

Your payment has been confirmed!

Payment Details:
- Booking Number: BK20250110001
- Amount Paid: $160.00
- Payment Method: Bank Transfer
- Confirmed Date: January 10, 2025

Your booking is now confirmed. We look forward to welcoming you!

[View Booking Details Button]
```

**Technical:**

- React Email for templates
- Resend API for sending
- Queue system for reliability (bonus)

---

## Additional Features (Optional/Future)

### 17. Guest Reviews (Phase 2)

- Submit review after check-out
- Star rating + text review
- Display on room detail pages
- Admin moderation

### 18. Promotions & Discounts (Phase 2)

- Create discount codes
- Apply to bookings
- Expiry dates
- Usage limits

### 19. Reports & Analytics (Phase 2)

- Revenue reports
- Occupancy reports
- Guest demographics
- Export to PDF/Excel

### 20. Housekeeping Module (Phase 2)

- Room cleaning status
- Maintenance requests
- Task assignment
- Inventory management

---

## Security Features

### 21. Security Measures

**Authentication:**

- Secure password hashing (bcrypt)
- JWT session tokens
- CSRF protection
- Rate limiting

**Authorization:**

- Role-based access control
- Route protection middleware
- API endpoint guards

**Data Protection:**

- Input validation (Zod)
- SQL injection prevention (Prisma)
- XSS protection
- HTTPS enforcement

**Audit Trail:**

- Booking logs
- Admin action logs
- Failed login attempts
- Suspicious activity alerts

---

## Mobile Responsiveness

All pages optimized for:

- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

**Mobile-specific features:**

- Touch-friendly buttons
- Swipe gestures for carousels
- Bottom navigation (dashboard)
- Collapsible filters
- Sticky headers

---

## Performance Optimizations

- Image optimization (`next/image`)
- Code splitting
- Lazy loading
- Server components by default
- CDN for static assets
- Database query optimization
- Caching strategy

---

## Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance (WCAG AA)
- Focus indicators
- Alt text for images

---

## Summary

**Total Features:** 20+ core features
**User Features:** 4 main features
**Admin Features:** 7 main modules
**Public Features:** 5 pages

**Development Priority:**

1. Authentication & User Management
2. Room & Room Type Management
3. Booking System (Public)
4. Admin Dashboard
5. POS System
6. Check-in/Check-out
7. Email Notifications
8. Analytics & Reports (optional)
