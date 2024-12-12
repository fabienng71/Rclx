import { create } from 'zustand';
import type { Product } from '../types';

interface ProductStore {
  products: Product[];
  selectedProducts: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleProductSelection: (product: Product) => void;
  updateSelectedProducts: (products: Product[]) => void;
  clearSelectedProducts: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  selectedProducts: [],
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleProductSelection: (product) =>
    set((state) => {
      const isSelected = state.selectedProducts.some(
        (p) => p.itemCode === product.itemCode
      );
      return {
        selectedProducts: isSelected
          ? state.selectedProducts.filter((p) => p.itemCode !== product.itemCode)
          : [...state.selectedProducts, product],
      };
    }),
  updateSelectedProducts: (products) => set({ selectedProducts: products }),
  clearSelectedProducts: () => set({ selectedProducts: [] }),
}));