import {
  purchaseInvoiceLineItems,
  purchaseInvoices,
  purchaseOrderLineItems,
  purchaseOrders,
  purchaseTerms
} from '$lib/schemas/app/purchase';
import { eq } from 'drizzle-orm';
import { DbError, type Driver } from '../accounting/accountingTypes';

import type { InvoiceData, OrderData, TermsData } from './tradeTypes';
import { accounts, vouchers } from '$lib/schemas/app/accounting';
import { createCrEntry, createDrEntry, createEntryReference } from '../accounting/script';
import { products, productStocks } from '$lib/schemas/app/inventory';
import { vendors } from '$lib/schemas/app/parties';

export async function createPurchaseterms(db: Driver, data: TermsData) {
  try {
    const purchaseTerm = await db
      .insert(purchaseTerms)
      .values({
        ...data
      })
      .returning();
    return {
      purchaseTerm,
      error: null
    };
  } catch (err) {
    return {
      purchaseTerm: null,
      error: err as DbError
    };
  }
}

export async function createPurchaseOrderLineItems(db: Driver, data: OrderData, orderId: number) {
  try {
    data.lineItems.forEach(async (item) => {
      await db.insert(purchaseOrderLineItems).values({ ...item, orderId });
    });
    return {
      lineItems: true,
      error: null
    };
  } catch (err) {
    return {
      lineItems: null,
      error: err as DbError
    };
  }
}

export async function createPurchaseOrder(db: Driver, data: OrderData) {
  try {
    const [purchaseOrder] = await db
      .insert(purchaseOrders)
      .values({
        number: data.number,
        date: data.date,
        vendorId: data.partyId,
        termsId: data.termsId
      })
      .returning();

    const { lineItems: _, error } = await createPurchaseOrderLineItems(db, data, purchaseOrder.id);

    if (error) {
      await db.delete(purchaseOrders).where(eq(purchaseOrders.id, purchaseOrder.id));
      throw error;
    }

    return {
      purchaseOrder,
      error: null
    };
  } catch (err) {
    return {
      purchaseOrder: null,
      error: err as DbError
    };
  }
}

export async function createPurchaseInvoiceLineItems(
  db: Driver,
  data: InvoiceData,
  invoiceId: number
) {
  try {
    data.lineItems.forEach(async (item) => {
      await db.insert(purchaseInvoiceLineItems).values({ ...item, invoiceId: invoiceId });
    });
    return {
      lineItems: true,
      error: null
    };
  } catch (err) {
    return {
      lineItems: null,
      error: err as DbError
    };
  }
}

