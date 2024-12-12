import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import type { Customer } from '../../../types';

interface PDFCustomerInfoProps {
  customer: Customer;
  validUntil: Date;
}

export function PDFCustomerInfo({ customer, validUntil }: PDFCustomerInfoProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <View style={{
      position: 'absolute',
      top: 40,
      right: 40,
      width: '40%',
      textAlign: 'right'
    }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>
        {customer.companyName}
      </Text>
      <Text style={{ fontSize: 9, marginBottom: 2 }}>
        Customer Code: {customer.customerCode}
      </Text>
      <Text style={{ fontSize: 9, marginBottom: 2 }}>
        {customer.searchName}
      </Text>
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 9, marginBottom: 2 }}>
          Date: {formatDate(new Date())}
        </Text>
        <Text style={{ fontSize: 9, marginBottom: 2 }}>
          Valid until: {formatDate(validUntil)}
        </Text>
      </View>
    </View>
  );
}