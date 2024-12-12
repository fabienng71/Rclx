import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BudgetData {
  fiscalYear: string;
  monthlyBudget: Record<string, number>;
  total: number;
  lastModified: string;
}

interface BudgetStore {
  budgets: BudgetData[];
  addBudget: (budget: BudgetData) => void;
  updateBudget: (fiscalYear: string, updates: Partial<Omit<BudgetData, 'lastModified'>>) => void;
  getBudget: (fiscalYear: string) => BudgetData | undefined;
  deleteBudget: (fiscalYear: string) => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [],
      addBudget: (budget) => {
        const newBudget = {
          ...budget,
          lastModified: new Date().toISOString()
        };
        set((state) => ({
          budgets: [...state.budgets.filter(b => b.fiscalYear !== budget.fiscalYear), newBudget]
        }));
      },
      updateBudget: (fiscalYear, updates) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.fiscalYear === fiscalYear
              ? {
                  ...budget,
                  ...updates,
                  monthlyBudget: {
                    ...budget.monthlyBudget,
                    ...(updates.monthlyBudget || {})
                  },
                  lastModified: new Date().toISOString()
                }
              : budget
          )
        }));
      },
      getBudget: (fiscalYear) => {
        return get().budgets.find(b => b.fiscalYear === fiscalYear);
      },
      deleteBudget: (fiscalYear) => {
        set((state) => ({
          budgets: state.budgets.filter(b => b.fiscalYear !== fiscalYear)
        }));
      },
    }),
    {
      name: 'budget-storage',
      version: 1,
    }
  )
);