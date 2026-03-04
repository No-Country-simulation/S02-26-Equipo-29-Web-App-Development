export function getMonthRanges(date = new Date()) {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  // Mes actual
  const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
    23,
    59,
    59,
    999,
  );

  // Mes anterior
  const startOfLastMonth = new Date(
    currentYear,
    currentMonth - 1,
    1,
    0,
    0,
    0,
    0,
  );
  const endOfLastMonth = new Date(
    currentYear,
    currentMonth,
    0,
    23,
    59,
    59,
    999,
  );

  return {
    startOfMonth,
    endOfMonth,
    startOfLastMonth,
    endOfLastMonth,
  };
}
export function growth(current: number, previous: number) {
  if (!previous) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}
