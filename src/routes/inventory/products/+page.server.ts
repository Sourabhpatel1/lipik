import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const products = await locals.db.query.products.findMany({
    with: {
      category: true,
      unit: true,
      stocks: true,
      account: true,
    }
  });
  return {
    products
  }
}
