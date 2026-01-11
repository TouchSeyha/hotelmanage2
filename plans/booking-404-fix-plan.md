# Booking 404 Error - Root Cause Analysis & Solution Plan

## Problem Summary

Users cannot book rooms from the public site. When clicking "Book Now" on a room detail page, they encounter a 404 error because the link points to a non-existent route.

## Root Cause Analysis

### Issue 1: Incorrect Booking Route

**Location:** [`src/app/(public)/rooms/[slug]/page.tsx:131`](<src/app/(public)/rooms/[slug]/page.tsx:131>)

```tsx
<Link href={`/book?room=${roomType.slug}`}>
  {availableRooms > 0 ? 'Book Now' : 'Not Available'}
</Link>
```

**Problem:** The link points to `/book?room={slug}`, but this route doesn't exist in the application.

**Actual Route:** The booking functionality is located at [`/dashboard/book`](src/app/dashboard/book/page.tsx), which requires authentication.

### Issue 2: Authentication Requirement

**Location:** [`src/app/dashboard/layout.tsx:23-28`](src/app/dashboard/layout.tsx:23-28)

```tsx
const session = await auth();

if (!session?.user) {
  redirect('/signin');
}
```

**Problem:** The dashboard (including booking) requires users to be signed in. Public users clicking "Book Now" would need to authenticate first.

### Current Flow Analysis

```mermaid
graph TD
    A[Public User on Room Detail Page] -->|Clicks Book Now| B[/book?room=slug]
    B -->|404 Error| C[Route Not Found]

    D[Authenticated User] -->|Direct Access| E[/dashboard/book]
    E -->|Protected Route| F[Booking Form]
```

## Solution Options

### Option 1: Redirect to Dashboard Booking (Recommended)

**Approach:** Update the public room detail page to link to `/dashboard/book?room={slug}` instead of `/book?room={slug}`.

**Pros:**

- Minimal code changes
- Leverages existing authentication flow
- Users are redirected to sign-in if not authenticated
- Maintains security and user tracking

**Cons:**

- Requires authentication before booking
- Extra step for new users

**Implementation:**

1. Update link in [`src/app/(public)/rooms/[slug]/page.tsx:131`](<src/app/(public)/rooms/[slug]/page.tsx:131>)
2. Ensure [`step-1-room.tsx`](src/app/dashboard/book/_components/step-1-room.tsx) properly handles the `room` query parameter (already implemented on line 28)

### Option 2: Create Public Booking Route

**Approach:** Create a new `/book` route in the public section that mirrors the dashboard booking functionality.

**Pros:**

- Allows guest bookings without authentication
- Better user experience for first-time visitors

**Cons:**

- Duplicate code/logic
- Need to handle guest vs authenticated user flows
- More complex implementation
- Potential security concerns with unauthenticated bookings

### Option 3: Hybrid Approach

**Approach:** Create a `/book` route that checks authentication and redirects accordingly.

**Pros:**

- Single entry point for all bookings
- Can handle both guest and authenticated users
- Cleaner URL structure

**Cons:**

- More complex routing logic
- Still need to decide on guest booking policy

## Recommended Solution: Option 1

Update the booking link to point to the existing authenticated booking flow.

### Implementation Steps

#### Step 1: Update Room Detail Page Link

**File:** [`src/app/(public)/rooms/[slug]/page.tsx`](<src/app/(public)/rooms/[slug]/page.tsx>)

**Change line 131 from:**

```tsx
<Link href={`/book?room=${roomType.slug}`}>
```

**To:**

```tsx
<Link href={`/dashboard/book?room=${roomType.slug}`}>
```

#### Step 2: Verify Query Parameter Handling

**File:** [`src/app/dashboard/book/_components/step-1-room.tsx`](src/app/dashboard/book/_components/step-1-room.tsx)

**Current implementation (lines 24-50):** ✅ Already handles the `room` query parameter correctly

- Reads `room` slug from URL query params
- Finds matching room type by slug
- Pre-selects the room type in the dropdown

#### Step 3: Test Authentication Flow

Verify that:

1. Unauthenticated users clicking "Book Now" are redirected to [`/signin`](<src/app/(auth)/signin/page.tsx>)
2. After sign-in, users are redirected back to the booking page with the room parameter preserved
3. The room type is pre-selected in the booking form

#### Step 4: Optional Enhancement - Preserve Return URL

**File:** [`src/app/dashboard/layout.tsx`](src/app/dashboard/layout.tsx)

Consider updating the redirect to preserve the intended destination:

```tsx
if (!session?.user) {
  redirect(`/signin?callbackUrl=${encodeURIComponent(request.url)}`);
}
```

### Additional Considerations

#### Room Card Component

**File:** [`src/components/shared/roomCard.tsx`](src/components/shared/roomCard.tsx)

Check if this component also has a "Book Now" button that needs updating.

#### Contact Page Alternative

The room detail page already provides a "Contact Us" button as an alternative for users who prefer to inquire before booking.

## Testing Checklist

- [ ] Public user clicks "Book Now" on room detail page
- [ ] User is redirected to sign-in page
- [ ] After authentication, user lands on booking page
- [ ] Room type is pre-selected based on slug parameter
- [ ] Booking flow completes successfully
- [ ] Already authenticated users can book directly
- [ ] Invalid room slugs are handled gracefully

## Alternative: Guest Booking Feature (Future Enhancement)

If guest bookings are desired in the future, consider:

1. Create a separate guest booking flow
2. Collect guest information upfront
3. Create temporary user accounts or guest booking records
4. Send confirmation emails with booking management links
5. Allow guests to claim bookings after creating an account

This would require:

- New database schema for guest bookings
- Email verification system
- Guest booking management interface
- Migration path from guest to authenticated bookings

## Files to Modify

1. **Primary Changes:**
   - [`src/app/(public)/rooms/[slug]/page.tsx`](<src/app/(public)/rooms/[slug]/page.tsx>) - Update booking link ✅
   - [`src/app/dashboard/book/_components/step-3-payment.tsx`](src/app/dashboard/book/_components/step-3-payment.tsx) - Update confirmation redirect ✅

2. **Optional Enhancements:**
   - [`src/app/dashboard/layout.tsx`](src/app/dashboard/layout.tsx) - Preserve callback URL
   - [`src/components/shared/roomCard.tsx`](src/components/shared/roomCard.tsx) - Check for similar links (✅ only has "View Details")

3. **Verification:**
   - [`src/app/dashboard/book/_components/step-1-room.tsx`](src/app/dashboard/book/_components/step-1-room.tsx) - Already handles query params ✅

## Summary

Two 404 errors were identified and fixed:

1. **Room Detail "Book Now" Button:** The link pointed to `/book?room={slug}` instead of `/dashboard/book?room={slug}`
   - **Fixed in:** [`src/app/(public)/rooms/[slug]/page.tsx:131`](<src/app/(public)/rooms/[slug]/page.tsx:131>)

2. **Booking Confirmation Redirect:** After successful booking, users were redirected to `/book/confirmation?id={id}` instead of `/dashboard/book/confirmation?id={id}`
   - **Fixed in:** [`src/app/dashboard/book/_components/step-3-payment.tsx:43`](src/app/dashboard/book/_components/step-3-payment.tsx:43)

Both fixes leverage the existing authenticated booking flow. The booking form already handles the room query parameter correctly, so no additional changes were needed.
