import { z } from 'zod';

export let voucherTypes = [
  'Journal',
  'Cash',
  'Bank',
  'Contra',
  'Debit Note',
  'Credit Note'
] as const;

export const newAccountSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Account name is required' })
    .max(64, { message: 'Account name can not be longer than 64 characters' }),
  number: z
    .number({
      required_error: 'Account number is required',
      invalid_type_error: 'Please enter a vaild number'
    })
    .default(undefined as unknown as number),
  groupId: z
    .number({ required_error: 'Account type is required' })
    .default(undefined as unknown as number)
});

export const newTaxSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(64, { message: 'Tax name can not be longer than 64 characters' }),
  rate: z
    .number({ invalid_type_error: 'Please enter a valid number' })
    .min(0, { message: 'Tax rate can not be less than 0' })
    .default(NaN)
});

const entrySchema = z.object({
  entryType: z
    .enum(['dr', 'cr'], { invalid_type_error: 'Please enter a valid entry type' })
    .default(undefined as unknown as 'dr'),
  accountId: z
    .number({ required_error: 'Entry account is required' })
    .default(undefined as unknown as number),
  amount: z
    .number({ required_error: 'Entry amount is required' })
    .default(undefined as unknown as number)
});

export const newVoucherSchema = z
  .object({
    voucherType: z.enum(voucherTypes).default('' as 'Journal'),
    voucherNumber: z.number().default(undefined as unknown as number),
    voucherDate: z.string().date(),
    entries: z
      .array(entrySchema)
      .min(2, { message: 'A voucher must contain atleast 2 entries' })
      .default([
        {
          entryType: '' as 'dr',
          accountId: undefined as unknown as number,
          amount: undefined as unknown as number
        },
        {
          entryType: '' as 'dr',
          accountId: undefined as unknown as number,
          amount: undefined as unknown as number
        }
      ])
  })
  .refine(
    (data) =>
      data.entries.filter((e) => e.entryType === 'dr').reduce((a, b) => a + b.amount, 0) ===
      data.entries.filter((e) => e.entryType === 'cr').reduce((a, b) => a + b.amount, 0),
    {
      message: 'Debit amounts do not match credit amounts',
      path: ['entries', 'amount']
    }
  );
