import { z } from 'zod';

// Validador para creación y actualización de clientes
export const clientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'prospect']).default('prospect'),
  notes: z.string().optional().nullable(),
  website: z.string().url('URL inválida').optional().nullable()
});

// Validador para la información de facturación
export const billingInfoSchema = z.object({
  clientId: z.string().uuid('ID de cliente inválido'),
  companyName: z.string().optional().nullable(),
  vatNumber: z.string().optional().nullable(),
  fiscalAddress: z.string().optional().nullable(),
  fiscalCity: z.string().optional().nullable(),
  fiscalPostalCode: z.string().optional().nullable(),
  fiscalCountry: z.string().optional().nullable(),
  paymentMethod: z.enum(['bank_transfer', 'credit_card', 'paypal', 'other']).default('bank_transfer'),
  bankAccount: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  swiftBic: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

// Validador para contactos
export const contactSchema = z.object({
  clientId: z.string().uuid('ID de cliente inválido'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  isPrimary: z.boolean().default(false),
  department: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

// Función de validación reutilizable para middleware
export const validateSchema = (schema) => async (req, res, next) => {
  try {
    req.validatedBody = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    return res.status(400).json({
      error: 'Invalid data',
      message: error.message
    });
  }
};

export default {
  clientSchema,
  billingInfoSchema,
  contactSchema,
  validateSchema
};
