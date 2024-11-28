import { categories, products, services, unitOfMeasurements } from '$lib/schemas/app/inventory';
import type { DbError, Driver } from '../accounting/accountingTypes';
import type { ProductCategoryData, ProductData, ServiceData, UnitData } from './inventoryTypes';

export async function createUnitOfMeasurements(db: Driver, data: UnitData) {
	try {
		const unit = await db
			.insert(unitOfMeasurements)
			.values({ ...data })
			.returning();
		return {
			unit,
			error: null
		};
	} catch (err) {
		return {
			unit: null,
			error: err as DbError
		};
	}
}

export async function createCategory(db: Driver, data: ProductCategoryData) {
	try {
		const category = await db
			.insert(categories)
			.values({
				name: data.name,
				description: data.description
			})
			.returning();
		return {
			category,
			error: null
		};
	} catch (err) {
		return {
			category: null,
			error: err as DbError
		};
	}
}

export async function createProduct(db: Driver, data: ProductData) {
	try {
		const product = await db
			.insert(products)
			.values({
				...data
			})
			.returning();
		return {
			product,
			error: null
		};
	} catch (error) {
		return {
			product: null,
			error: error as DbError
		};
	}
}

export async function createService(db: Driver, data: ServiceData) {
	try {
		const service = await db
			.insert(services)
			.values({ ...data })
			.returning();
		return {
			service,
			error: null
		};
	} catch (error) {
		return {
			service: null,
			error: error as DbError
		};
	}
}
