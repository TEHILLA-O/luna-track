import { MoonGlyph } from "@/components/MoonGlyph";
import { calendarWeeks, getLunarDayInfo } from "@/lib/lunar";

type LunarCalendarProps = {
  year: number;
  monthIndex: number;
  highlightToday?: Date;
};

const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export function LunarCalendar({
  year,
  monthIndex,
  highlightToday = new Date(),
}: LunarCalendarProps) {
  const weeks = calendarWeeks(year, monthIndex);
  const todayKey = highlightToday.toISOString().slice(0, 10);
  const monthTitle = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex, 1)));

  return (
    <section className="luna-card-quiet">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-xl text-[var(--foreground)]">This month</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--foreground)]">{monthTitle}</span>
          <span className="rounded-full border border-[var(--border)] bg-black/20 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted-2)]">
            UTC noon
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-[var(--muted-2)]">
        {weekdayLabels.map((d, i) => (
          <div key={`${d}-${i}`} className="py-1.5">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1.5">
        {weeks.flatMap((week) =>
          week.map((date) => {
            const inMonth = date.getUTCMonth() === monthIndex;
            const key = date.toISOString().slice(0, 10);
            const isToday = key === todayKey;
            const info = getLunarDayInfo(date);
            return (
              <div
                key={key}
                className={`flex min-h-[4.75rem] flex-col items-center justify-center gap-1 rounded-2xl border py-2 transition-colors ${
                  inMonth
                    ? "border-[var(--border)] bg-black/10"
                    : "border-transparent bg-transparent opacity-[0.38]"
                } ${isToday ? "ring-2 ring-[var(--accent)]/40" : ""}`}
              >
                <span
                  className={`text-[11px] tabular-nums leading-none ${inMonth ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}
                >
                  {date.getUTCDate()}
                </span>
                <MoonGlyph
                  fraction={info.illumination}
                  waxing={info.waxing}
                  size={34}
                  className="opacity-[0.92]"
                />
              </div>
            );
          }),
        )}
      </div>
    </section>
  );
}
