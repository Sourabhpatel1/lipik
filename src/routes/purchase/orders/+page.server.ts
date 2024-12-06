import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const orders = await locals.db.query.purchaseOrders
    .findMany({
      with: {
        vendor: true,
        lineItems: true
      }
    })
    .then((data) =>
      data.map((d) => ({ ...d, total: d.lineItems.reduce((a, b) => a + b.total, 0) }))
    );
  return { orders };
};
