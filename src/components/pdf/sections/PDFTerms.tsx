import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles/pdfStyles';
import type { PaymentTerms } from '../../../types';

interface PDFTermsProps {
  paymentTerms: PaymentTerms;
  validityPeriod: string;
}

export function PDFTerms({ paymentTerms, validityPeriod }: PDFTermsProps) {
  return (
    <View style={pdfStyles.terms}>
      <View style={pdfStyles.termsSection}>
        <Text style={pdfStyles.termsTitle}>Selling Conditions:</Text>
        <View style={pdfStyles.termsList}>
          <Text style={pdfStyles.termsItem}>• Quotation valid for {validityPeriod}</Text>
          <Text style={pdfStyles.termsItem}>• Prices are exclusive of VAT</Text>
          <Text style={pdfStyles.termsItem}>• Minimum order quantity may apply</Text>
          <Text style={pdfStyles.termsItem}>• Delivery time subject to stock availability</Text>
        </View>
      </View>

      <View style={pdfStyles.termsSection}>
        <Text style={[pdfStyles.termsTitle, { textAlign: 'right' }]}>
          Payment Terms:
        </Text>
        <View style={pdfStyles.termsList}>
          <Text style={[pdfStyles.termsItem, { textAlign: 'right' }]}>
            • {getPaymentTermsText(paymentTerms)}
          </Text>
          <Text style={[pdfStyles.termsItem, { textAlign: 'right' }]}>
            • Bank transfer or company check accepted
          </Text>
        </View>
      </View>
    </View>
  );
}

function getPaymentTermsText(terms: PaymentTerms): string {
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