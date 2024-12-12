import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { QuotationPDF } from '../components/QuotationPDF';
import { QuotationSettings } from '../components/quotations/QuotationSettings';
import { QuotationPreviewTable } from '../components/quotations/QuotationPreviewTable';
import { QuotationHeader } from '../components/quotations/QuotationHeader';
import { LeadCustomerForm } from '../components/quotations/LeadCustomerForm';
import { SenderSelect } from '../components/quotations/SenderSelect';
import { useCustomerStore } from '../store/customerStore';
import { useProductStore } from '../store/productStore';
import { useQuotationStore } from '../store/quotationStore';
import { calculateValidUntilDate } from '../utils/quotation';
import type { Customer, PaymentTerms } from '../types';
import type { ValidityPeriod } from '../components/quotations/ValidityPeriodSelect';

export function QuotationPreview() {
  const navigate = useNavigate();
  const { selectedCustomer, setSelectedCustomer } = useCustomerStore();
  const selectedProducts = useProductStore((state) => state.selectedProducts);
  const { selectedSender, setSelectedSender, saveQuotation } = useQuotationStore();
  
  const [quotationSaved, setQuotationSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validityPeriod, setValidityPeriod] = useState<ValidityPeriod>('1-month');
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('30-days');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if no customer or products selected
  useEffect(() => {
    if (!selectedCustomer || selectedProducts.length === 0) {
      navigate('/quotations');
    }
  }, [selectedCustomer, selectedProducts, navigate]);

  if (!selectedCustomer || selectedProducts.length === 0) {
    return null;
  }

  const validUntilDate = calculateValidUntilDate(validityPeriod);

  const handleSaveQuotation = async () => {
    if (!selectedSender) {
      setError('Please select a sender before saving the quotation');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const quotation = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        customer: selectedCustomer,
        sender: selectedSender,
        items: selectedProducts.map(product => ({
          itemCode: product.itemCode,
          description: product.description,
          listPrice: product.unitPrice,
          quotePrice: product.modifiedPrice || product.unitPrice,
          discount: ((product.unitPrice - (product.modifiedPrice || product.unitPrice)) / product.unitPrice) * 100,
        })),
        status: 'draft' as const,
        validityPeriod,
        paymentTerms
      };

      await saveQuotation(quotation);
      setQuotationSaved(true);
      setSuccess('Quotation saved successfully');
      setError(null);
    } catch (error) {
      setError('Failed to save quotation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLead = (lead: Customer) => {
    setSelectedCustomer(lead);
    setShowLeadForm(false);
  };

  return (
    <div className="space-y-6">
      <QuotationHeader 
        showLeadForm={showLeadForm}
        setShowLeadForm={setShowLeadForm}
        selectedSender={selectedSender}
        setSelectedSender={setSelectedSender}
        quotationSaved={quotationSaved}
        isSubmitting={isSubmitting}
        onSave={handleSaveQuotation}
        validUntilDate={validUntilDate}
        customer={selectedCustomer}
        products={selectedProducts}
        validityPeriod={validityPeriod}
        paymentTerms={paymentTerms}
        error={error}
        success={success}
      />

      {showLeadForm ? (
        <LeadCustomerForm
          onSubmit={handleAddLead}
          onCancel={() => setShowLeadForm(false)}
        />
      ) : (
        <div className="space-y-6">
          <QuotationSettings
            validityPeriod={validityPeriod}
            paymentTerms={paymentTerms}
            onValidityChange={setValidityPeriod}
            onPaymentTermsChange={setPaymentTerms}
          />

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 text-center border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">QUOTATION</h2>
            </div>
            <QuotationPreviewTable products={selectedProducts} />
          </div>
        </div>
      )}
    </div>
  );
}