import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newTaxSchema } from '$lib/zod/accounting';
import { fail, type Actions } from '@sveltejs/kit';
import { createTax } from '$lib/dbUtils/accounting/script';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(newTaxSchema));
	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, zod(newTaxSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { tax: _, error } = await createTax(locals.db, form.data);
		if (error) {
			if (error.code === '23505') {
				if (error.constraint?.includes('name')) {
					return message(form, {
						type: 'error',
						text: `A tax with name ${form.data.name} already exits`
					});
				}
			}
			console.error(error);
			return message(form, { type: 'error', text: 'Failed to create tax due to an unknown error' });
		}
		return message(form, { type: 'success', text: `Tax ${form.data.name} created succesfully` });
	}
};
