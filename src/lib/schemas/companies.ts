import { boolean, integer, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const taxationTypes = pgEnum('taxation_types', ['GST', 'SALES', 'VAT']);

export const companies = pgTable('companies', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 64 }).notNull().unique(),
	dbUrl: varchar({ length: 64 }).notNull().unique(),
	financialYearStart: timestamp({ mode: 'string' }).notNull(),
	address: varchar({ length: 1024 }),
	city: varchar({ length: 64 }),
	district: varchar({ length: 64 }),
	state: varchar({ length: 64 }),
	postalCode: varchar({ length: 32 }),
	email: varchar({ length: 128 }),
	phone: varchar({ length: 64 }),
	taxationType: taxationTypes(),
	taxationId: varchar({ length: 64 }).unique(),
	isActive: boolean().notNull().default(false)
});
