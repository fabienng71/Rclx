import { Sale } from '../types';

// List of Thailand public holidays for 2024
export const THAILAND_HOLIDAYS_2024 = [
  '2024-01-01', // New Year's Day
  '2024-01-02', // Special Holiday
  '2024-02-08', // Chinese New Year
  '2024-02-24', // Makha Bucha Day
  '2024-04-06', // Chakri Memorial Day
  '2024-04-13', // Songkran Festival
  '2024-04-14', // Songkran Festival
  '2024-04-15', // Songkran Festival
  '2024-04-16', // Songkran Festival
  '2024-05-01', // Labor Day
  '2024-05-04', // Coronation Day
  '2024-05-22', // Visakha Bucha Day
  '2024-06-03', // Queen Suthida's Birthday
  '2024-07-20', // Asanha Bucha Day
  '2024-07-29', // King Vajiralongkorn's Birthday
  '2024-08-12', // Queen Mother's Birthday
  '2024-10-13', // King Bhumibol's Memorial Day
  '2024-10-23', // Chulalongkorn Day
  '2024-12-05', // King Bhumibol's Birthday
  '2024-12-10', // Constitution Day
  '2024-12-31'  // New Year's Eve
];

export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let workingDays = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Check if it's not a weekend (0 = Sunday, 6 = Saturday)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Check if it's not a holiday
      const dateString = currentDate.toISOString().split('T')[0];
      if (!THAILAND_HOLIDAYS_2024.includes(dateString)) {
        workingDays++;
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
}

export function calculateDailyAverage(total: number, workingDays: number): number {
  return workingDays > 0 ? total / workingDays : 0;
}

export function calculateMonthlyBaseline(total: number): number {
  return total / 12;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function calculatePartialMonthBudget(
  monthlyBudget: number,
  year: number,
  month: number,
  currentDay: number
): number {
  const totalDays = getDaysInMonth(year, month);
  const dailyBudget = monthlyBudget / totalDays;
  return dailyBudget * Math.min(currentDay, totalDays);
}

export function getYTDDateRange(): { startDate: Date; endDate: Date } {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();

  // If we're in January-March, fiscal year started in previous year's April
  // If we're in April-December, fiscal year started in current year's April
  const fiscalStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
  const startDate = new Date(fiscalStartYear, 3, 1); // April 1st
  const endDate = new Date(currentYear, currentMonth, currentDay);

  return { startDate, endDate };
}

export function filterSalesInDateRange(sales: Sale[], startDate: Date, endDate: Date): Sale[] {
  return sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= startDate && saleDate <= endDate;
  });
}