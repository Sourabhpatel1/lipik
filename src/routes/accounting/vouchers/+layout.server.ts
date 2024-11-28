import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const vouchers = await locals.db.query.vouchers.findMany({
		with: {
			drEntries: {
				with: {
					account: true
				}
			},
			crEntries: {
				with: {
					account: true
				}
			}
		}
	});
	return {
		vouchers,
		companyName: locals.currentCompany.name
	};
};
