import * as accountingSchema from '$lib/schemas/app/accounting';
import * as inventorySchema from '$lib/schemas/app/inventory';
import * as partiesSchema from '$lib/schemas/app/parties';
import * as purchaseSchema from '$lib/schemas/app/purchase';
import * as salesSchema from '$lib/schemas/app/sales';

import type { PgliteDatabase } from 'drizzle-orm/pglite';

type VoucherTypes = [
  'Journal',
  'Cash',
  'Bank',
  'Contra',
  'Debit Note',
  'Credit Note',
  'Sales',
  'Purchase',
  'Sales Return',
  'Purchase Return',
  'Depriciation'
][number];

export class DbError extends Error {
  constructor(message: string, code: string, constraint: string) {
    super(message);
    this.code = code;
    this.constraint = constraint;
  }
  code?: string;
  constraint?: string;
}

export interface RootAccountData {
  id: number;
  name: string;
}

export interface GroupAccountData {
  id: number;
  rootId: number;
  name: string;
}

export interface AccountData {
  name: string;
  number: number;
  groupId: number;
}

export interface TaxData {
  name: string;
  rate: number;
}

export interface VoucherData {
  voucherType: VoucherTypes;
  voucherNumber: number;
  voucherDate: string;
}

export interface EntryData {
  voucherId: number;
  accountId: number;
  amount: number;
}

export interface ReferenceData {
  drEntryId: number;
  crEntryId: number;
}

export interface BalanceUpdateData {
  accountId: number;
  amount: number;
  entryType: 'dr' | 'cr';
}

export type Driver = PgliteDatabase<typeof accountingSchema & typeof partiesSchema & typeof inventorySchema & typeof purchaseSchema & typeof salesSchema>;
