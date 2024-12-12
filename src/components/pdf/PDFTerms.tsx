import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  terms: {
    flexDirection: 'row',
    marginTop: 10,
  },
  termsSection: {
    width: '50%',
    paddingRight: 20,
  },
  termsTitle: {
    marginBottom: 6,
    fontWeight: 'bold',
    fontSize: 9,
  },
  termsList: {
    marginLeft: 15,
  },
  termsItem: {
    marginBottom: 4,
    fontSize: 8,
  }
});

export function PDFTerms() {
  return (
    <View style={styles.terms}>
      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>Selling Conditions:</Text>
        <View style={styles.termsList}>
          <Text style={styles.termsItem}>• Prices are subject to change without prior notice</Text>
          <Text style={styles.termsItem}>• Quotation valid for 30 days</Text>
          <Text style={styles.termsItem}>• Prices are exclusive of VAT</Text>
          <Text style={styles.termsItem}>• Minimum order quantity may apply</Text>
          <Text style={styles.termsItem}>• Delivery time subject to stock availability</Text>
        </View>
      </View>
      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>Payment Terms:</Text>
        <View style={styles.termsList}>
          <Text style={styles.termsItem}>• Payment within 30 days from invoice date</Text>
          <Text style={styles.termsItem}>• Bank transfer or company check accepted</Text>
          <Text style={styles.termsItem}>• Late payment subject to 1.5% monthly interest</Text>
        </View>
      </View>
    </View>
  );
}