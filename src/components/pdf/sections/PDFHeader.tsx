import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { COMPANY_INFO } from '../../../types';
import { pdfStyles } from '../styles/pdfStyles';
import type { QuotationSender } from '../../../types';

interface PDFHeaderProps {
  sender: QuotationSender | null;
}

export function PDFHeader({ sender }: PDFHeaderProps) {
  return (
    <View style={pdfStyles.header}>
      <View>
        <Text style={pdfStyles.repertoire}>REPERTOIRE</Text>
        <Text style={pdfStyles.culinaire}>CULINAIRE</Text>
        <View style={pdfStyles.details}>
          <Text style={pdfStyles.companyName}>{COMPANY_INFO.name}</Text>
          {COMPANY_INFO.address.map((line, index) => (
            <Text key={index} style={pdfStyles.text}>{line}</Text>
          ))}
          {sender && (
            <View style={pdfStyles.senderInfo}>
              <Text style={pdfStyles.companyName}>Contact Person:</Text>
              <Text style={pdfStyles.text}>{sender.name}</Text>
              <Text style={pdfStyles.text}>{sender.email}</Text>
              <Text style={pdfStyles.text}>{sender.phone}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}