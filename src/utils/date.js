/**
 * Returns a Date for the next Saturday at 9:00 AM in the user's locale.
 * - Uses Intl + local timezone.
 */
export function nextSaturdayNineAM(from = new Date()) {
  const day = from.getDay(); // 0 Sun ... 6 Sat
  const daysUntilSat = (6 - day + 7) % 7 || 7; // if today is Sat, choose next Sat
  const d = new Date(from);
  d.setDate(d.getDate() + daysUntilSat);
  d.setHours(9, 0, 0, 0);
  return d;
}