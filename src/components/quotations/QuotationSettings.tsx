import React from 'react';
import { ValidityPeriodSelect } from './ValidityPeriodSelect';
import { PaymentTermsSelect } from './PaymentTermsSelect';
import type { ValidityPeriod } from './ValidityPeriodSelect';
import type { PaymentTerms } from '../../types';

interface QuotationSettingsProps {
  validityPeriod: ValidityPeriod;
  paymentTerms: PaymentTerms;
  onValidityChange: (period: ValidityPeriod) => void;
  onPaymentTermsChange: (terms: PaymentTerms) => void;
}

export function QuotationSettings({
  validityPeriod,
  paymentTerms,
  onValidityChange,
  onPaymentTermsChange
}: QuotationSettingsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ValidityPeriodSelect
        value={validityPeriod}
        onChange={onValidityChange}
      />
      <PaymentTermsSelect
        value={paymentTerms}
        onChange={onPaymentTermsChange}
      />
    </div>
  );
}