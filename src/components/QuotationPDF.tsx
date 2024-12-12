import React from 'react';
import { Document, Page, Font } from '@react-pdf/renderer';
import { PDFHeader } from './pdf/sections/PDFHeader';
import { PDFCustomerInfo } from './pdf/sections/PDFCustomerInfo';
import { PDFQuoteTitle } from './pdf/sections/PDFQuoteTitle';
import { PDFItemsTable } from './pdf/sections/PDFItemsTable';
import { PDFTerms } from './pdf/sections/PDFTerms';
import { pdfStyles } from './pdf/styles/pdfStyles';
import type { Customer, Product, QuotationSender, PaymentTerms } from '../types';

// Register fonts using CDN URLs
Font.register({
  family: 'Helvetica',
  fonts: [
    { 
      src: 'https://fonts.cdnfonts.com/s/29719/Helvetica.woff',
      fontWeight: 'normal'
    },
    { 
      src: 'https://fonts.cdnfonts.com/s/29719/Helvetica-Bold.woff',
      fontWeight: 'bold'
    },
    { 
      src: 'https://fonts.cdnfonts.com/s/29719/Helvetica-Light.woff',
      fontWeight: 'light'
    }
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
  // Calculate items per page (adjust based on your needs)
  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <Document>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const startIndex = pageIndex * ITEMS_PER_PAGE;
        const pageProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === totalPages - 1;

        return (
          <Page 
            key={pageIndex} 
            size="A4" 
            orientation="landscape" 
            style={pdfStyles.page}
          >
            {isFirstPage && (
              <>
                <PDFQuoteTitle />
                <PDFHeader sender={sender} />
                <PDFCustomerInfo 
                  customer={customer} 
                  validUntil={validUntil} 
                />
              </>
            )}

            <PDFItemsTable products={pageProducts} />

            {isLastPage && (
              <PDFTerms 
                paymentTerms={paymentTerms}
                validityPeriod={`${validUntil.getDate()} ${validUntil.toLocaleString('default', { month: 'long' })} ${validUntil.getFullYear()}`}
              />
            )}
          </Page>
        );
      })}
    </Document>
  );
}