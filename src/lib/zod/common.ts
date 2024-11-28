import { z } from "zod";

export const newTermsSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(64, { message: "Title can not be longer than 64 characters" }),
  condition: z.string()
})

export const newLinteItemSchema = z.object({
  productId: z.number({ invalid_type_error: 'Please select a vaild product' })
    .min(1, { message: 'Product is required' }),
  taxId: z.number({ invalid_type_error: 'Please select a vaild tax' })
    .min(1, { message: 'Tax is required' }),
  price: z.number(),
  quantity: z.number(),
  discountPercent: z.number()
    .max(100, { message: "Discount percentage can not be greater than 100" })
    .default(0),
  discountAmount: z.number().default(0),
  taxRate: z.number().default(0),
  taxAmount: z.number().default(0),
  total: z.number({ invalid_type_error: 'invalid total amount' })
})
