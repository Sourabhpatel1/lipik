import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { accounts } from '$lib/schemas/app/accounting';

export const load: PageServerLoad = async ({ locals, params }) => {
	const id = parseInt(params.id);

	if (!id) {
		return redirect(307, '/accounting/chart-of-accounts');
	}

	const [account] = await locals.db.query.accounts.findMany({
		where: eq(accounts.id, parseInt(params.id)),
		with: {
			groupAccount: {
				with: {
					rootAccount: true
				}
			},
			drEntries: {
				columns: { amount: true, accountId: true },
				with: {
					voucher: true,
					references: {
						columns: {},
						with: {
							crEntry: {
								with: {
									account: true
								}
							}
						}
					}
				}
			},
			crEntries: {
				columns: { amount: true, accountId: true },
				with: {
					voucher: true,
					references: {
						columns: {},
						with: {
							drEntry: {
								with: {
									account: true
								}
							}
						}
					}
				}
			}
		}
	});
	let ledger: {
		voucherId: number;
		voucherDate: string;
		voucherType: string;
		voucherNumber: number;
		account: string;
		amount: number;
		entryType: 'dr' | 'cr';
	}[] = [];
	account.drEntries.forEach((e) => {
		e.references.forEach((r) => {
			ledger.push({
				voucherId: e.voucher.id,
				voucherDate: e.voucher.voucherDate,
				voucherType: e.voucher.voucherType,
				voucherNumber: e.voucher.voucherNumber,
				account: r.crEntry.account.name,
				amount: e.amount < r.crEntry.amount ? e.amount : r.crEntry.amount,
				entryType: 'dr'
			});
		});
	});
	account.crEntries.forEach((e) => {
		e.references.forEach((r) => {
			ledger.push({
				voucherId: e.voucher.id,
				voucherDate: e.voucher.voucherDate,
				voucherType: e.voucher.voucherType,
				voucherNumber: e.voucher.voucherNumber,
				account: r.drEntry.account.name,
				amount: e.amount < r.drEntry.amount ? e.amount : r.drEntry.amount,
				entryType: 'cr'
			});
		});
	});
	return {
		ledger,
		account: account,
		company: locals.currentCompany
	};
};

export const actions: Actions = {
	disable: async ({ locals, params }) => {
		if (!params.id) {
			return fail(400, {
				message: 'Account not found'
			});
		}
		await locals.db
			.update(accounts)
			.set({ isDisable: true })
			.where(eq(accounts.id, parseInt(params.id)));
		return {
			message: 'Account disabled'
		};
	},
	enable: async ({ locals, params }) => {
		if (!params.id) {
			return fail(400, {
				message: 'Account not found'
			});
		}
		await locals.db
			.update(accounts)
			.set({ isDisable: false })
			.where(eq(accounts.id, parseInt(params.id)));
		return {
			message: 'Account disabled'
		};
	}
};
