import { integer, pgTable, varchar, real, primaryKey } from 'drizzle-orm/pg-core';
import { accounts, salesTaxes } from './accounting';
import { relations } from 'drizzle-orm';
import { purchaseInvoices } from './purchase';
import { salesInvoices } from './sales';

export const unitOfMeasurements = pgTable('unit_of_measurements', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 64 }).notNull().unique(),
  symbol: varchar({ length: 10 }).notNull().unique()
});

export const unitRelations = relations(unitOfMeasurements, ({ many }) => ({
  products: many(products)
}));

export const categories = pgTable('categories', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 64 }).notNull().unique(),
  description: varchar({ length: 2048 })
});

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const products = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  unitId: integer()
    .notNull()
    .references(() => unitOfMeasurements.id, { onDelete: 'set null' }),
  accountId: integer()
    .notNull()
    .references(() => accounts.id),
  taxId: integer().notNull().references(() => salesTaxes.id),
  categoryId: integer().references(() => categories.id),
  name: varchar({ length: 256 }).notNull().unique(),
  description: varchar({ length: 1024 }),
  listPrice: real(),
  purchasePrice: real(),
  salePrice: real()
});

export const productRelations = relations(products, ({ one, many }) => ({
  account: one(accounts, { fields: [products.accountId], references: [accounts.id], relationName: 'product_account' }),
  tax: one(salesTaxes, { fields: [products.taxId], references: [salesTaxes.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  unit: one(unitOfMeasurements, { fields: [products.unitId], references: [unitOfMeasurements.id] }),
  stocks: many(productStocks)
}));

export const services = pgTable('services', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  taxId: integer().notNull().references(() => salesTaxes.id),
  accountId: integer().notNull().references(() => accounts.id),
  name: varchar({ length: 256 }).notNull().unique(),
  description: varchar({ length: 1024 }),
});

export const serviceRelations = relations(services, ({ one }) => ({
  account: one(accounts, { fields: [services.accountId], references: [accounts.id], relationName: 'service_account' }),
  tax: one(salesTaxes, { fields: [services.taxId], references: [salesTaxes.id] }),
}));

export const productStocks = pgTable('product_stocks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  purchaseInvoiceId: integer().notNull().references(() => purchaseInvoices.id, { onDelete: 'cascade' }),
  productId: integer()
    .notNull()
    .references(() => products.id),
  quantity: real().notNull(),
  price: real().notNull(),
  discountPercent: real().default(0)
});

export const productStockRelations = relations(productStocks, ({ one, many }) => ({
  purchaseInvoice: one(
    purchaseInvoices,
    {
      fields: [productStocks.purchaseInvoiceId],
      references: [purchaseInvoices.id]
    }
  ),
  product: one(products, { fields: [productStocks.productId], references: [products.id] }),
  saleStocks: many(stockToSale)
}));

export const saleStocks = pgTable('sale_stocks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  salesInvoiceId: integer().notNull().references(() => salesInvoices.id, { onDelete: 'cascade' }),
  quantity: real().notNull(),
  price: real().notNull(),
  discountPercent: real().default(0)
})

export const saleStockRelations = relations(saleStocks, ({ one, many }) => ({
  salesInvoice: one(salesInvoices, { fields: [saleStocks.salesInvoiceId], references: [salesInvoices.id] }),
  productStocks: many(stockToSale)
}))

export const stockToSale = pgTable('stock_to_sale', {
  productStockId: integer().notNull().references(() => productStocks.id, { onDelete: 'cascade' }),
  saleStockId: integer().notNull().references(() => saleStocks.id, { onDelete: 'cascade' })
},
  (t) => {
    return {
      pk: primaryKey({ columns: [t.productStockId, t.saleStockId] })
    }
  }
)

export const stockToSaleRelations = relations(stockToSale, ({ one }) => ({
  productStock: one(productStocks, { fields: [stockToSale.productStockId], references: [productStocks.id] }),
  saleStock: one(saleStocks, { fields: [stockToSale.saleStockId], references: [saleStocks.id] })
}))

