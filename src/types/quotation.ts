import type { Customer } from './customer';
import type { ValidityPeriod } from '../components/quotations/ValidityPeriodSelect';

export type PaymentTerms = 'prepayment' | 'cod' | '7-days' | '15-days' | '30-days';

export interface QuotationSender {
  name: string;
  email: string;
  phone: string;
}

export interface QuotationItem {
  itemCode: string;
  description: string;
  listPrice: number;
  quotePrice: number;
  discount: number;
}

export interface Quotation {
  id: string;
  customer: Customer;
  items: QuotationItem[];
  date: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  paymentTerms: PaymentTerms;
  validityPeriod: ValidityPeriod;
}

export interface SavedQuotation extends Quotation {
  sender: QuotationSender | null;
}