import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { newAccountSchema } from '$lib/zod/accounting';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { createAccount } from '$lib/dbUtils/accounting/script';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(newAccountSchema));
	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(newAccountSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { account, error } = await createAccount(locals.db, {
			name: form.data.name,
			number: form.data.number,
			groupId: form.data.groupId
		});

		if (error) {
			console.log(error);
			if (error.code === '23505') {
				return message(form, {
					type: 'error',
					text: `An account with name ${form.data.name} or number ${form.data.number} already exists in your chart of accounts`
				});
			}
			return message(form, {
				type: 'error',
				text: 'Could not create account due to an internal server error.'
			});
		}
		return message(form, {
			type: 'success',
			text: `Account ${account.name} has been added to your chart of accounts`
		});
	}
};
