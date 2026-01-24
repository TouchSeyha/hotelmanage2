import { z } from 'zod';

// Form schema for guest information in booking flow
export const guestInfoSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.string().email('Please enter a valid email'),
  guestPhone: z.string().min(10, 'Please enter a valid phone number'),
  specialRequests: z.string().max(500).optional(),
});

export type GuestInfoFormData = z.infer<typeof guestInfoSchema>;

// Default values for guest info form
export const defaultGuestInfoFormData: GuestInfoFormData = {
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  specialRequests: '',
};

// Form schema for POS booking (admin walk-in)
export const posBookingFormSchema = z
  .object({
    roomId: z.string().min(1, 'Please select a room'),
    checkInDate: z.date({ message: 'Check-in date is required' }),
    checkOutDate: z.date({ message: 'Check-out date is required' }),
    numberOfGuests: z.number().int().min(1, 'At least 1 guest required'),
    guestName: z.string().min(2, 'Guest name is required'),
    guestEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    guestPhone: z.string().optional(),
    specialRequests: z.string().max(500).optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  });

export type POSBookingFormData = z.infer<typeof posBookingFormSchema>;

// Default values for POS booking form
export const defaultPOSBookingFormData: POSBookingFormData = {
  roomId: '',
  checkInDate: new Date(),
  checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  numberOfGuests: 1,
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  specialRequests: '',
};

// Transformer: Form → API (for POS booking)
export function transformPOSBookingFormToApi(formData: POSBookingFormData) {
  return {
    roomId: formData.roomId,
    checkInDate: formData.checkInDate,
    checkOutDate: formData.checkOutDate,
    numberOfGuests: formData.numberOfGuests,
    guestName: formData.guestName,
    guestEmail: formData.guestEmail ?? undefined,
    guestPhone: formData.guestPhone ?? undefined,
    specialRequests: formData.specialRequests ?? undefined,
  };
}
