import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number');
export const postalCodeSchema = z.string().min(1, 'Postal code is required');
export const requiredStringSchema = z.string().min(1, 'This field is required');

// Address validation
export const addressSchema = z.object({
  street: requiredStringSchema,
  city: requiredStringSchema,
  postalCode: postalCodeSchema,
  country: requiredStringSchema,
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Time window validation
export const timeWindowSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
}).refine((data) => data.start < data.end, {
  message: "Start time must be before end time",
  path: ["end"],
});

// Pallet validation
export const palletSchema = z.object({
  quantity: z.number().min(1, 'At least 1 pallet is required'),
  dimensions: z.object({
    length: z.number().min(1, 'Length must be positive'),
    width: z.number().min(1, 'Width must be positive'),
    height: z.number().min(1, 'Height must be positive'),
  }),
  weight: z.number().min(1, 'Weight must be positive'),
});

// Price validation
export const priceSchema = z.object({
  min: z.number().min(0, 'Minimum price must be positive'),
  max: z.number().min(0, 'Maximum price must be positive'),
  currency: z.string().default('EUR'),
}).refine((data) => data.min < data.max, {
  message: "Minimum price must be less than maximum price",
  path: ["max"],
});

// Service constraints validation
export const serviceConstraintsSchema = z.object({
  tailLiftRequired: z.boolean().default(false),
  forkliftRequired: z.boolean().default(false),
  indoorDelivery: z.boolean().default(false),
  appointmentRequired: z.boolean().default(false),
  temperatureControlled: z.boolean().default(false),
  hazardousMaterials: z.boolean().default(false),
});

// User validation schemas
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: requiredStringSchema,
  lastName: requiredStringSchema,
  companyName: requiredStringSchema,
  phone: phoneSchema,
  role: z.enum(['shipper', 'carrier', 'dispatcher']),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Shipment validation schemas
export const createShipmentSchema = z.object({
  fromAddress: addressSchema,
  toAddress: addressSchema,
  pickupWindow: timeWindowSchema,
  deliveryWindow: timeWindowSchema,
  pallets: palletSchema,
  adrRequired: z.boolean().default(false),
  constraints: serviceConstraintsSchema.optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // Pickup must be before delivery
  return data.pickupWindow.start < data.deliveryWindow.start;
}, {
  message: "Pickup time must be before delivery time",
  path: ["deliveryWindow"],
});

// Bid validation schema
export const bidSchema = z.object({
  price: z.number().min(0, 'Price must be positive'),
  etaPickup: z.coerce.date(),
  message: z.string().optional(),
});

// Template validation schema
export const templateSchema = z.object({
  name: requiredStringSchema,
  description: z.string().optional(),
  from: addressSchema,
  to: addressSchema,
  pallets: palletSchema,
  adrRequired: z.boolean().default(false),
  constraints: serviceConstraintsSchema.optional(),
  notes: z.string().optional(),
  priceGuidance: priceSchema,
});

// Rating validation schema
export const ratingSchema = z.object({
  communication: z.number().min(1).max(5),
  punctuality: z.number().min(1).max(5),
  careOfGoods: z.number().min(1).max(5),
  overall: z.number().min(1).max(5),
  review: z.string().optional(),
});

// Auto-bid rule validation
export const autoBidRuleSchema = z.object({
  name: requiredStringSchema,
  fromCountry: requiredStringSchema,
  toCountry: requiredStringSchema,
  maxDistance: z.number().min(1, 'Maximum distance must be positive'),
  minPrice: z.number().min(0, 'Minimum price must be positive'),
  maxPrice: z.number().min(0, 'Maximum price must be positive'),
  enabled: z.boolean().default(true),
}).refine((data) => data.minPrice < data.maxPrice, {
  message: "Minimum price must be less than maximum price",
  path: ["maxPrice"],
});

// Cost model validation
export const costModelSchema = z.object({
  name: requiredStringSchema,
  perKilometerRate: z.number().min(0, 'Rate must be positive'),
  perPalletRate: z.number().min(0, 'Rate must be positive'),
  hourlyRate: z.number().min(0, 'Rate must be positive'),
  fuelSurcharge: z.number().min(0, 'Surcharge must be positive'),
  tollsAndFees: z.number().min(0, 'Fees must be positive'),
});

// Validation helper functions
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
      }
      return { success: false, errors };
    }
    console.error('Validation error:', error);
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

// Field validation helper
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown): {
  success: boolean;
  error?: string;
} => {
  try {
    schema.parse(value);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        return { success: false, error: error.errors[0].message };
      }
    }
    console.error('Field validation error:', error);
    return { success: false, error: 'Invalid value' };
  }
};

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  postalCode: /^[A-Z0-9\s-]{3,10}$/i,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  currency: /^\d+(\.\d{1,2})?$/,
};

// Error message helpers
export const getFieldError = (errors: Record<string, string>, fieldPath: string): string | undefined => {
  return errors[fieldPath];
};

export const hasFieldError = (errors: Record<string, string>, fieldPath: string): boolean => {
  return !!errors[fieldPath];
};

// Form state helpers
export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

export const createFormState = <T>(initialData: T): FormState<T> => ({
  data: initialData,
  errors: {},
  isSubmitting: false,
  isValid: false,
});

export const updateFormField = <T>(
  state: FormState<T>,
  field: keyof T,
  value: T[keyof T],
  validation?: (value: T[keyof T]) => string | undefined
): FormState<T> => {
  const newErrors = { ...state.errors };
  
  // Remove existing error for this field
  delete newErrors[field as string];
  
  // Validate if validation function provided
  if (validation) {
    const error = validation(value);
    if (error) {
      newErrors[field as string] = error;
    }
  }
  
  return {
    ...state,
    data: { ...state.data, [field]: value },
    errors: newErrors,
    isValid: Object.keys(newErrors).length === 0,
  };
};
