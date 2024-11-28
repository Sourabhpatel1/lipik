import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const taxes = await locals.db.query.salesTaxes.findMany();
  return {
    taxes
  };
};
