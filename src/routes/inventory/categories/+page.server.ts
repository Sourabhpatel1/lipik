import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const categories = await locals.db.query.categories.findMany({ with: { products: { with: { unit: true } } } });
  return {
    categories
  }
}
