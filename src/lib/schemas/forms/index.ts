// Re-export all form schemas from their respective files

// Room type forms
export {
  roomTypeFormSchema,
  defaultRoomTypeFormData,
  transformRoomTypeFormToApi,
  transformRoomTypeApiToForm,
  type RoomTypeFormData,
} from './roomType';

// Room forms
export {
  roomFormSchema,
  defaultRoomFormData,
  transformRoomFormToApi,
  transformRoomApiToForm,
  type RoomFormData,
} from './room';

// Booking forms
export {
  guestInfoSchema,
  posBookingFormSchema,
  defaultGuestInfoFormData,
  defaultPOSBookingFormData,
  transformPOSBookingFormToApi,
  type GuestInfoFormData,
  type POSBookingFormData,
} from './booking';

// User forms
export {
  profileFormSchema,
  userEditFormSchema,
  defaultProfileFormData,
  defaultUserEditFormData,
  transformProfileFormToApi,
  transformProfileApiToForm,
  transformUserEditFormToApi,
  transformUserApiToForm,
  type ProfileFormData,
  type UserEditFormData,
} from './user';

// Amenity forms
export {
  amenityFormSchema,
  defaultAmenityFormData,
  transformAmenityFormToApi,
  transformAmenityApiToForm,
  type AmenityFormData,
} from './amenity';
