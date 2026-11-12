// Annual/monthly observations retain their actual time distance, including gaps.
export function periodPositions(periods: string[]) {
  const dates = periods.map(period => {
    const match = /^(\d{4})(?:-(0[1-9]|1[0-2]))?$/.exec(period);
    if (!match) throw new Error("Unsupported chart period");
    return Number(match[1]) * 12 + Number(match[2] ?? 1) - 1;
  });
  if (!dates.length || dates.some((date, index) => index > 0 && date <= dates[index - 1])) throw new Error("Chart periods must increase");
  const span = dates.at(-1)! - dates[0] || 1;
  return dates.map(date => (date - dates[0]) / span);
}
