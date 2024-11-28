import type { PgliteDatabase } from 'drizzle-orm/pglite';
import type { companies } from '$lib/schemas/companies';
import * as accountingSchema from '$lib/schemas/app/accounting';
import * as partiesSchema from '$lib/schemas/app/parties';
import * as inventorySchema from '$lib/schemas/app/inventory';
import * as purchaseSchema from '$lib/schemas/app/purchase';
import * as salesSchema from '$lib/schemas/app/sales'

declare global {
  namespace App {
    interface Locals {
      db: PgliteDatabase<
        typeof accountingSchema &
        typeof partiesSchema &
        typeof inventorySchema &
        typeof purchaseSchema &
        typeof salesSchema
      >;
      currentCompany: typeof companies.$inferSelect;
    }
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
