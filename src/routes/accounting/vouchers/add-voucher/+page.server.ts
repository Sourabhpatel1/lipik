import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newVoucherSchema } from '$lib/zod/accounting';
import { fail } from '@sveltejs/kit';
import {
	createEntryReference,
	createVoucher,
	createDrEntry,
	createCrEntry,
	updateAccountBalance
} from '$lib/dbUtils/accounting/script';
import { eq } from 'drizzle-orm';
import { crEntries, drEntries, vouchers } from '$lib/schemas/app/accounting';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(newVoucherSchema));
	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, zod(newVoucherSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { error, voucher } = await createVoucher(locals.db, form.data);
		if (error) {
			return message(form, { type: 'error', text: error.constraint + ' : ' + error.code });
		}
		form.data.entries.forEach(async (e) => {
			if (e.entryType === 'dr') {
				const { entry: _, error } = await createDrEntry(locals.db, { ...e, voucherId: voucher.id });
				const { updatedAccount: __, error: updateError } = await updateAccountBalance(locals.db, e);
				if (error || updateError) {
					await locals.db.delete(vouchers).where(eq(vouchers.id, voucher.id));
					return message(form, { type: 'error', text: 'Entry error' });
				}
			}
			if (e.entryType === 'cr') {
				const { entry: _, error } = await createCrEntry(locals.db, { ...e, voucherId: voucher.id });
				const { updatedAccount: __, error: updateError } = await updateAccountBalance(locals.db, e);
				if (error || updateError) {
					await locals.db.delete(vouchers).where(eq(vouchers.id, voucher.id));
					return message(form, { type: 'error', text: 'Entry error' });
				}
			}
		});

		const debits = await locals.db.query.drEntries.findMany({
			where: eq(drEntries.voucherId, voucher.id)
		});
		const credits = await locals.db.query.crEntries.findMany({
			where: eq(crEntries.voucherId, voucher.id)
		});

		if (debits.length < 1 || credits.length < 1) {
			await locals.db.delete(vouchers).where(eq(vouchers.id, voucher.id));
			return message(form, { type: 'error', text: 'timing error' });
		}

		debits.forEach((d) => {
			credits.forEach(async (c) => {
				const { reference: _, error } = await createEntryReference(locals.db, {
					drEntryId: d.id,
					crEntryId: c.id
				});
				if (error) {
					await locals.db.delete(vouchers).where(eq(vouchers.id, voucher.id));
					return message(form, { type: 'error', text: 'Reference error' });
				}
			});
		});

		return message(form, { type: 'success', text: 'Voucher created succesfully' });
	}
};
