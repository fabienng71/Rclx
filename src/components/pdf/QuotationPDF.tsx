import React from 'react';
import { Document, Page, Font } from '@react-pdf/renderer';
import { PDFHeader } from './sections/PDFHeader';
import { PDFCustomerInfo } from './sections/PDFCustomerInfo';
import { PDFItemsTable } from './sections/PDFItemsTable';
import { PDFTerms } from './sections/PDFTerms';
import { PDFFooter } from './sections/PDFFooter';
import { pdfStyles } from './styles/pdfStyles';
import type { Customer, Product, QuotationSender, PaymentTerms } from '../../types';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Light.ttf', fontWeight: 'light' }
  ]
});

interface QuotationPDFProps {
  customer: Customer;
  products: Product[];
  sender: QuotationSender | null;
  validUntil: Date;
  paymentTerms: PaymentTerms;
}

export function QuotationPDF({ 
  customer, 
  products, 
  sender, 
  validUntil,
  paymentTerms 
}: QuotationPDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <PDFHeader sender={sender} />
        <PDFCustomerInfo 
          customer={customer} 
          validUntil={validUntil} 
        />
        <PDFItemsTable products={products} />
        <PDFTerms paymentTerms={paymentTerms} />
        <PDFFooter />
      </Page>
    </Document>
  );
}