export async function createPurchaseInvoiceEntries(
  db: Driver,
  data: InvoiceData,
  voucherId: number
) {
  try {
    const purchaseAmount = data.lineItems.reduce((a, b) => a + b.price * b.quantity, 0);
    const totalTaxAmount = data.lineItems.reduce((a, b) => a + b.taxAmount, 0);
    const discountAmount = data.lineItems.reduce((a, b) => a + b.discountAmount, 0);
    const discountAccount = await db.query.accounts.findFirst({
      where: eq(accounts.number, 403001)
    });
    const cashAccount = await db.query.accounts.findFirst({ where: eq(accounts.number, 101001) });
    const bankAccount = await db.query.accounts.findFirst({ where: eq(accounts.number, 102001) });
    const taxAccount = await db.query.accounts.findFirst({
      where: eq(accounts.number, data.taxType === 'inter' ? 111102 : 111102)
    });
    const partyAccount = await db.query.vendors
      .findFirst({
        where: eq(vendors.id, data.partyId!),
        with: { account: true }
      })
      .then((data) => data?.account);

    if (data.paymentType === 'Account' && !partyAccount) {
      throw new DbError('Party not found', '404', 'party');
    }

    if (!taxAccount) {
      throw new DbError('Taxation fault', '500', 'taxes');
    }

    const { entry: creditEntry, error: creditError } = await createCrEntry(db, {
      accountId:
        data.paymentType === 'Cash'
          ? cashAccount!.id
          : data.paymentType === 'Bank'
            ? bankAccount!.id
            : partyAccount!.id,
      voucherId: voucherId,
      amount: purchaseAmount
    });
    if (creditError) {
      throw creditError;
    }

    if (discountAmount > 0 && !discountAccount) {
      throw new DbError('Invalid discount account', '402', 'discount');
    }

    const { entry: discountEntry, error: discountError } = await createCrEntry(db, {
      accountId: discountAccount!.id,
      voucherId: voucherId,
      amount: discountAmount
    });

    if (discountError) {
      throw discountError;
    }

    if (totalTaxAmount > 0) {
      const { entry: taxEntry, error: taxError } = await createDrEntry(db, {
        voucherId: voucherId,
        accountId: taxAccount.id,
        amount: totalTaxAmount
      });
      if (taxError) {
        throw taxError;
      }

      await createEntryReference(db, {
        drEntryId: taxEntry.id,
        crEntryId: creditEntry.id
      });
    }
    data.lineItems.forEach(async (item) => {
      const product = await db.query.products.findFirst({ where: eq(products.id, item.productId) });

      if (!product) {
        throw new DbError('Product not found', '404', 'product');
      }

      const { entry: inventoryEntry, error: inventoryError } = await createDrEntry(db, {
        accountId: product.accountId,
        voucherId: voucherId,
        amount: item.price * item.quantity
      });

      if (inventoryError) {
        throw inventoryError;
      }

      await createEntryReference(db, { drEntryId: inventoryEntry.id, crEntryId: creditEntry?.id });

      if (discountEntry)
        await createEntryReference(db, {
          drEntryId: inventoryEntry.id,
          crEntryId: discountEntry.id
        });
    });

    return {
      entries: true,
      error: null
    };
  } catch (err) {
    return {
      entries: null,
      error: err as DbError
    };
  }
}

export async function createPurchaseStock(db: Driver, data: InvoiceData, invoiceId: number) {
  try {
    data.lineItems.forEach(async (item) => {
      await db.insert(productStocks).values({
        ...item,
        purchaseInvoiceId: invoiceId
      });
    });
    return {
      stocks: true,
      error: null
    };
  } catch (error) {
    return {
      stocks: null,
      error: error as DbError
    };
  }
}

export async function createPurchaseInvoice(db: Driver, data: InvoiceData) {
  try {
    const purchaseVouchers = await db.query.vouchers.findMany({
      where: eq(vouchers.voucherType, 'Purchase')
    });

    const [purchaseVoucher] = await db
      .insert(vouchers)
      .values({
        voucherDate: data.date,
        voucherType: 'Purchase',
        voucherNumber: purchaseVouchers.length + 1
      })
      .returning({ id: vouchers.id });

    const [purchaseInvoice] = await db
      .insert(purchaseInvoices)
      .values({
        ...data
      })
      .returning({ id: purchaseInvoices.id });

    const { lineItems: _, error: lineItemError } = await createPurchaseInvoiceLineItems(
      db,
      data,
      purchaseInvoice.id
    );
    if (lineItemError) {
      await db.delete(vouchers).where(eq(vouchers.id, purchaseVoucher.id));
      await db.delete(purchaseInvoices).where(eq(purchaseInvoices.id, purchaseInvoice.id));
      throw lineItemError;
    }

    const { entries: __, error: entriesError } = await createPurchaseInvoiceEntries(
      db,
      data,
      purchaseVoucher.id
    );
    if (entriesError) {
      await db.delete(vouchers).where(eq(vouchers.id, purchaseVoucher.id));
      await db.delete(purchaseInvoices).where(eq(purchaseInvoices.id, purchaseInvoice.id));
      throw entriesError;
    }

    const { stocks: ___, error } = await createPurchaseStock(db, data, purchaseInvoice.id);
    if (error) {
      await db.delete(vouchers).where(eq(vouchers.id, purchaseVoucher.id));
      await db.delete(purchaseInvoices).where(eq(purchaseInvoices.id, purchaseInvoice.id));
      throw error;
    }

    return {
      invoice: purchaseInvoice,
      error: null
    };
  } catch (error) {
    return {
      invoice: null,
      error: error as DbError
    };
  }
}
