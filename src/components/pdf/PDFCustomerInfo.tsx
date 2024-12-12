import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { customerStyles } from './styles/pdfStyles';
import type { Customer } from '../../types';

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
    <View style={customerStyles.container}>
      <Text style={customerStyles.companyName}>{customer.companyName}</Text>
      <Text style={customerStyles.text}>Customer Code: {customer.customerCode}</Text>
      <Text style={customerStyles.text}>{customer.searchName}</Text>
      <View style={customerStyles.dates}>
        <Text style={customerStyles.text}>
          Date: {formatDate(new Date())}
        </Text>
        <Text style={customerStyles.text}>
          Valid until: {formatDate(validUntil)}
        </Text>
      </View>
    </View>
  );
}