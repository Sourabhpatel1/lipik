import { real, timestamp, varchar } from 'drizzle-orm/pg-core';

export const timestamps = {
  updated_at: timestamp({ mode: 'string' }),
  created_at: timestamp({ mode: 'string' }).defaultNow().notNull()
};

export const addresses = {
  address: varchar({ length: 1024 }),
  city: varchar({ length: 64 }),
  district: varchar({ length: 64 }),
  state: varchar({ length: 64 }),
  postalCode: varchar({ length: 32 })
};

export const contacts = {
  email: varchar({ length: 128 }),
  phone: varchar({ length: 64 })
};

export const termsAndCondtions = {
  title: varchar({ length: 64 }).notNull(),
  condition: varchar().notNull()
}

export const lineItems = {
  price: real().notNull(),
  quantity: real().notNull(),
  discountPercent: real().default(0),
  discountAmount: real().default(0),
  taxRate: real().default(0),
  taxAmount: real().default(0),
  total: real().notNull()
}
