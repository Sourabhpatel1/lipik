import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newCompanySchema } from '$lib/zod/company';
import { eq } from 'drizzle-orm';
import { companies } from '$lib/schemas/companies';
import { db } from '$lib/server/main';

export const load: PageServerLoad = async ({ locals }) => {
	const activeCompany = locals.currentCompany;
	const form = await superValidate(zod(newCompanySchema));
	form.data.name = activeCompany.name;
	form.data.phone = activeCompany.phone ?? undefined;
	form.data.email = activeCompany.email ?? undefined;
	form.data.taxationtype = activeCompany.taxationType as 'GST';
	form.data.taxationId = activeCompany.taxationId ?? undefined;
	form.data.address = activeCompany.address ?? undefined;
	form.data.city = activeCompany.city ?? undefined;
	form.data.district = activeCompany.district ?? undefined;
	form.data.state = activeCompany.state ?? undefined;
	form.data.postalCode = activeCompany.postalCode ?? undefined;
	return { activeCompany, form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(newCompanySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const [activeCompany] = await db
				.update(companies)
				.set({
					name: form.data.name,
					financialYearStart: form.data.financilaYearStart,
					email: form.data.email,
					phone: form.data.phone,
					address: form.data.address,
					city: form.data.city,
					district: form.data.district,
					state: form.data.state,
					postalCode: form.data.postalCode,
					taxationType: form.data.taxationtype,
					taxationId: form.data.taxationId
				})
				.where(eq(companies.id, locals.currentCompany.id))
				.returning();
			form.data.name = activeCompany.name;
			form.data.phone = activeCompany.phone ?? undefined;
			form.data.email = activeCompany.email ?? undefined;
			form.data.taxationtype = activeCompany.taxationType as 'GST';
			form.data.taxationId = activeCompany.taxationId ?? undefined;
			form.data.address = activeCompany.address ?? undefined;
			form.data.city = activeCompany.city ?? undefined;
			form.data.district = activeCompany.district ?? undefined;
			form.data.state = activeCompany.state ?? undefined;
			form.data.postalCode = activeCompany.postalCode ?? undefined;
			return message(form, { type: 'success', text: 'Company updated succesfully' });
		} catch (err) {
			console.log(err);
			return message(form, {
				type: 'error',
				text: 'Failed to update company due to an internal server error'
			});
		}
	}
};
