export const formatCurrency = (value: number | undefined): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0';
  }

  return value.toLocaleString('id-ID');
};
