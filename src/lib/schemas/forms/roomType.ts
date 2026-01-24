import { z } from 'zod';

export const roomTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required').max(200),
  basePrice: z.number().positive('Price must be positive'),
  capacity: z.number().int().positive('Capacity must be at least 1'),
  size: z.number().int().positive().optional(),
  images: z.array(z.string().url()),
  amenityIds: z.array(z.string()).optional(),
});

export type RoomTypeFormData = z.infer<typeof roomTypeFormSchema>;

export const defaultRoomTypeFormData: RoomTypeFormData = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  basePrice: 0,
  capacity: 2,
  size: undefined,
  images: [],
  amenityIds: [],
};

export function transformRoomTypeFormToApi(formData: RoomTypeFormData) {
  return {
    ...formData,
    images: formData.images ?? [],
    amenityIds: formData.amenityIds ?? [],
  };
}

export function transformRoomTypeApiToForm(apiData: {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: unknown;
  capacity: number;
  size?: number | null;
  images: unknown;
  amenities?: Array<{ id: string }>;
  isActive: boolean;
}): RoomTypeFormData {
  return {
    name: apiData.name,
    slug: apiData.slug,
    description: apiData.description,
    shortDescription: apiData.shortDescription,
    basePrice: Number(apiData.basePrice),
    capacity: apiData.capacity,
    size: apiData.size ?? undefined,
    images: Array.isArray(apiData.images) ? (apiData.images as string[]) : [],
    amenityIds: apiData.amenities?.map((a) => a.id) ?? [],
  };
}
