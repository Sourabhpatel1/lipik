import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newPartySchema } from '$lib/zod/parties';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createVendor } from '$lib/dbUtils/parties/script';
import { eq } from 'drizzle-orm';
import { accounts } from '$lib/schemas/app/accounting';

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(zod(newPartySchema));
	const vendorAccounts = await locals.db.query.accounts.findMany({
		where: eq(accounts.groupId, 201000)
	});
	return {
		form,
		accounts: vendorAccounts
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, zod(newPartySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { vendor: _, error } = await createVendor(locals.db, { ...form.data });

		if (error) {
			console.log(error);
			if (error.code === '23505') {
				return message(form, {
					type: 'error',
					text: `A vendor with taxation id ${form.data.taxationId} already exists, please enter a different customer taxation id and try again.`
				});
			}
			return message(form, { type: 'error', text: 'Failed to create vendor' });
		}

		return message(form, { type: 'success', text: 'Vendor created succesfully.' });
	}
};
