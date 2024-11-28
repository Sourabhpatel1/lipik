import { fail, message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newCatrgorySchema } from '$lib/zod/inventory';
import type { Actions } from '@sveltejs/kit';
import { createCategory } from '$lib/dbUtils/inventory/script';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(newCatrgorySchema));
	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await superValidate(request, zod(newCatrgorySchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { category: _, error } = await createCategory(locals.db, { ...form.data });
		if (error) {
			return message(form, { type: 'error', text: 'failed to add category' });
		}
		return message(form, { type: 'success', text: 'Category added successfully' });
	}
};
