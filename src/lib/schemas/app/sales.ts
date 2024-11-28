import { date, integer, pgTable } from 'drizzle-orm/pg-core';
import { customers } from './parties';
import { relations } from 'drizzle-orm';
import { lineItems, termsAndCondtions, timestamps } from './common';
import { salesTaxes, vouchers } from './accounting';
import { products, saleStocks } from './inventory';

export const salesTerms = pgTable('sales_terms', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ...termsAndCondtions
})

export const salesTermRelations = relations(salesTerms, ({ many }) => ({
  salesOrders: many(salesOrders),
}))

export const salesOrders = pgTable('sales_orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  customerId: integer().notNull().references(() => customers.id),
  termsId: integer().references(() => salesTerms.id),
  date: date({ mode: 'string' }).defaultNow(),
  number: integer().notNull().unique(),
  ...timestamps
})

export const salesOrderRelations = relations(salesOrders, ({ one, many }) => ({
  customer: one(customers, { fields: [salesOrders.customerId], references: [customers.id] }),
  term: one(salesTerms, { fields: [salesOrders.termsId], references: [salesTerms.id] }),
  lineItems: many(salesOrderLineItems)
}))

export const salesInvoices = pgTable('sales_invoices', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  voucherId: integer().references(() => vouchers.id),
  orderId: integer().references(() => salesOrders.id),
  customerId: integer().references(() => customers.id),
  termsId: integer().references(() => salesTerms.id),
  date: date({ mode: 'string' }).defaultNow(),
  number: integer().notNull().unique(),
  ...timestamps
});

export const salesInvoiceRelations = relations(salesInvoices, ({ one, many }) => ({
  voucher: one(vouchers, { fields: [salesInvoices.voucherId], references: [vouchers.id] }),
  order: one(salesOrders, { fields: [salesInvoices.orderId], references: [salesOrders.id] }),
  customer: one(customers, { fields: [salesInvoices.customerId], references: [customers.id] }),
  terms: one(salesTerms, { fields: [salesInvoices.termsId], references: [salesTerms.id] }),
  lineItems: many(salesInvoiceLineItems),
  stocks: many(saleStocks),
}))


export const salesOrderLineItems = pgTable('sales_order_line_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().notNull().references(() => salesOrders.id),
  productId: integer().notNull().references(() => products.id),
  taxId: integer().references(() => salesTaxes.id),
  ...lineItems
})

export const salesOrderLinteItemRelations = relations(salesOrderLineItems, ({ one }) => ({
  order: one(salesOrders, { fields: [salesOrderLineItems.orderId], references: [salesOrders.id] }),
  product: one(products, { fields: [salesOrderLineItems.productId], references: [products.id] }),
  tax: one(salesTaxes, { fields: [salesOrderLineItems.taxId], references: [salesTaxes.id] })
}))

export const salesInvoiceLineItems = pgTable('sales_invoice_line_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  invoiceId: integer().notNull().references(() => salesInvoices.id),
  productId: integer().notNull().references(() => products.id),
  taxId: integer().references(() => salesTaxes.id),
  ...lineItems
})

export const salesInvoiceLinteItemRelations = relations(salesInvoiceLineItems, ({ one }) => ({
  invoice: one(salesInvoices, { fields: [salesInvoiceLineItems.invoiceId], references: [salesInvoices.id] }),
  product: one(products, { fields: [salesInvoiceLineItems.productId], references: [products.id] }),
  tax: one(salesTaxes, { fields: [salesInvoiceLineItems.taxId], references: [salesTaxes.id] })
}))
