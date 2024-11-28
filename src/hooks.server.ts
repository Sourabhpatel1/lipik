import { redirect, type Handle } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/pglite';
import { db, mainMigration } from '$lib/server/main';
import * as accountingSchema from '$lib/schemas/app/accounting';
import * as partiesSchema from '$lib/schemas/app/parties';
import * as inventorySchema from '$lib/schemas/app/inventory';
import * as purchaseSchema from '$lib/schemas/app/purchase'
import * as salesSchema from '$lib/schemas/app/sales'

export const handle: Handle = async ({ event, resolve }) => {
  await mainMigration();

  const companies = await db.query.companies.findMany();

  if (!companies.length && !event.url.pathname.includes('/settings/create-company')) {
    return redirect(307, '/settings/create-company');
  }

  const selectedCompany = companies.find((c) => c.isActive);

  if (selectedCompany) {
    event.locals.currentCompany = selectedCompany;
  }

  if (
    companies.length &&
    !selectedCompany &&
    !event.url.pathname.includes('/settings/select-company')
  ) {
    return redirect(307, '/settings/select-company');
  }

  if (!event.locals.db && selectedCompany) {
    event.locals.db = drizzle(selectedCompany.dbUrl, {
      schema: { ...accountingSchema, ...partiesSchema, ...inventorySchema, ...purchaseSchema, ...salesSchema },
      casing: 'snake_case'
    });
  }

  return await resolve(event);
};
