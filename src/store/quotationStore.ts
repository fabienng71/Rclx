import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuotationSender, SavedQuotation } from '../types';

interface QuotationStore {
  selectedSender: QuotationSender | null;
  savedQuotations: SavedQuotation[];
  archivedQuotations: SavedQuotation[];
  setSelectedSender: (sender: QuotationSender | null) => void;
  saveQuotation: (quotation: SavedQuotation) => void;
  updateQuotationStatus: (id: string, status: SavedQuotation['status']) => void;
  archiveQuotation: (id: string) => void;
  restoreQuotation: (id: string) => void;
  deleteQuotation: (id: string) => void;
}

export const useQuotationStore = create<QuotationStore>()(
  persist(
    (set) => ({
      selectedSender: null,
      savedQuotations: [],
      archivedQuotations: [],
      setSelectedSender: (sender) => set({ selectedSender: sender }),
      saveQuotation: (quotation) =>
        set((state) => ({
          savedQuotations: [quotation, ...state.savedQuotations],
        })),
      updateQuotationStatus: (id, status) =>
        set((state) => ({
          savedQuotations: state.savedQuotations.map((q) =>
            q.id === id ? { ...q, status } : q
          ),
          archivedQuotations: state.archivedQuotations.map((q) =>
            q.id === id ? { ...q, status } : q
          ),
        })),
      archiveQuotation: (id) =>
        set((state) => {
          const quotation = state.savedQuotations.find((q) => q.id === id);
          if (!quotation) return state;

          return {
            savedQuotations: state.savedQuotations.filter((q) => q.id !== id),
            archivedQuotations: [quotation, ...state.archivedQuotations],
          };
        }),
      restoreQuotation: (id) =>
        set((state) => {
          const quotation = state.archivedQuotations.find((q) => q.id === id);
          if (!quotation) return state;

          return {
            archivedQuotations: state.archivedQuotations.filter((q) => q.id !== id),
            savedQuotations: [quotation, ...state.savedQuotations],
          };
        }),
      deleteQuotation: (id) =>
        set((state) => ({
          savedQuotations: state.savedQuotations.filter((q) => q.id !== id),
          archivedQuotations: state.archivedQuotations.filter((q) => q.id !== id),
        })),
    }),
    {
      name: 'quotation-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1: Add archivedQuotations
          return {
            ...persistedState,
            archivedQuotations: [],
          };
        }
        if (version === 1) {
          // Migration from version 1 to 2: Add status to quotations
          return {
            ...persistedState,
            savedQuotations: persistedState.savedQuotations.map((q: SavedQuotation) => ({
              ...q,
              status: q.status || 'draft'
            })),
            archivedQuotations: (persistedState.archivedQuotations || []).map((q: SavedQuotation) => ({
              ...q,
              status: q.status || 'draft'
            }))
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        savedQuotations: state.savedQuotations,
        archivedQuotations: state.archivedQuotations,
      }),
    }
  )
);