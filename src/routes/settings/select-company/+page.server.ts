import { db } from '$lib/server/main';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { companies } from '$lib/schemas/companies';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import * as accountingSchema from '$lib/schemas/app/accounting';

export const load: PageServerLoad = async () => {
	const companies = await db.query.companies.findMany();
	return { companies };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		if (!id) {
			return {
				message: 'Failed to get id'
			};
		}
		await db.update(companies).set({ isActive: false });
		const [newCompany] = await db
			.update(companies)
			.set({ isActive: true })
			.where(eq(companies.id, parseInt(id as string)))
			.returning();

		locals.db = drizzle(newCompany.name.toLowerCase().trim().replace(' ', '') + '.db', {
			schema: { ...accountingSchema },
			casing: 'snake_case'
		});

		return {
			message: newCompany.name + 'is now active'
		};
	}
};
