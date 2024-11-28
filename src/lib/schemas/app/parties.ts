import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { addresses, contacts } from './common';
import { accounts } from './accounting';
import { relations } from 'drizzle-orm';

const partyInformation = {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 64 }).notNull(),
	...contacts,
	...addresses
};

export const customers = pgTable('customers', {
	...partyInformation,
	taxationId: varchar({ length: 64 }).unique(),
	accountId: integer()
		.notNull()
		.references(() => accounts.id, { onDelete: 'cascade' })
});

export const customerRelations = relations(customers, ({ one }) => ({
	account: one(accounts, {
		fields: [customers.accountId],
		references: [accounts.id],
		relationName: 'customer_account'
	})
}));

export const vendors = pgTable('vendors', {
	...partyInformation,
	taxationId: varchar({ length: 64 }).unique(),
	accountId: integer()
		.notNull()
		.references(() => accounts.id, { onDelete: 'cascade' })
});

export const vendorRelations = relations(vendors, ({ one }) => ({
	account: one(accounts, {
		fields: [vendors.accountId],
		references: [accounts.id],
		relationName: 'vendor_account'
	})
}));
