import { create } from 'zustand';
import type { Customer } from '../types';
import { fetchCustomers } from '../services/googleSheets';

interface CustomerStore {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  setCustomers: (customers: Customer[]) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  searchCustomers: (query: string) => Customer[];
  loadCustomers: () => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  setCustomers: (customers) => set({ customers }),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  searchCustomers: (query) => {
    const { customers } = get();
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (searchTerms.length === 0) return [];

    return customers
      .filter(customer => {
        const searchFields = [
          customer.customerCode.toLowerCase(),
          customer.companyName.toLowerCase(),
          customer.searchName.toLowerCase()
        ];

        // All search terms must match at least one field
        return searchTerms.every(term =>
          searchFields.some(field => field.includes(term))
        );
      })
      .sort((a, b) => {
        // Sort by relevance - exact matches first
        const aExact = searchFields(a).some(field => 
          field.includes(query.toLowerCase())
        );
        const bExact = searchFields(b).some(field => 
          field.includes(query.toLowerCase())
        );
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then sort alphabetically
        return a.searchName.localeCompare(b.searchName);
      })
      .slice(0, 10); // Limit results for performance
  },
  loadCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchCustomers();
      set({ customers: data, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load customers' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Helper function to get searchable fields
function searchFields(customer: Customer) {
  return [
    customer.customerCode.toLowerCase(),
    customer.companyName.toLowerCase(),
    customer.searchName.toLowerCase()
  ];
}