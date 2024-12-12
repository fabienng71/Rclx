export function getDateRangeFromFilter(filter: string): { startDate: Date; endDate: Date } {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let startDate: Date;

  switch (filter) {
    case 'this-month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'last-month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate.setDate(0); // Last day of previous month
      break;
    case 'last-3-months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      break;
    case 'last-6-months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      break;
    default: // 'all'
      startDate = new Date(0); // Beginning of time
      break;
  }

  return { startDate, endDate };
}

export function filterActivitiesByDateRange(activities: any[], dateFilter: string) {
  const { startDate, endDate } = getDateRangeFromFilter(dateFilter);

  return activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= startDate && activityDate <= endDate;
  });
}

export function filterActivitiesByWeek(activities: any[], weekFilter: string) {
  if (weekFilter === 'all') return activities;

  const [year, week] = weekFilter.split('-').map(Number);
  
  return activities.filter(activity => {
    const date = new Date(activity.date);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const activityWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    
    return date.getFullYear() === year && activityWeek === week;
  });
}