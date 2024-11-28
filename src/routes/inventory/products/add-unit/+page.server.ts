import { fail, message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newUOMSchema } from '$lib/zod/inventory';
import type { Actions } from '@sveltejs/kit';
import { createUnitOfMeasurements } from '$lib/dbUtils/inventory/script';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(newUOMSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(newUOMSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}
		const { unit: _, error } = await createUnitOfMeasurements(locals.db, { ...form.data });
		if (error) {
			return message(form, { type: 'error', text: 'Failed to add new unit' });
		}
		return message(form, { type: 'success', text: 'New unit added succesfully' });
	}
};
