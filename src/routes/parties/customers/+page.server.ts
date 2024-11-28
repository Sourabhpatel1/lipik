import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const customers = await locals.db.query.customers.findMany({
		with: {
			account: true
		}
	});
	return {
		customers
	};
};
