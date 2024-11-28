import { fail, message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newProductSchema } from '$lib/zod/inventory';
import type { Actions } from '@sveltejs/kit';
import { createProduct } from '$lib/dbUtils/inventory/script';
import { accounts } from '$lib/schemas/app/accounting';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  const form = await superValidate(zod(newProductSchema));
  const taxes = await locals.db.query.salesTaxes.findMany();
  const categories = await locals.db.query.categories.findMany();
  const inventoryAccounts = await locals.db.query.accounts.findMany({
    where: eq(accounts.groupId, 103100)
  });
  const units = await locals.db.query.unitOfMeasurements.findMany();
  return {
    form,
    taxes,
    inventoryAccounts,
    categories,
    units
  };
};

export const actions: Actions = {
  default: async ({ locals, request }) => {
    const form = await superValidate(request, zod(newProductSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const { product: _, error } = await createProduct(locals.db, { ...form.data });
    if (error) {
      return message(form, { type: 'error', text: 'Failed to add product' });
    }
    return message(form, { type: 'success', text: 'Product added succesfully' });
  }
};
