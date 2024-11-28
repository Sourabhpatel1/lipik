import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const accounts = await locals.db.query.accounts.findMany({
		with: {
			groupAccount: {
				with: {
					rootAccount: true
				}
			}
		}
	});
	const groupAccounts = await locals.db.query.groupAccounts.findMany();
	const rootAccounts = await locals.db.query.rootAccounts.findMany();
	return {
		accounts,
		groupAccounts,
		rootAccounts
	};
};
