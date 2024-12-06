import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newOrderSchema } from '$lib/zod/trade';
import { fail, type Actions } from '@sveltejs/kit';
import { createPurchaseOrder } from '$lib/dbUtils/trade/purchase-script';

export const load: PageServerLoad = async ({ locals }) => {
	const po = await locals.db.query.purchaseOrders.findMany();
	const vendors = await locals.db.query.vendors.findMany();
	const products = await locals.db.query.products.findMany({ with: { unit: true, tax: true } });
	const taxes = await locals.db.query.salesTaxes.findMany();
	const form = await superValidate(zod(newOrderSchema));

	return {
		po,
		company: locals.currentCompany,
		vendors,
		products,
		taxes,
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(newOrderSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { purchaseOrder: _, error } = await createPurchaseOrder(locals.db, form.data);
		if (error) {
			return message(form, { type: 'error', text: 'Failed to create purchase order' + error.code });
		}
		return message(form, { type: 'success', text: 'Purchase order created successfully' });
	}
};
