import { drizzle } from 'drizzle-orm/pglite';
import * as schema from '$lib/schemas/companies';
import { migrate } from 'drizzle-orm/pglite/migrator';

export const db = drizzle('main.db', { schema, casing: 'snake_case' });

export async function mainMigration() {
	try {
		await migrate(db, { migrationsFolder: 'main-drizzle' });
		return db;
	} catch (error) {
		console.error(error);
	}
}
