import { date, integer, pgTable } from 'drizzle-orm/pg-core';
import { vendors } from './parties';
import { relations } from 'drizzle-orm';
import { termsAndCondtions, timestamps, lineItems } from './common';
import { salesTaxes, vouchers } from './accounting';
import { products, productStocks } from './inventory';

export const purchaseTerms = pgTable('purchase_terms', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ...termsAndCondtions
})

export const purchaseTermRelations = relations(purchaseTerms, ({ many }) => ({
  purchaseOrders: many(purchaseOrders)
}))

export const purchaseOrders = pgTable('purchase_orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  vendorId: integer().notNull().references(() => vendors.id),
  termsId: integer().references(() => purchaseTerms.id),
  date: date({ mode: 'string' }).defaultNow(),
  number: integer().notNull().unique(),
  ...timestamps
})

export const purchaseOrderRelations = relations(purchaseOrders, ({ one, many }) => ({
  vendor: one(vendors, { fields: [purchaseOrders.vendorId], references: [vendors.id] }),
  term: one(purchaseTerms, { fields: [purchaseOrders.termsId], references: [purchaseTerms.id] }),
  lineItems: many(purchaseOrderLineItems)
}))

export const purchaseInvoices = pgTable('purchase_invoices', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  voucherId: integer().references(() => vouchers.id),
  orderId: integer().references(() => purchaseOrders.id),
  vendorId: integer().references(() => vendors.id),
  termsId: integer().references(() => purchaseTerms.id),
  date: date({ mode: 'string' }).defaultNow(),
  number: integer().notNull().unique(),
  ...timestamps
});

export const purchaseInvoiceRelations = relations(purchaseInvoices, ({ one, many }) => ({
  voucher: one(vouchers, { fields: [purchaseInvoices.voucherId], references: [vouchers.id] }),
  order: one(purchaseOrders, { fields: [purchaseInvoices.orderId], references: [purchaseOrders.id] }),
  vendor: one(vendors, { fields: [purchaseInvoices.vendorId], references: [vendors.id] }),
  terms: one(purchaseTerms, { fields: [purchaseInvoices.termsId], references: [purchaseTerms.id] }),
  lineItems: many(purchaseInvoiceLineItems),
  stocks: many(productStocks)
}))

export const purchaseOrderLineItems = pgTable('purchase_order_line_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().notNull().references(() => purchaseOrders.id, { onDelete: 'cascade' }),
  productId: integer().notNull().references(() => products.id),
  taxId: integer().references(() => salesTaxes.id),
  ...lineItems
})

export const purchaseOrderLinteItemRelations = relations(purchaseOrderLineItems, ({ one }) => ({
  order: one(purchaseOrders, { fields: [purchaseOrderLineItems.orderId], references: [purchaseOrders.id] }),
  product: one(products, { fields: [purchaseOrderLineItems.productId], references: [products.id] }),
  tax: one(salesTaxes, { fields: [purchaseOrderLineItems.taxId], references: [salesTaxes.id] })
}))

export const purchaseInvoiceLineItems = pgTable('purchase_invoice_line_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  invoiceId: integer().notNull().references(() => purchaseInvoices.id, { onDelete: 'cascade' }),
  productId: integer().notNull().references(() => products.id),
  taxId: integer().references(() => salesTaxes.id),
  ...lineItems
})

export const purchaseInvoiceLinteItemRelations = relations(purchaseInvoiceLineItems, ({ one }) => ({
  invoice: one(purchaseInvoices, { fields: [purchaseInvoiceLineItems.invoiceId], references: [purchaseInvoices.id] }),
  product: one(products, { fields: [purchaseInvoiceLineItems.productId], references: [products.id] }),
  tax: one(salesTaxes, { fields: [purchaseInvoiceLineItems.taxId], references: [salesTaxes.id] })
}))

