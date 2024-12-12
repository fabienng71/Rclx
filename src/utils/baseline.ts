import type { Sale } from '../types';

export function calculateBaseline(sales: Sale[], selectedSalesperson: string = 'all'): number {
  if (sales.length === 0) return 0;

  // Filter sales by salesperson if specified
  const filteredSales = selectedSalesperson === 'all' 
    ? sales 
    : sales.filter(sale => sale.salesPersonCode === selectedSalesperson);

  if (filteredSales.length === 0) return 0;

  // Get the current year
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;

  // Get previous year's sales
  const previousYearSales = filteredSales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate.getFullYear() === previousYear;
  });

  // If no previous year data, use current year's average
  if (previousYearSales.length === 0) {
    const currentYearSales = filteredSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getFullYear() === currentYear;
    });

    if (currentYearSales.length === 0) return 0;

    // Calculate monthly average for current year
    const monthlyTotals = new Map<number, number>();
    currentYearSales.forEach(sale => {
      const saleDate = new Date(sale.date);
      const month = saleDate.getMonth();
      monthlyTotals.set(month, (monthlyTotals.get(month) || 0) + sale.total);
    });

    const totalRevenue = Array.from(monthlyTotals.values()).reduce((sum, value) => sum + value, 0);
    const monthCount = monthlyTotals.size;
    return monthCount > 0 ? totalRevenue / monthCount : 0;
  }

  // Calculate monthly average for previous year
  const monthlyTotals = new Map<number, number>();
  previousYearSales.forEach(sale => {
    const saleDate = new Date(sale.date);
    const month = saleDate.getMonth();
    monthlyTotals.set(month, (monthlyTotals.get(month) || 0) + sale.total);
  });

  const totalRevenue = Array.from(monthlyTotals.values()).reduce((sum, value) => sum + value, 0);
  const monthCount = monthlyTotals.size;
  return monthCount > 0 ? totalRevenue / monthCount : 0;
}

export function isAboveBaseline(amount: number, baseline: number): boolean {
  return amount > baseline;
}