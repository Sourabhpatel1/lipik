import {
  DbError,
  type AccountData,
  type BalanceUpdateData,
  type Driver,
  type EntryData,
  type GroupAccountData,
  type ReferenceData,
  type RootAccountData,
  type TaxData,
  type VoucherData
} from './accountingTypes';
import * as accountingSchema from '$lib/schemas/app/accounting';
import { eq } from 'drizzle-orm';

export async function createRootAccount(db: Driver, data: RootAccountData) {
  try {
    const [rootAccount] = await db
      .insert(accountingSchema.rootAccounts)
      .values({
        id: data.id,
        name: data.name
      })
      .returning();
    return { rootAccount, error: null };
  } catch (err) {
    return { rootAccount: null, error: err as DbError };
  }
}

export async function createGroupAccount(db: Driver, data: GroupAccountData) {
  try {
    const [groupAccount] = await db
      .insert(accountingSchema.groupAccounts)
      .values({
        id: data.id,
        rootId: data.rootId,
        name: data.name
      })
      .returning();
    return { groupAccount, error: null };
  } catch (err) {
    return { groupAccount: null, error: err as DbError };
  }
}

export async function createAccount(db: Driver, data: AccountData) {
  try {
    const [account] = await db
      .insert(accountingSchema.accounts)
      .values({
        name: data.name,
        number: data.number,
        groupId: data.groupId
      })
      .returning();
    return { account, error: null };
  } catch (err) {
    return { account: null, error: err as DbError };
  }
}

export async function createTax(db: Driver, data: TaxData) {
  try {
    const [tax] = await db
      .insert(accountingSchema.salesTaxes)
      .values({
        name: data.name,
        rate: data.rate
      })
      .returning();
    return { tax, error: null };
  } catch (err) {
    return { tax: null, error: err as DbError };
  }
}

export async function createVoucher(db: Driver, data: VoucherData) {
  try {
    const [voucher] = await db
      .insert(accountingSchema.vouchers)
      .values({
        voucherType: data.voucherType,
        voucherNumber: data.voucherNumber,
        voucherDate: data.voucherDate
      })
      .returning();
    return { voucher, error: null };
  } catch (err) {
    return { voucher: null, error: err as DbError };
  }
}

export async function createDrEntry(db: Driver, data: EntryData) {
  try {
    const [entry] = await db
      .insert(accountingSchema.drEntries)
      .values({
        voucherId: data.voucherId,
        accountId: data.accountId,
        amount: data.amount
      })
      .returning()
      .then((a) => a);
    return { entry, error: null };
  } catch (err) {
    return { entry: null, error: err as DbError };
  }
}

export async function createCrEntry(db: Driver, data: EntryData) {
  try {
    const [entry] = await db
      .insert(accountingSchema.crEntries)
      .values({
        voucherId: data.voucherId,
        accountId: data.accountId,
        amount: data.amount
      })
      .returning()
      .then((a) => a);
    return { entry, error: null };
  } catch (err) {
    return { entry: null, error: err as DbError };
  }
}

export async function createEntryReference(db: Driver, data: ReferenceData) {
  try {
    const [reference] = await db
      .insert(accountingSchema.entryReferences)
      .values({
        drEntryId: data.drEntryId,
        crEntryId: data.crEntryId
      })
      .returning();
    return { reference, error: null };
  } catch (err) {
    return { reference: null, error: err as DbError };
  }
}

export async function updateAccountBalance(db: Driver, data: BalanceUpdateData) {
  try {
    const account = await db.query.accounts.findFirst({
      where: eq(accountingSchema.accounts.id, data.accountId)
    });
    if (!account) {
      return {
        updatedAccount: null,
        error: new DbError('Not found', '404', 'account')
      };
    }
    const balance = data.entryType === 'dr' ? data.amount : -1 * data.amount;
    const updatedAccount = await db
      .update(accountingSchema.accounts)
      .set({ currentBalance: account.currentBalance + balance })
      .where(eq(accountingSchema.accounts.id, account.id))
      .returning();

    return {
      updatedAccount,
      error: null
    };
  } catch (err) {
    return {
      updatedAccount: null,
      error: err as DbError
    };
  }
}
