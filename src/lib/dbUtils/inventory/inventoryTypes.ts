export interface UnitData {
  name: string;
  symbol: string;
}

export interface ProductCategoryData {
  name: string;
  description?: string | undefined;
}

export interface ProductData {
  name: string;
  unitId: number;
  accountId: number;
  taxId: number;
  categoryId?: number | undefined;
  description?: string | undefined;
  listPrice?: number | undefined;
  purchasePrice?: number | undefined;
  salePrice?: number | undefined;
}

export interface ServiceData {
  name: string;
  accountId: number;
  taxId: number;
  description?: string | undefined;
}
