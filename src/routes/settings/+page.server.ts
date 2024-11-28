import { db } from '$lib/server/main';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';
import { companies } from '$lib/schemas/companies';

export const load: PageServerLoad = async () => {
	const company = await db.query.companies.findFirst({
		where: eq(companies.isActive, true)
	});
	return {
		company
	};
};
