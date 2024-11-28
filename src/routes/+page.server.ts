import type { PageServerLoad } from './$types';
import { db } from '$lib/server/main';
import { eq } from 'drizzle-orm';
import { companies } from '$lib/schemas/companies';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.db) {
		return redirect(307, '/settings/select-company');
	}
	const accounts = await locals.db.query.accounts.findMany();
	const selectedCompany = await db.query.companies.findFirst({
		where: eq(companies.isActive, true)
	});

	return {
		accounts,
		selectedCompany
	};
};
