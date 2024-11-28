import type { Driver } from '$lib/dbUtils/accounting/accountingTypes';
import * as seedData from './schema.json';
import { createTax } from '$lib/dbUtils/accounting/script';

export async function seedTaxes(db: Driver) {
  console.log('Seeding Taxes ...');
  for (const tax of seedData.gstTaxes) {
    const { tax: newTax, error } = await createTax(db, {
      rate: tax.rate,
      name: tax.name
    })
    if (error) {
      console.log(error)
    }
    console.log(newTax)
  }
  console.log('Finished');
}
