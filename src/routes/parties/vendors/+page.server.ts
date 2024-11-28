import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const vendors = await locals.db.query.vendors.findMany({
		with: {
			account: true
		}
	});
	return {
		vendors
	};
};
