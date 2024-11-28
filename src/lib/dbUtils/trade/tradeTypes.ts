export interface LineItems {
  productId: number
  taxId: number
  price: number
  quantity: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}
export interface OrderData {
  partyId: number
  termsId?: number
  date: string
  number: number
  lineItems: LineItems[]
}
export interface InvoiceData {
  orderId?: number;
  partyId?: number;
  paymentType: 'Cash' | 'Bank' | 'Account';
  taxType: 'inter' | 'intra';
  termsId?: number;
  date: string;
  number: number;
  lineItems: LineItems[]
}

export interface TermsData {
  title: string,
  condition: string
}
