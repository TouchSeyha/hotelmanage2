// Re-export all schemas from their respective files

// Common schemas
export {
  paginationSchema,
  dateRangeSchema,
  sortOrderSchema,
  idSchema,
  slugSchema,
  type PaginationInput,
  type DateRangeInput,
} from './common';

// Room type schemas
export {
  createRoomTypeSchema,
  updateRoomTypeSchema,
  roomTypeFiltersSchema,
  getRoomTypeBySlugSchema,
  type CreateRoomTypeInput,
  type UpdateRoomTypeInput,
  type RoomTypeFiltersInput,
  type GetRoomTypeBySlugInput,
} from './roomType';

// Room schemas
export {
  roomStatusSchema,
  createRoomSchema,
  updateRoomSchema,
  roomFiltersSchema,
  checkAvailabilitySchema,
  bulkCreateRoomsSchema,
  type RoomStatus,
  type CreateRoomInput,
  type UpdateRoomInput,
  type RoomFiltersInput,
  type CheckAvailabilityInput,
  type BulkCreateRoomsInput,
} from './room';

// Booking schemas
export {
  bookingStatusSchema,
  paymentMethodSchema,
  paymentStatusSchema,
  createBookingSchema,
  updateBookingSchema,
  cancelBookingSchema,
  bookingFiltersSchema,
  getBookingByIdSchema,
  checkInSchema,
  checkOutSchema,
  posBookingSchema,
  type BookingStatus,
  type PaymentMethod,
  type PaymentStatus,
  type CreateBookingInput,
  type UpdateBookingInput,
  type CancelBookingInput,
  type BookingFiltersInput,
  type GetBookingByIdInput,
  type CheckInInput,
  type CheckOutInput,
  type PosBookingInput,
} from './booking';

// User schemas
export {
  roleSchema,
  updateProfileSchema,
  adminUpdateUserSchema,
  userFiltersSchema,
  getUserByIdSchema,
  deleteUserSchema,
  type Role,
  type UpdateProfileInput,
  type AdminUpdateUserInput,
  type UserFiltersInput,
  type GetUserByIdInput,
  type DeleteUserInput,
} from './user';

// Contact form schema (existing)
export { contactFormSchema, type ContactFormValues } from './contact';
