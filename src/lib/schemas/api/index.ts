// Re-export all API schemas from their respective files

// Common schemas
export {
  paginationSchema,
  dateRangeSchema,
  sortOrderSchema,
  idSchema,
  slugSchema,
  type PaginationInput,
  type DateRangeInput,
} from '../common';

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
  validRoomStatusTransitions,
  createRoomSchema,
  updateRoomSchema,
  roomFiltersSchema,
  checkAvailabilitySchema,
  bulkCreateRoomsSchema,
  updateRoomStatusSchema,
  type RoomStatus,
  type CreateRoomInput,
  type UpdateRoomInput,
  type RoomFiltersInput,
  type CheckAvailabilityInput,
  type BulkCreateRoomsInput,
  type UpdateRoomStatusInput,
} from './room';

// Booking schemas
export {
  bookingStatusSchema,
  paymentMethodSchema,
  paymentStatusSchema,
  inactiveBookingStatuses,
  createBookingSchema,
  updateBookingSchema,
  cancelBookingSchema,
  bookingFiltersSchema,
  getBookingByIdSchema,
  checkInSchema,
  checkOutSchema,
  earlyCheckOutSchema,
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
  type EarlyCheckOutInput,
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

// Amenity schemas
export {
  createAmenitySchema,
  updateAmenitySchema,
  getAmenityByIdSchema,
  deleteAmenitySchema,
  type CreateAmenityInput,
  type UpdateAmenityInput,
  type GetAmenityByIdInput,
  type DeleteAmenityInput,
} from './amenity';
