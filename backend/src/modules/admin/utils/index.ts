export function getWeekRanges(date = new Date()) {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  // semana actual
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // semana anterior
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);

  const endOfLastWeek = new Date(startOfWeek);
  endOfLastWeek.setDate(startOfWeek.getDate() - 1);
  endOfLastWeek.setHours(23, 59, 59, 999);

  return {
    startOfWeek,
    endOfWeek,
    startOfLastWeek,
    endOfLastWeek,
  };
}
export function growth(current: number, previous: number) {
  if (!previous) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}
