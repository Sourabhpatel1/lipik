import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { newOrderSchema } from "$lib/zod/trade";

export const load: PageServerLoad = async ({ locals }) => {
  const po = await locals.db.query.purchaseOrders.findMany()
  const vendors = await locals.db.query.vendors.findMany()
  const form = await superValidate(zod(newOrderSchema))
  return {
    po,
    company: locals.currentCompany,
    vendors,
    form
  }
}
