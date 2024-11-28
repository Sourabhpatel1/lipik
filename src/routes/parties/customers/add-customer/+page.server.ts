import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newPartySchema } from '$lib/zod/parties';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createCustomer } from '$lib/dbUtils/parties/script';
import { accounts } from '$lib/schemas/app/accounting';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(zod(newPartySchema));
	const customerAccounts = await locals.db.query.accounts.findMany({
		where: eq(accounts.groupId, 110000)
	});
	return {
		form,
		accounts: customerAccounts
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, zod(newPartySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { customer: _, error } = await createCustomer(locals.db, { ...form.data });

		if (error) {
			console.log(error);
			if (error.code === '23505') {
				return message(form, {
					type: 'error',
					text: `A customer with taxation id ${form.data.taxationId} already exists, please enter a different customer taxation id and try again.`
				});
			}
			return message(form, { type: 'error', text: 'Failed to create Customer' });
		}

		return message(form, { type: 'success', text: 'Customer created succesfully.' });
	}
};
