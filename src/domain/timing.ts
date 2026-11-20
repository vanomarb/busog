/** The labelled demo eating window is independent of which meals have already been logged. */
export const EATING_WINDOW = { start: 7 * 60, end: 21 * 60 };

/** Convert a logged clock time to its angle on a 24-hour dial, with midnight at the top. */
export function timeAngle(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60 + minutes) / 4;
}
