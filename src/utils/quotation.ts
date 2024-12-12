import { PaymentTerms } from '../types';
import type { ValidityPeriod } from '../components/quotations/ValidityPeriodSelect';

export function calculateValidUntilDate(validityPeriod: ValidityPeriod): Date {
  const today = new Date();
  const validUntil = new Date(today);

  switch (validityPeriod) {
    case '1-week':
      validUntil.setDate(today.getDate() + 7);
      break;
    case '2-weeks':
      validUntil.setDate(today.getDate() + 14);
      break;
    case '1-month':
      validUntil.setMonth(today.getMonth() + 1);
      break;
  }

  return validUntil;
}

export function getPaymentTermsText(terms: PaymentTerms): string {
  switch (terms) {
    case 'prepayment':
      return 'Full payment required before delivery';
    case 'cod':
      return 'Cash on Delivery';
    case '7-days':
      return 'Payment within 7 days from invoice date';
    case '15-days':
      return 'Payment within 15 days from invoice date';
    case '30-days':
      return 'Payment within 30 days from invoice date';
  }
}

export function formatValidityPeriod(validityPeriod: ValidityPeriod): string {
  switch (validityPeriod) {
    case '1-week':
      return '1 Week';
    case '2-weeks':
      return '2 Weeks';
    case '1-month':
      return '1 Month';
  }
}