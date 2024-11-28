import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './main-drizzle',
	schema: './src/lib/schemas/companies.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: './main.db'
	},
	casing: 'snake_case',
	driver: 'pglite'
});
