# LuxeStay Hotel Management Platform

## User Guidebook

---

## Table of Contents

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [Getting Started](#getting-started)
4. [For Hotel Guests (Users)](#for-hotel-guests-users)
5. [For Hotel Staff (Admins)](#for-hotel-staff-admins)
6. [Booking Workflows](#booking-workflows)
7. [Key Features Reference](#key-features-reference)
8. [Technical Information](#technical-information)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

**LuxeStay** is a comprehensive hotel management and booking platform designed for single hotel operations. It combines a customer-facing booking website with a powerful admin dashboard, enabling hotels to manage reservations, process payments, track occupancy, and deliver excellent guest experiences—all from one unified system.

### Who This Guide Is For

- **Hotel Guests** – Learn how to browse rooms, make bookings, and manage your reservations
- **Hotel Staff/Administrators** – Understand how to manage bookings, process check-ins/check-outs, and operate the POS system
- **Developers/Technical Users** – Get an overview of the system architecture and technical stack

---

## System Overview

### Platform Architecture

The platform consists of three main interfaces:

| Interface           | Purpose                           | Access Level          |
| ------------------- | --------------------------------- | --------------------- |
| **Public Website**  | Hotel showcase and online booking | Open to all visitors  |
| **User Dashboard**  | Personal booking management       | Registered users only |
| **Admin Dashboard** | Hotel operations and management   | Admin staff only      |

### User Roles

1. **Guest (Public Visitor)**
   - Browse rooms and hotel information
   - View room details and amenities
   - Submit contact inquiries

2. **Registered User (Hotel Guest)**
   - All guest capabilities
   - Create and manage bookings
   - View booking history
   - Update profile information
   - Submit reviews after stays

3. **Administrator (Hotel Staff)**
   - Full access to admin dashboard
   - Manage all bookings and reservations
   - Process check-ins and check-outs
   - Operate POS system for walk-in guests
   - Manage room inventory and types
   - View reports and analytics

---

## Getting Started

### For Guests: Creating an Account

1. Visit the hotel website homepage
2. Click **"Sign In"** in the navigation
3. Choose your preferred sign-in method:
   - **Discord** – Quick OAuth login
   - **Google** – Alternative OAuth login
4. Upon first login, your account is automatically created
5. Complete your profile with contact information

### For Admins: Accessing the Dashboard

1. Sign in using admin credentials
2. Navigate to `/admin` or click the admin link
3. The dashboard displays key metrics and quick actions

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- No software installation required

---

## For Hotel Guests (Users)

### 1. Browsing Rooms

**Access:** Homepage → "Rooms" link

**Features:**

- View all available room types in a grid layout
- Filter rooms by:
  - **Price Range** – Set minimum and maximum prices
  - **Capacity** – Number of guests (1-4+)
  - **Amenities** – WiFi, Air Conditioning, Mini Bar, etc.
- Sort results by price, capacity, or name
- Click any room card to view detailed information

### 2. Room Details Page

**Information Displayed:**

- High-quality image gallery with lightbox view
- Full room description and specifications
- Complete amenities list with icons
- Room size and maximum capacity
- Pricing per night
- Availability calendar

**Actions Available:**

- Browse room images
- View related rooms
- Click **"Book Now"** to start reservation

### 3. Making a Booking (3-Step Process)

#### Step 1: Select Room & Dates

- Choose room type from dropdown
- Select check-in and check-out dates using calendar picker
- Specify number of guests
- View total price calculation (nights × nightly rate)
- System validates room availability automatically
- Click **"Next"** to proceed

#### Step 2: Guest Information

- Name and contact information (pre-filled from profile)
- Phone number for hotel contact
- Special requests textarea (dietary needs, accessibility, etc.)
- Agree to terms and conditions
- Click **"Next"** to continue

#### Step 3: Payment Selection

**Option A: Pay Online**

- Select "Pay Online" option
- Modal displays ABA Bank QR code
- Instructions: Scan QR code and contact hotel for payment verification
- Booking created with status "Pending"
- Admin will confirm payment after verification

**Option B: Pay at Counter**

- Select "Pay at Counter" option
- No immediate payment required
- Booking created with status "Pending"
- Pay directly at hotel reception during check-in

#### Booking Confirmation

- Confirmation page displays booking number
- Summary of booking details
- Email confirmation sent automatically
- Option to view booking in dashboard

### 4. Managing Your Bookings

**Access:** Dashboard → "My Bookings"

**Features:**

- Tab navigation: All / Upcoming / Past / Cancelled
- Each booking card displays:
  - Booking number (e.g., BK20250110001)
  - Room type and room number
  - Check-in and check-out dates
  - Status badge (color-coded)
  - Total price and payment status
- Click **"View Details"** for full information

**Booking Actions:**

- View complete booking details
- Cancel booking (if allowed by hotel policy)
- Download booking receipt (PDF)

### 5. Submitting Reviews

**When:** After completing a stay (checked out)

**Process:**

1. Navigate to dashboard → "Reviews"
2. Select completed booking
3. Rate stay (1-5 stars)
4. Write review text
5. Submit for admin approval
6. Approved reviews appear on room detail pages

### 6. Profile Management

**Access:** Dashboard → "Profile Settings"

**Editable Information:**

- Full name
- Email address
- Phone number
- Profile picture (optional)

---

## For Hotel Staff (Admins)

### 1. Dashboard Overview

**URL:** `/admin`

**Key Metrics Displayed:**

| Metric                 | Description                           |
| ---------------------- | ------------------------------------- |
| **Today's Check-ins**  | Count and list of expected arrivals   |
| **Today's Check-outs** | Count and list of expected departures |
| **Pending Bookings**   | Reservations awaiting confirmation    |
| **Occupancy Rate**     | Current percentage of occupied rooms  |
| **Monthly Revenue**    | Total revenue for current month       |
| **Available Rooms**    | Count of rooms ready for booking      |

**Charts:**

- Revenue trend (last 30 days)
- Occupancy rate trend
- Bookings by status (pie chart)

**Quick Actions:**

- Create walk-in booking
- Process check-in
- View all bookings

### 2. Booking Management

**URL:** `/admin/bookings`

**Features:**

- Data table with all bookings
- Columns: Booking #, Guest Name, Room, Dates, Status, Payment, Actions

**Filters:**

- Status: Pending, Confirmed, Checked-in, Completed, Cancelled
- Payment Status: Pending, Paid, Refunded
- Date range picker
- Search by booking number or guest name

**Actions per Booking:**

- **View Details** – Complete booking information
- **Confirm Payment** – Mark online payment as received
- **Check In** – Process guest arrival
- **Check Out** – Process guest departure
- **Cancel** – Cancel reservation with reason
- **Send Reminder** – Email guest with booking details

**Bulk Actions:**

- Select multiple bookings
- Bulk status updates
- Export to CSV

### 3. Front Desk Operations

**URL:** `/admin/frontdesk`

**Check-In Process:**

1. Search booking by:
   - Booking number
   - Guest name
   - Room number
2. Verify guest identity (manual process)
3. Review booking details
4. Click **"Check In"** button
5. Room status automatically updates to "Occupied"
6. Optional: Print room key card

**Check-Out Process:**

1. Search checked-in guests
2. Review billing summary
3. Verify room condition (manual)
4. Click **"Check Out"** button
5. Room status updates to "Available"
6. Automatic thank-you email sent to guest

**Today's Schedule:**

- Expected check-ins list with times
- Expected check-outs list
- No-show alerts
- Late check-out requests

### 4. POS System (Walk-in Bookings)

**URL:** `/admin/pos`

**Purpose:** Create bookings for guests who arrive without prior reservation

**Process:**

1. **Enter Guest Information:**
   - Name
   - Phone number
   - Email (optional)

2. **Select Room:**
   - Dropdown shows only available rooms
   - Real-time availability check
   - Select check-in/out dates
   - Specify number of guests
   - System calculates total price automatically

3. **Collect Payment:**
   - Click **"Collect Payment"**
   - Modal displays ABA Bank QR code
   - Guest scans and completes payment
   - Staff clicks **"Payment Received"**
   - Booking auto-confirmed

4. **After Payment:**
   - Print receipt option
   - Immediate check-in option
   - Booking added to system

### 5. Room Type Management

**URL:** `/admin/room-types`

**Room Types** are categories like Standard, Deluxe, Suite.

**Actions:**

- **Create New** – Add new room category
- **Edit** – Modify existing room type
- **Delete** – Remove (only if no associated rooms)
- **Toggle Active** – Enable/disable for booking

**Room Type Form Fields:**

- Name and URL slug
- Description (rich text editor)
- Short description
- Base price per night
- Maximum capacity
- Room size (sq meters)
- Image uploads (multiple, with drag-drop)
- Amenities selection (multi-select)
- Active status toggle

**Image Management:**

- Drag & drop upload
- Multiple images support
- Reorder images
- Delete individual images
- Preview thumbnails

### 6. Room Inventory Management

**URL:** `/admin/rooms`

**Purpose:** Manage individual physical rooms

**Table Columns:**

- Room number
- Room type
- Floor number
- Current status
- Actions

**Room Statuses:**
| Status | Description |
|--------|-------------|
| **Available** | Ready for booking |
| **Occupied** | Currently has guest |
| **Maintenance** | Under repair/cleaning |
| **Out of Service** | Temporarily unavailable |

**Actions:**

- Add new room
- Edit room details
- Change status
- Delete room (if no booking history)
- View booking history

**Bulk Operations:**

- Add multiple rooms at once
- Bulk status update (e.g., floor maintenance)

### 7. Amenities Management

**URL:** `/admin/amenities`

**Features:**

- List all hotel amenities
- Create new amenities with icon picker
- Edit existing amenities
- Delete amenities

**Common Amenities:**

- WiFi, TV, Air Conditioning
- Mini Bar, Room Service
- Swimming Pool, Gym
- Parking, Airport Shuttle

### 8. User Management

**URL:** `/admin/users`

**Features:**

- View all registered users
- Filter by role (user/admin)
- Search by name or email

**User Details:**

- Full profile information
- Booking history
- Total revenue generated
- Last login date

**Actions:**

- View user profile
- View user's bookings
- Promote to admin / Demote to user
- Reset password
- Delete account

### 9. Reviews Management

**URL:** `/admin/reviews`

**Purpose:** Moderate guest reviews before public display

**Workflow:**

1. Guest submits review after checkout
2. Review appears in pending queue
3. Admin reviews content
4. **Approve** – Review published on room page
5. **Reject** – Review hidden with reason noted

---

## Booking Workflows

### Online Booking Flow

```
Guest visits website
        ↓
Browses and selects room
        ↓
Completes 3-step booking form
        ↓
Chooses "Pay Online"
        ↓
Scans QR code (external payment)
        ↓
Booking created (status: pending)
        ↓
Email sent to guest & admin
        ↓
Admin verifies payment
        ↓
Admin confirms payment
        ↓
Booking status: confirmed
        ↓
Confirmation email sent
        ↓
Guest checks in on arrival date
```

### Pay at Counter Flow

```
Guest visits website
        ↓
Browses and selects room
        ↓
Completes 3-step booking form
        ↓
Chooses "Pay at Counter"
        ↓
Booking created (status: pending)
        ↓
Email sent to guest & admin
        ↓
Guest arrives at hotel
        ↓
Guest pays at reception
        ↓
Admin confirms payment
        ↓
Guest checks in
```

### Walk-in Booking Flow (POS)

```
Guest arrives at hotel without reservation
        ↓
Staff opens POS system
        ↓
Enters guest information
        ↓
Selects available room
        ↓
Guest scans QR code to pay
        ↓
Staff confirms payment received
        ↓
Booking auto-confirmed
        ↓
Guest immediately checked in
```

### Booking Status Lifecycle

```
PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT → COMPLETED
   ↓
CANCELLED (at any point before check-out)
```

| Status          | Meaning                             |
| --------------- | ----------------------------------- |
| **Pending**     | Awaiting payment confirmation       |
| **Confirmed**   | Payment verified, awaiting check-in |
| **Checked In**  | Guest has arrived and checked in    |
| **Checked Out** | Guest has departed                  |
| **Completed**   | Stay fully concluded                |
| **Cancelled**   | Booking cancelled by guest or admin |

---

## Key Features Reference

### Email Notifications

The system automatically sends emails for:

| Event             | Recipient | Content                           |
| ----------------- | --------- | --------------------------------- |
| New Booking       | Guest     | Booking confirmation with details |
| New Booking       | Admin     | Alert with guest information      |
| Payment Confirmed | Guest     | Payment receipt and confirmation  |
| Check-in Reminder | Guest     | Reminder 24 hours before arrival  |
| Contact Form      | Guest     | Auto-reply to inquiry             |

### Payment Methods

| Method          | Description           | Best For         |
| --------------- | --------------------- | ---------------- |
| **Online (QR)** | ABA Bank QR code scan | Advance bookings |
| **Counter**     | Pay at reception      | Flexible guests  |

### Room Availability Logic

A room is considered **unavailable** when:

- Status is not "Available" (maintenance, occupied, out of service)
- Existing booking overlaps with requested dates
- Existing booking is not cancelled or completed

### Data Export

Available export formats:

- **CSV** – Bookings, users, reports
- **PDF** – Individual booking receipts

---

## Technical Information

### Technology Stack

| Component          | Technology                       |
| ------------------ | -------------------------------- |
| **Framework**      | Next.js 15, React 19, TypeScript |
| **Styling**        | Tailwind CSS v4, shadcn/ui       |
| **Database**       | PostgreSQL                       |
| **ORM**            | Prisma                           |
| **API**            | tRPC v11 (end-to-end type-safe)  |
| **Authentication** | NextAuth.js v5                   |
| **Email**          | Resend + React Email             |
| **File Storage**   | Vercel Blob                      |

### Database Models

| Model          | Purpose                     |
| -------------- | --------------------------- |
| **User**       | Guest and admin accounts    |
| **RoomType**   | Room categories and pricing |
| **Room**       | Individual room inventory   |
| **Booking**    | Reservation records         |
| **BookingLog** | Audit trail for changes     |
| **Review**     | Guest reviews               |
| **Amenity**    | Hotel amenities catalog     |

### Security Features

- Secure password hashing (bcrypt)
- JWT session management
- Role-based access control
- CSRF protection
- Input validation (Zod)
- SQL injection prevention (Prisma)
- XSS protection
- HTTPS enforcement

---

## Troubleshooting

### Common Issues

#### Cannot Complete Booking

- **Issue:** "Room not available" error
- **Solution:** Refresh page and check dates don't overlap with existing booking

#### Payment Not Confirming

- **Issue:** Booking stays in "Pending" status
- **Solution:** Contact hotel staff to manually verify and confirm payment

#### Cannot Access Admin Dashboard

- **Issue:** 403 Forbidden error
- **Solution:** Ensure account has "admin" role assigned

#### Email Not Received

- **Issue:** No confirmation email in inbox
- **Solution:** Check spam/junk folder; verify email address in profile

### Getting Help

For technical support or feature requests:

- Contact the development team
- Reference your booking number for booking-related issues
- Include screenshots when reporting UI problems

---

## Quick Reference Commands

### For Developers

```bash
# Development server
bun dev

# Build for production
bun build

# Database operations
bun db:generate    # Generate Prisma client
bun db:push        # Push schema changes
bun db:studio      # Open database GUI
bun db:seed        # Seed sample data

# Code quality
bun check          # Run lint + typecheck
bun format:write   # Format code
```

---

## Glossary

| Term               | Definition                                    |
| ------------------ | --------------------------------------------- |
| **Booking**        | A reservation for a room on specific dates    |
| **Room Type**      | Category of rooms (e.g., Standard, Deluxe)    |
| **Room**           | Individual physical room                      |
| **Check-in**       | Process of guest arriving and receiving room  |
| **Check-out**      | Process of guest departing and returning room |
| **POS**            | Point of Sale – system for walk-in bookings   |
| **QR Payment**     | Payment via scanning QR code                  |
| **Occupancy Rate** | Percentage of rooms currently occupied        |
| **Amenity**        | Hotel feature or service (WiFi, pool, etc.)   |

---

_Document Version: 1.0_  
_Last Updated: April 2026_  
_Platform: LuxeStay Hotel Management System_
