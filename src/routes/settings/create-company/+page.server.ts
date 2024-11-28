import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newCompanySchema } from '$lib/zod/company';
import { fail, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/main';
import { companies } from '$lib/schemas/companies';
import { eq, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { seedAccounts } from '$lib/seeds/accounting/seed';
import { seedTaxes } from '$lib/seeds/taxes/seed';
import { seedUnits } from '$lib/seeds/inventory/seed';
import * as accountingSchema from '$lib/schemas/app/accounting';
import * as partiesSchema from '$lib/schemas/app/parties';
import * as inventorySchema from '$lib/schemas/app/inventory';
import * as purchaseSchema from '$lib/schemas/app/purchase';
import * as salesSchema from '$lib/schemas/app/sales';

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(newCompanySchema));
  return {
    form
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(newCompanySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    let activeCompany = false;

    const existingCompanies = await db.query.companies.findMany({
      where: or(
        eq(companies.name, form.data.name),
        eq(companies.taxationId, form.data.taxationId as string),
        eq(companies.isActive, true)
      )
    });

    if (existingCompanies.filter((c) => c.name === form.data.name).length > 0) {
      return message(form, {
        type: 'error',
        text: `A company with name ${form.data.name} already exists`
      });
    }

    if (
      existingCompanies.filter((c) => (c.taxationId ? c.taxationId : null === form.data.taxationId))
        .length > 0
    ) {
      return message(form, {
        type: 'error',
        text: `A company with ${form.data.taxationId} already exists`
      });
    }

    if (existingCompanies.filter((c) => c.isActive).length > 0) {
      activeCompany = true;
    }

    try {
      const [company] = await db
        .insert(companies)
        .values({
          name: form.data.name,
          dbUrl: form.data.name.toLowerCase().trim().replace(' ', '') + '.db',
          financialYearStart: form.data.financilaYearStart,
          email: form.data.email,
          phone: form.data.phone,
          address: form.data.address,
          city: form.data.city,
          district: form.data.district,
          state: form.data.state,
          postalCode: form.data.postalCode,
          taxationType: form.data.taxationtype,
          taxationId: form.data.taxationId,
          isActive: !activeCompany
        })
        .returning();
      locals.currentCompany = company;
      const appDb = drizzle(company.dbUrl, {
        schema: { ...accountingSchema, ...partiesSchema, ...inventorySchema, ...purchaseSchema, ...salesSchema },
        casing: 'snake_case'
      });
      await migrate(appDb, { migrationsFolder: 'app-drizzle' });
      locals.db = appDb;
      await seedAccounts(appDb);
      await seedUnits(appDb);
      await seedTaxes(appDb)
      return message(form, { type: 'success', text: 'Company created succesfully' });
    } catch (err) {
      console.log(err);
      return message(form, {
        type: 'error',
        text: 'Failed to add new company due to an internal server error'
      });
    }
  }
};
