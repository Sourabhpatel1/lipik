import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newTermsSchema } from '$lib/zod/common';
import { fail, type Actions } from '@sveltejs/kit';
import { createPurchaseterms } from '$lib/dbUtils/trade/purchase-script';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(newTermsSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(newTermsSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { purchaseTerm: _, error } = await createPurchaseterms(locals.db, form.data);
		if (error) {
			return message(
				form,
				{ type: 'error', text: 'Failed to create purchase terms and conditions' },
				{ status: 402 }
			);
		}
		return message(form, { text: 'Purchase term created succesfully', type: 'success' });
	}
};
