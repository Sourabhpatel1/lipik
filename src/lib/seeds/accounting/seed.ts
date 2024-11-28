import {
  createRootAccount,
  createGroupAccount,
  createAccount
} from '$lib/dbUtils/accounting/script';
import seedData from './schema.json';
import type { Driver } from '$lib/dbUtils/accounting/accountingTypes';

export async function seedAccounts(db: Driver) {
  console.log('Seeding...');
  for (const rootAccount of seedData.rootAccounts) {
    await createRootAccount(db, rootAccount);
  }
  for (const groupAccount of seedData.groupAccounts) {
    await createGroupAccount(db, groupAccount);
  }

  for (const account of seedData.accounts) {
    await createAccount(db, account);
  }
  console.log('Finished');
}
