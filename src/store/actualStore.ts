import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActualData {
  fiscalYear: string;
  monthlyActual: Record<string, number>;
  total: number;
  lastModified: string;
}

interface ActualStore {
  actuals: ActualData[];
  addActual: (actual: ActualData) => void;
  updateActual: (fiscalYear: string, updates: Partial<Omit<ActualData, 'lastModified'>>) => void;
  getActual: (fiscalYear: string) => ActualData | undefined;
  deleteActual: (fiscalYear: string) => void;
}

export const useActualStore = create<ActualStore>()(
  persist(
    (set, get) => ({
      actuals: [],
      addActual: (actual) => {
        const newActual = {
          ...actual,
          lastModified: new Date().toISOString()
        };
        set((state) => ({
          actuals: [...state.actuals.filter(a => a.fiscalYear !== actual.fiscalYear), newActual]
        }));
      },
      updateActual: (fiscalYear, updates) => {
        set((state) => ({
          actuals: state.actuals.map((actual) =>
            actual.fiscalYear === fiscalYear
              ? {
                  ...actual,
                  ...updates,
                  monthlyActual: {
                    ...actual.monthlyActual,
                    ...(updates.monthlyActual || {})
                  },
                  lastModified: new Date().toISOString()
                }
              : actual
          )
        }));
      },
      getActual: (fiscalYear) => {
        return get().actuals.find(a => a.fiscalYear === fiscalYear);
      },
      deleteActual: (fiscalYear) => {
        set((state) => ({
          actuals: state.actuals.filter(a => a.fiscalYear !== fiscalYear)
        }));
      },
    }),
    {
      name: 'actual-storage',
      version: 1,
    }
  )
);