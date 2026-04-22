import SunCalc from "suncalc";

/** Synodic month length in days (mean). */
export const SYNODIC_DAYS = 29.53058867;

/** Reference instant known to be near a new moon (UTC). Used only for calendar labels / age. */
const REF_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);

export type PhaseName =
  | "New Moon"
  | "Waxing Crescent"
  | "First Quarter"
  | "Waxing Gibbous"
  | "Full Moon"
  | "Waning Gibbous"
  | "Third Quarter"
  | "Waning Crescent";

export function moonAgeDays(date: Date): number {
  const ms = date.getTime() - REF_NEW_MOON_UTC;
  const days = ms / (1000 * 60 * 60 * 24);
  let age = days % SYNODIC_DAYS;
  if (age < 0) age += SYNODIC_DAYS;
  return age;
}

export function phaseNameFromAge(ageDays: number): PhaseName {
  const step = SYNODIC_DAYS / 8;
  const i = Math.min(7, Math.floor(ageDays / step));
  const names: PhaseName[] = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Third Quarter",
    "Waning Crescent",
  ];
  return names[i]!;
}

export function isWaxing(date: Date): boolean {
  const t = date.getTime();
  const cur = SunCalc.getMoonIllumination(date).fraction;
  const prev = SunCalc.getMoonIllumination(new Date(t - 24 * 60 * 60 * 1000)).fraction;
  return cur >= prev;
}

export type LunarDayInfo = {
  date: Date;
  illumination: number;
  phaseName: PhaseName;
  waxing: boolean;
};

export function getLunarDayInfo(date: Date): LunarDayInfo {
  const illum = SunCalc.getMoonIllumination(date);
  const age = moonAgeDays(date);
  return {
    date,
    illumination: illum.fraction,
    phaseName: phaseNameFromAge(age),
    waxing: isWaxing(date),
  };
}

export function formatMoonTimes(
  date: Date,
  latitude: number,
  longitude: number,
): { rise: Date | null; set: Date | null; note?: string } {
  const times = SunCalc.getMoonTimes(date, latitude, longitude);
  if (times.alwaysUp) return { rise: null, set: null, note: "Moon up all day at this latitude." };
  if (times.alwaysDown) return { rise: null, set: null, note: "Moon down all day at this latitude." };
  return { rise: times.rise ?? null, set: times.set ?? null };
}

export function calendarWeeks(year: number, monthIndex: number): Date[][] {
  const first = new Date(Date.UTC(year, monthIndex, 1, 12, 0, 0, 0));
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0, 12, 0, 0, 0)).getUTCDate();

  const padStart = (first.getUTCDay() + 6) % 7; // Monday = 0
  const cells: Date[] = [];

  for (let i = padStart; i > 0; i--) {
    const d = new Date(Date.UTC(year, monthIndex, 1 - i, 12, 0, 0, 0));
    cells.push(d);
  }
  for (let day = 1; day <= lastDay; day++) {
    cells.push(new Date(Date.UTC(year, monthIndex, day, 12, 0, 0, 0)));
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1]!;
    const next = new Date(last);
    next.setUTCDate(next.getUTCDate() + 1);
    cells.push(next);
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1]!;
    const next = new Date(last);
    next.setUTCDate(next.getUTCDate() + 1);
    cells.push(next);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
