import { create } from 'zustand';
import type { Customer, Quotation, Sale } from '../types';

interface Store {
  customers: Customer[];
  quotations: Quotation[];
  sales: Sale[];
  addCustomer: (customer: Customer) => void;
  addQuotation: (quotation: Quotation) => void;
  addSale: (sale: Sale) => void;
  setSales: (sales: Sale[]) => void;
}

export const useStore = create<Store>((set) => ({
  customers: [],
  quotations: [],
  sales: [],
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
  addQuotation: (quotation) =>
    set((state) => ({ quotations: [...state.quotations, quotation] })),
  addSale: (sale) => 
    set((state) => ({ sales: [...state.sales, sale] })),
  setSales: (sales) => 
    set({ sales }),
}));