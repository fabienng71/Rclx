import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Product } from '../../types';

const styles = StyleSheet.create({
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingVertical: 6,
  },
  col1: { width: '12%' },
  col2: { width: '40%' },
  col3: { width: '16%', textAlign: 'right' },
  col4: { width: '16%', textAlign: 'right' },
  col5: { width: '16%', textAlign: 'right' },
  text: {
    fontSize: 9,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 9,
  }
});

interface PDFItemsTableProps {
  products: Product[];
}

export function PDFItemsTable({ products }: PDFItemsTableProps) {
  const formatPrice = (price: number) => {
    return `THB ${Math.round(price).toLocaleString('en-US')}`;
  };

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.col1, styles.bold]}>Item Code</Text>
        <Text style={[styles.col2, styles.bold]}>Description</Text>
        <Text style={[styles.col3, styles.bold]}>List Price</Text>
        <Text style={[styles.col4, styles.bold]}>Quote Price</Text>
        <Text style={[styles.col5, styles.bold]}>Discount</Text>
      </View>
      
      {products.map((product) => {
        const listPrice = product.unitPrice;
        const quotePrice = product.modifiedPrice || product.unitPrice;
        const discountPercent = ((listPrice - quotePrice) / listPrice) * 100;
        
        return (
          <View key={product.itemCode} style={styles.tableRow}>
            <Text style={[styles.col1, styles.text]}>{product.itemCode}</Text>
            <Text style={[styles.col2, styles.text]}>{product.description}</Text>
            <Text style={[styles.col3, styles.text]}>{formatPrice(listPrice)}</Text>
            <Text style={[styles.col4, styles.text]}>{formatPrice(quotePrice)}</Text>
            <Text style={[styles.col5, styles.text]}>
              {discountPercent > 0 ? `${discountPercent.toFixed(1)}%` : '-'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}