import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles/pdfStyles';

export function PDFQuoteTitle() {
  return (
    <View style={pdfStyles.quotationTitleContainer}>
      <Text style={pdfStyles.quotationTitle}>QUOTATION</Text>
    </View>
  );
}