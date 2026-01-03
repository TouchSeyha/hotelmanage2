// Centralized schema exports for the hotel management platform

// Re-export API schemas (backend contracts - used in tRPC routers)
export * from './api';

// Re-export form schemas (frontend forms - used in UI components)
export * from './forms';

// Export contact form schema
export { contactFormSchema, type ContactFormValues } from './contact';
