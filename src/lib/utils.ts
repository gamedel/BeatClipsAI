export function subHours(date: Date, hours: number) {
  return new Date(date.getTime() - hours * 3600_000);
}
