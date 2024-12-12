import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useQuotationStore } from '../store/quotationStore';
import { QuotationList } from '../components/quotations/history/QuotationList';
import { QuotationFilters } from '../components/quotations/history/QuotationFilters';
import { QuotationTabs } from '../components/quotations/history/QuotationTabs';
import { QuotationPreviewModal } from '../components/quotations/QuotationPreviewModal';
import type { SavedQuotation } from '../types';

export function QuotationHistory() {
  const { 
    savedQuotations, 
    archivedQuotations,
    archiveQuotation,
    restoreQuotation,
    deleteQuotation,
    updateQuotationStatus 
  } = useQuotationStore();

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [selectedQuotation, setSelectedQuotation] = useState<SavedQuotation | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | SavedQuotation['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const quotations = activeTab === 'active' ? savedQuotations : archivedQuotations;

  const filteredQuotations = quotations.filter(quotation => {
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || (
      quotation.customer.searchName.toLowerCase().includes(searchLower) ||
      quotation.customer.companyName.toLowerCase().includes(searchLower) ||
      quotation.customer.customerCode.toLowerCase().includes(searchLower)
    );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Quotation History</h1>
        </div>
      </div>

      <QuotationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        archivedCount={archivedQuotations.length}
      />

      <QuotationFilters
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
      />

      <QuotationList
        quotations={filteredQuotations}
        isArchived={activeTab === 'archived'}
        onSelect={setSelectedQuotation}
        onArchive={archiveQuotation}
        onRestore={restoreQuotation}
        onDelete={deleteQuotation}
        onStatusChange={updateQuotationStatus}
      />

      {selectedQuotation && (
        <QuotationPreviewModal
          quotation={selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
        />
      )}
    </div>
  );
}