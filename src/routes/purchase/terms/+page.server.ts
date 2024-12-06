import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const terms = await locals.db.query.purchaseTerms.findMany();
	return {
		terms
	};
};
