import { z } from 'zod';

// Form schema for room type create/edit (flat structure for UI)
export const roomTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required').max(200),
  basePrice: z.number().positive('Price must be positive'),
  capacity: z.number().int().positive('Capacity must be at least 1'),
  size: z.number().int().positive().optional(),
  images: z.string().optional(),
  amenities: z.string().optional(),
});

export type RoomTypeFormData = z.infer<typeof roomTypeFormSchema>;

// Default values for room type form
export const defaultRoomTypeFormData: RoomTypeFormData = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  basePrice: 0,
  capacity: 2,
  size: undefined,
  images: '',
  amenities: '',
};

// Transformer: Form → API
export function transformRoomTypeFormToApi(formData: RoomTypeFormData) {
  return {
    ...formData,
    images: formData.images
      ? formData.images
          .split('\n')
          .map((i) => i.trim())
          .filter(Boolean)
      : [],
    amenities: formData.amenities
      ? formData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean)
      : [],
  };
}

// Transformer: API → Form (for edit forms)
export function transformRoomTypeApiToForm(apiData: {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: { toNumber: () => number };
  capacity: number;
  size?: number | null;
  images: unknown;
  amenities: unknown;
  isActive: boolean;
}): RoomTypeFormData {
  return {
    name: apiData.name,
    slug: apiData.slug,
    description: apiData.description,
    shortDescription: apiData.shortDescription,
    basePrice:
      typeof apiData.basePrice === 'number' ? apiData.basePrice : apiData.basePrice.toNumber(),
    capacity: apiData.capacity,
    size: apiData.size ?? undefined,
    images: Array.isArray(apiData.images) ? (apiData.images as string[]).join('\n') : '',
    amenities: Array.isArray(apiData.amenities) ? (apiData.amenities as string[]).join(', ') : '',
  };
}
