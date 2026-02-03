import { z } from 'zod';

// Room status enum for forms
export const roomStatusSchema = z.enum([
  'available',
  'occupied',
  'cleaning',
  'maintenance',
  'out_of_service',
]);

// Form schema for room create/edit
export const roomFormSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  roomTypeId: z.string().min(1, 'Room type is required'),
  floor: z.number().int().min(1, 'Floor must be at least 1'),
  status: roomStatusSchema,
  notes: z.string().optional(),
});

export type RoomFormData = z.infer<typeof roomFormSchema>;

// Default values for room form
export const defaultRoomFormData: RoomFormData = {
  roomNumber: '',
  roomTypeId: '',
  floor: 1,
  status: 'available',
  notes: '',
};

// Transformer: Form → API
export function transformRoomFormToApi(formData: RoomFormData) {
  return {
    roomNumber: formData.roomNumber,
    roomTypeId: formData.roomTypeId,
    floor: formData.floor,
    status: formData.status,
    notes: formData.notes,
  };
}

// Transformer: API → Form (for edit forms)
export function transformRoomApiToForm(apiData: {
  roomNumber: string;
  roomTypeId: string;
  floor?: number | null;
  status: string;
  notes?: string | null;
}): RoomFormData {
  return {
    roomNumber: apiData.roomNumber,
    roomTypeId: apiData.roomTypeId,
    floor: apiData.floor ?? 1,
    status: apiData.status as z.infer<typeof roomStatusSchema>,
    notes: apiData.notes ?? '',
  };
}
