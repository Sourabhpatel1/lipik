import { z } from 'zod';

export const newUOMSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(64, { message: 'Name can not be longer than 64 characters' }),
  symbol: z
    .string()
    .min(1, { message: 'Symbol is required' })
    .max(16, { message: 'Symbol can not be longer than 16 characters' })
});

export const newCatergorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required.' })
    .max(64, { message: 'Name can not be longer than 64 characters' }),
  description: z
    .string()
    .max(2048, { message: 'Message can not be longer than 2048 characters' })
    .optional()
});

export const newProductSchema = z.object({
  unitId: z
    .number({ invalid_type_error: 'Please select a valid product unit' })
    .min(1, { message: 'Unit of measurement is required' }),
  categoryId: z.number({ invalid_type_error: 'Please select a valid product category' }).optional(),
  accountId: z.number().min(1, { message: 'Product account is required.' }),
  taxId: z.number().min(1, { message: 'Tax is required' }),
  name: z
    .string()
    .min(1, { message: 'Product name is required' })
    .max(256, { message: 'Product name can not be longer than 64 characters' }),
  description: z
    .string()
    .max(1024, { message: 'Product description can not be longer than 1024 characters' }),
  listPrice: z.number().min(1, { message: 'List price can not be less than 1' }).optional(),
  purchasePrice: z.number().min(1, { message: 'Purchase price can not be less than 1' }).optional(),
  salePrice: z.number().min(1, { message: 'Sale price can not be less than 1' }).optional()
});

export const newServiceSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Service name is required' })
    .max(256, { message: 'Service name can not be longer than 256 characters' }),
  taxId: z.number().min(1, { message: 'Tax is required' }),
  description: z
    .string()
    .max(1024, { message: 'Service description can not be longer than 1024 characters' })
    .optional(),
});
