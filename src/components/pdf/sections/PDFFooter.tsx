import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { footerStyles } from '../styles/sectionStyles';

interface PDFFooterProps {
  pageNumber: number;
  totalPages: number;
}

export function PDFFooter({ pageNumber, totalPages }: PDFFooterProps) {
  return (
    <View style={footerStyles.container}>
      <Text style={footerStyles.pageNumber}>
        Page {pageNumber} of {totalPages}
      </Text>
    </View>
  );
}