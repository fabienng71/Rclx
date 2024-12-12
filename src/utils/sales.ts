import { Sale } from '../types';

export function getCurrentMonthSales(sales: Sale[]): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return sales.reduce((total, sale) => {
    const saleDate = new Date(sale.date);
    if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
      return total + sale.total;
    }
    return total;
  }, 0);
}

export function getTotalSales(sales: Sale[]): number {
  return sales.reduce((total, sale) => total + sale.total, 0);
}