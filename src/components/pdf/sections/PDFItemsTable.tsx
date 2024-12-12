import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { formatCurrency } from '../../../utils/format';
import { tableStyles } from '../styles/sectionStyles';
import type { Product } from '../../../types';

interface PDFItemsTableProps {
  products: Product[];
}

export function PDFItemsTable({ products }: PDFItemsTableProps) {
  return (
    <View style={tableStyles.container}>
      <View style={tableStyles.header}>
        <Text style={[tableStyles.headerCell, tableStyles.col1]}>Item Code</Text>
        <Text style={[tableStyles.headerCell, tableStyles.col2]}>Description</Text>
        <Text style={[tableStyles.headerCell, tableStyles.col3]}>List Price</Text>
        <Text style={[tableStyles.headerCell, tableStyles.col4]}>Quote Price</Text>
        <Text style={[tableStyles.headerCell, tableStyles.col5]}>Discount</Text>
      </View>

      {products.map((product) => {
        const listPrice = product.unitPrice || 0;
        const quotePrice = product.modifiedPrice || listPrice;
        const hasDiscount = listPrice > 0 && quotePrice !== listPrice;
        const discountPercent = hasDiscount ? ((listPrice - quotePrice) / listPrice) * 100 : 0;

        return (
          <View key={product.itemCode} style={tableStyles.row}>
            <Text style={[tableStyles.cell, tableStyles.col1]}>
              {product.itemCode}
            </Text>
            <Text style={[tableStyles.cell, tableStyles.col2]}>
              {product.description}
            </Text>
            <Text style={[tableStyles.cell, tableStyles.col3]}>
              {listPrice > 0 ? formatCurrency(listPrice) : '-'}
            </Text>
            <Text style={[tableStyles.cell, tableStyles.col4]}>
              {quotePrice > 0 ? formatCurrency(quotePrice) : '-'}
            </Text>
            <Text style={[tableStyles.cell, tableStyles.col5]}>
              {hasDiscount ? `${Math.abs(discountPercent).toFixed(1)}%${discountPercent > 0 ? ' discount' : ' markup'}` : '-'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}