import { z } from 'zod';
import { roleSchema } from '../api';

// Form schema for user profile update
export const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// Default values for profile form
export const defaultProfileFormData: ProfileFormData = {
  name: '',
  phone: '',
};

// Transformer: Form → API (for profile update)
export function transformProfileFormToApi(formData: ProfileFormData) {
  return {
    name: formData.name,
    phone: formData.phone,
  };
}

// Transformer: API → Form (for edit forms)
export function transformProfileApiToForm(apiData: {
  name?: string | null;
  phone?: string | null;
}): ProfileFormData {
  return {
    name: apiData.name ?? '',
    phone: apiData.phone ?? '',
  };
}

// Form schema for admin user edit
export const userEditFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  role: roleSchema,
});

export type UserEditFormData = z.infer<typeof userEditFormSchema>;

// Default values for user edit form
export const defaultUserEditFormData: UserEditFormData = {
  name: '',
  phone: '',
  role: 'user',
};

// Transformer: Form → API (for admin user edit)
export function transformUserEditFormToApi(formData: UserEditFormData) {
  return {
    name: formData.name,
    phone: formData.phone,
    role: formData.role,
  };
}

// Transformer: API → Form (for edit forms)
export function transformUserApiToForm(apiData: {
  name?: string | null;
  phone?: string | null;
  role: string;
}): UserEditFormData {
  return {
    name: apiData.name ?? '',
    phone: apiData.phone ?? '',
    role: apiData.role as z.infer<typeof roleSchema>,
  };
}
