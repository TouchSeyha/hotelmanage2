import { z } from 'zod';

export const amenityFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  icon: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
});

export type AmenityFormData = z.infer<typeof amenityFormSchema>;

export const defaultAmenityFormData: AmenityFormData = {
  name: '',
  icon: '',
  category: '',
};

export function transformAmenityFormToApi(data: AmenityFormData) {
  return {
    name: data.name,
    icon: data.icon ?? undefined,
    category: data.category ?? undefined,
  };
}

export function transformAmenityApiToForm(amenity: {
  name: string;
  icon: string | null;
  category: string | null;
}): AmenityFormData {
  return {
    name: amenity.name,
    icon: amenity.icon ?? '',
    category: amenity.category ?? '',
  };
}
