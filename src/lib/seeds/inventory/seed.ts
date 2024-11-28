import type { Driver } from '$lib/dbUtils/accounting/accountingTypes';
import { createUnitOfMeasurements } from '$lib/dbUtils/inventory/script';
import * as seedData from './schema.json';
export async function seedUnits(db: Driver) {
	console.log('Seeding Units ...');
	for (const unit of seedData.unitOfMeasurements) {
		await createUnitOfMeasurements(db, { name: unit.name, symbol: unit.symbol as string });
	}
	console.log('Finished');
}
