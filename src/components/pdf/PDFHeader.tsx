import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { COMPANY_INFO } from '../../types';
import type { QuotationSender } from '../../types';

const styles = StyleSheet.create({
  header: {
    width: '50%',
  },
  companyInfo: {
    marginBottom: 20,
  },
  repertoire: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7f1d1d',
  },
  culinaire: {
    fontSize: 28,
    fontWeight: 'light',
    color: '#7f1d1d',
    marginTop: 2,
  },
  companyDetails: {
    marginTop: 8,
  },
  text: {
    fontSize: 9,
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 9,
    marginBottom: 2,
  }
});

interface PDFHeaderProps {
  sender: QuotationSender | null;
}

export function PDFHeader({ sender }: PDFHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.companyInfo}>
        <Text style={styles.repertoire}>REPERTOIRE</Text>
        <Text style={styles.culinaire}>CULINAIRE</Text>
        <View style={styles.companyDetails}>
          <Text style={styles.bold}>{COMPANY_INFO.name}</Text>
          {COMPANY_INFO.address.map((line, index) => (
            <Text key={index} style={styles.text}>{line}</Text>
          ))}
          {sender && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.bold}>Contact Person:</Text>
              <Text style={styles.text}>{sender.name}</Text>
              <Text style={styles.text}>{sender.email}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}