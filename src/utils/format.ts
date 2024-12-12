export const formatCurrency = (amount: number) => {
  if (!amount && amount !== 0) return '-';
  // Format the number with THB prefix and thousands separator, no decimals
  const formattedNumber = Math.round(amount).toLocaleString();
  return `THB ${formattedNumber}`;
};

export const formatDate = (date: string) => {
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatNumber = (value: number) => {
  if (!value && value !== 0) return '-';
  return Math.round(value).toLocaleString();
};