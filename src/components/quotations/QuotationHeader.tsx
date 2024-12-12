import React from 'react';
import { Plus, Download, Mail } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { QuotationPDF } from '../QuotationPDF';
import { SenderSelect } from './SenderSelect';
import { sendEmail } from '../../utils/email';
import type { Customer, Product, PaymentTerms, QuotationSender } from '../../types';
import type { ValidityPeriod } from './ValidityPeriodSelect';

interface QuotationHeaderProps {
  showLeadForm: boolean;
  setShowLeadForm: (show: boolean) => void;
  selectedSender: QuotationSender | null;
  setSelectedSender: (sender: QuotationSender | null) => void;
  quotationSaved: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  validUntilDate: Date;
  customer: Customer;
  products: Product[];
  validityPeriod: ValidityPeriod;
  paymentTerms: PaymentTerms;
  error: string | null;
  success: string | null;
}

export function QuotationHeader({
  showLeadForm,
  setShowLeadForm,
  selectedSender,
  setSelectedSender,
  quotationSaved,
  isSubmitting,
  onSave,
  validUntilDate,
  customer,
  products,
  validityPeriod,
  paymentTerms,
  error,
  success
}: QuotationHeaderProps) {
  const handleEmail = () => {
    if (!selectedSender) {
      return;
    }

    sendEmail({
      subject: `Quotation for ${customer.companyName}`,
      body: `Dear Sir/Madam,\n\nPlease find attached our quotation for your review.\n\nBest regards,\n${selectedSender.name}`
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Quotation Preview</h1>
        <div className="flex items-center space-x-4">
          {!customer.isLead && (
            <button
              onClick={() => setShowLeadForm(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add as Lead
            </button>
          )}
          <SenderSelect
            value={selectedSender}
            onChange={setSelectedSender}
          />
          <div className="flex items-center space-x-2">
            {quotationSaved ? (
              <PDFDownloadLink
                document={
                  <QuotationPDF
                    customer={customer}
                    products={products}
                    sender={selectedSender}
                    validUntil={validUntilDate}
                    paymentTerms={paymentTerms}
                  />
                }
                fileName={`quotation-${customer.customerCode}-${new Date().toISOString().split('T')[0]}.pdf`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {({ loading }) => (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                disabled
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
              >
                <Download className="h-4 w-4 mr-2" />
                Save First to Download
              </button>
            )}
            <button
              onClick={handleEmail}
              disabled={!selectedSender}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </button>
            <button
              onClick={onSave}
              disabled={quotationSaved || isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : quotationSaved ? (
                'Saved'
              ) : (
                'Save Quotation'
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}