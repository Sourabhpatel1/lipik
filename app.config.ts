import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './app-drizzle',
	schema: './src/lib/schemas/app/*.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: './sourabhpatel.db'
	},
	casing: 'snake_case',
	driver: 'pglite'
});
