import { z } from "zod";
import { newLinteItemSchema } from "./common";



export const newOrderSchema = z.object({
  partyId: z.number({ invalid_type_error: "Please select a valid Vendor" })
    .min(1, { message: "Vendor is required" }),
  termsId: z.number({ invalid_type_error: "Please select valid terms" })
    .optional(),
  date: z.string().date(),
  taxationType: z.enum(['inter', 'intra']),
  number: z.number({ invalid_type_error: 'Please enter a valid number' })
    .min(1, { message: 'Order number is required' }),
  lineItems: newLinteItemSchema.array().min(1, { message: "Atleast one line item is required" })
})

export const newInvoiceSchema = z.object({
  orderId: z.number({ invalid_type_error: 'Please select a valid order' })
    .optional(),
  partyId: z.number({ invalid_type_error: 'Please select a valid vendor' })
    .optional(),
  paymentType: z.enum(['Cash', 'Bank', 'Account']),
  termsId: z.number({ invalid_type_error: 'Please select a valid term' })
    .optional(),
  date: z.string().date(),
  number: z.number({ invalid_type_error: 'Please enter a valid number' })
    .min(1, { message: "Invoice number is required" }),
  lineItems: newLinteItemSchema.array().min(1, { message: "Atleast one line item is required" })
})
