/** Manila date keys make the diary stable across viewer time zones and midnight boundaries. */
export function today(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(now);
}
/** Shift a date key at UTC noon to avoid daylight-saving edge cases. */
export function shiftDate(date: string, offset: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}
/** Display a date key independently of the browser's local zone. */
export function dateLabel(date: string, short = false): string {
  return new Intl.DateTimeFormat('en-PH', {
    weekday: short ? 'short' : 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Manila',
  }).format(new Date(`${date}T04:00:00Z`));
}
/** Manila clock parts also drive the meal dial and a live dinner-window countdown. */
export function manilaClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
    .format(now)
    .split(':')
    .map(Number);
  return { hours: parts[0], minutes: parts[1], seconds: parts[2] };
}
