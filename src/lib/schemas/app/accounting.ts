import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  timestamp,
  unique,
  varchar
} from 'drizzle-orm/pg-core';
import { timestamps } from './common';
import { relations } from 'drizzle-orm';
import { customers, vendors } from './parties';
import { products, services } from './inventory';

export const voucherTypes = pgEnum('voucher_types', [
  'Journal',
  'Cash',
  'Bank',
  'Contra',
  'Debit Note',
  'Credit Note',
  'Sales',
  'Purchase',
  'Sales Return',
  'Purchase Return',
  'Depriciation'
]);

export const rootAccounts = pgTable('root_accounts', {
  id: integer().primaryKey().notNull(),
  name: varchar().notNull().unique()
});

export const rootAccountRelations = relations(rootAccounts, ({ many }) => ({
  groupAccounts: many(groupAccounts)
}));

export const groupAccounts = pgTable('group_accounts', {
  id: integer().primaryKey().notNull(),
  rootId: integer()
    .notNull()
    .references(() => rootAccounts.id),
  name: varchar().notNull().unique()
});

export const groupAccountRelations = relations(groupAccounts, ({ one, many }) => ({
  rootAccount: one(rootAccounts, { fields: [groupAccounts.rootId], references: [rootAccounts.id] }),
  accounts: many(accounts)
}));

export const accounts = pgTable('accounts', {
  id: integer().primaryKey().notNull().generatedAlwaysAsIdentity(),
  groupId: integer()
    .notNull()
    .references(() => groupAccounts.id),
  name: varchar().notNull().unique(),
  number: integer().notNull().unique(),
  isDisable: boolean().notNull().default(false),
  currentBalance: real().notNull().default(0),
  ...timestamps
});

export const accountRelations = relations(accounts, ({ one, many }) => ({
  groupAccount: one(groupAccounts, { fields: [accounts.groupId], references: [groupAccounts.id] }),
  drEntries: many(drEntries, { relationName: 'dr_relation' }),
  crEntries: many(crEntries, { relationName: 'cr_relation' }),
  customers: many(customers, { relationName: 'customer_account' }),
  vendors: many(vendors, { relationName: 'vendor_account' }),
  products: many(products, { relationName: 'product_account' }),
  services: many(services, { relationName: 'service_account' })
}));

export const salesTaxes = pgTable('taxes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  rate: real().notNull(),
  ...timestamps
});

export const vouchers = pgTable(
  'vouchers',
  {
    id: integer().primaryKey().notNull().generatedAlwaysAsIdentity(),
    voucherType: voucherTypes().notNull().default('Journal'),
    voucherNumber: integer().notNull(),
    voucherDate: timestamp({ mode: 'string' }).notNull(),
    ...timestamps
  },
  (t) => ({
    uIdx: unique('type_number_idx').on(t.voucherType, t.voucherNumber)
  })
);

export const voucherRelations = relations(vouchers, ({ many }) => ({
  drEntries: many(drEntries),
  crEntries: many(crEntries)
}));

export const drEntries = pgTable('dr_entries', {
  id: integer().primaryKey().notNull().generatedAlwaysAsIdentity(),
  voucherId: integer()
    .notNull()
    .references(() => vouchers.id, { onDelete: 'cascade' }),
  accountId: integer()
    .notNull()
    .references(() => accounts.id),
  amount: real().notNull(),
  ...timestamps
});

export const drEntryRelations = relations(drEntries, ({ one, many }) => ({
  account: one(accounts, {
    fields: [drEntries.accountId],
    references: [accounts.id],
    relationName: 'dr_relation'
  }),
  voucher: one(vouchers, { fields: [drEntries.voucherId], references: [vouchers.id] }),
  references: many(entryReferences)
}));

export const crEntries = pgTable('cr_entries', {
  id: integer().primaryKey().notNull().generatedAlwaysAsIdentity(),
  voucherId: integer()
    .notNull()
    .references(() => vouchers.id, { onDelete: 'cascade' }),
  accountId: integer()
    .notNull()
    .references(() => accounts.id),
  amount: real().notNull(),
  ...timestamps
});

export const crEntryRelations = relations(crEntries, ({ one, many }) => ({
  account: one(accounts, {
    fields: [crEntries.accountId],
    references: [accounts.id],
    relationName: 'cr_relation'
  }),
  voucher: one(vouchers, { fields: [crEntries.voucherId], references: [vouchers.id] }),
  references: many(entryReferences)
}));

export const entryReferences = pgTable(
  'entry_reference',
  {
    drEntryId: integer()
      .notNull()
      .references(() => drEntries.id, { onDelete: 'cascade' }),
    crEntryId: integer()
      .notNull()
      .references(() => crEntries.id, { onDelete: 'cascade' })
  },
  (t) => ({
    pk: primaryKey({ columns: [t.crEntryId, t.drEntryId] })
  })
);

export const entryReferenceRelations = relations(entryReferences, ({ one }) => ({
  drEntry: one(drEntries, { fields: [entryReferences.drEntryId], references: [drEntries.id] }),
  crEntry: one(crEntries, { fields: [entryReferences.crEntryId], references: [crEntries.id] })
}));
