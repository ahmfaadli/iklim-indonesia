export const fmt = (value, digits = 1) =>
  Number.isFinite(value)
    ? value.toLocaleString('id-ID', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      })
    : '—';

export const formatMonth = (month) => {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return month ?? '';
  return new Date(`${month}-01T00:00:00`).toLocaleDateString('id-ID', {
    month: 'short',
    year: '2-digit',
  });
};
