import React from 'react';
import { Archive, Eye, Download, Mail, Trash2, RotateCcw } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { QuotationPDF } from '../../QuotationPDF';
import { useAuthStore } from '../../../store/authStore';
import { calculateValidUntilDate } from '../../../utils/quotation';
import { sendEmail } from '../../../utils/email';
import type { SavedQuotation } from '../../../types';

interface QuotationActionsProps {
  quotation: SavedQuotation;
  isArchived?: boolean;
  onPreview: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
}

export function QuotationActions({
  quotation,
  isArchived = false,
  onPreview,
  onArchive,
  onRestore,
  onDelete,
}: QuotationActionsProps) {
  const { user } = useAuthStore();

  const handleEmail = () => {
    if (!quotation.sender) {
      alert('No sender information available');
      return;
    }

    sendEmail({
      subject: `Quotation for ${quotation.customer.companyName}`,
      body: `Dear Sir/Madam,\n\nPlease find attached our quotation for your review.\n\nBest regards,\n${quotation.sender.name}`
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this quotation? This action cannot be undone.')) {
      onDelete?.();
    }
  };

  const validUntil = calculateValidUntilDate(quotation.validityPeriod);

  return (
    <div className="flex items-center justify-end space-x-3">
      <button
        onClick={onPreview}
        className="text-indigo-600 hover:text-indigo-900"
        title="Preview"
      >
        <Eye className="h-5 w-5" />
      </button>

      {quotation.sender && (
        <PDFDownloadLink
          document={
            <QuotationPDF
              customer={quotation.customer}
              products={quotation.items.map(item => ({
                itemCode: item.itemCode,
                description: item.description,
                unitPrice: item.listPrice,
                modifiedPrice: item.quotePrice,
                inventory: 0,
                baseUnitOfMeasure: '',
                unitCost: 0,
                vendorNo: '',
                blocked: false,
                vendor: '',
              }))}
              sender={quotation.sender}
              validUntil={validUntil}
              paymentTerms={quotation.paymentTerms}
            />
          }
          fileName={`quotation-${quotation.customer.customerCode}-${quotation.id}.pdf`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          {({ loading }) => (
            <Download 
              className={`h-5 w-5 ${loading ? 'opacity-50' : ''}`} 
              title="Download PDF"
            />
          )}
        </PDFDownloadLink>
      )}

      <button
        onClick={handleEmail}
        className="text-indigo-600 hover:text-indigo-900"
        title="Send Email"
      >
        <Mail className="h-5 w-5" />
      </button>

      {user?.role === 'admin' && (
        <>
          {isArchived ? (
            <button
              onClick={onRestore}
              className="text-green-600 hover:text-green-900"
              title="Restore"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={onArchive}
              className="text-amber-600 hover:text-amber-900"
              title="Archive"
            >
              <Archive className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}