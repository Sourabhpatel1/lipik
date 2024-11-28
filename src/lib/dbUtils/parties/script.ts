import { customers, vendors } from '$lib/schemas/app/parties';
import type { DbError, Driver } from '../accounting/accountingTypes';
import type { PartyData } from './partyTypes';

export async function createCustomer(db: Driver, data: PartyData) {
	try {
		const [customer] = await db
			.insert(customers)
			.values({
				...data
			})
			.returning();
		return {
			customer,
			error: null
		};
	} catch (error) {
		return {
			customer: null,
			error: error as DbError
		};
	}
}

export async function createVendor(db: Driver, data: PartyData) {
	try {
		const [vendor] = await db
			.insert(vendors)
			.values({
				...data
			})
			.returning();
		return {
			vendor,
			error: null
		};
	} catch (error) {
		return {
			vendor: null,
			error: error as DbError
		};
	}
}
