import type { Sale } from '../types';

export function getQuarterlyPeriods(sales: Sale[]) {
  const periods = new Map<string, {
    key: string;
    startDate: Date;
    endDate: Date;
    sales: Sale[];
  }>();

  sales.forEach(sale => {
    const date = new Date(sale.date);
    const year = date.getFullYear();
    const quarter = Math.floor(date.getMonth() / 3);
    const periodKey = `${year}-Q${quarter + 1}`;

    if (!periods.has(periodKey)) {
      const startDate = new Date(year, quarter * 3, 1);
      const endDate = new Date(year, (quarter + 1) * 3, 0);
      periods.set(periodKey, {
        key: periodKey,
        startDate,
        endDate,
        sales: []
      });
    }

    periods.get(periodKey)!.sales.push(sale);
  });

  return Array.from(periods.values())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export function getPeriodLabel(periodKey: string): string {
  const [year, quarter] = periodKey.split('-');
  const quarterNum = parseInt(quarter.replace('Q', ''));
  const months = ['Jan', 'Apr', 'Jul', 'Oct'];
  const startMonth = months[quarterNum - 1];
  const endMonth = ['Mar', 'Jun', 'Sep', 'Dec'][quarterNum - 1];
  return `${startMonth}-${endMonth} ${year}`;
}