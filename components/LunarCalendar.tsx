import { MoonGlyph } from "@/components/MoonGlyph";
import { calendarWeeks, getLunarDayInfo } from "@/lib/lunar";

type LunarCalendarProps = {
  year: number;
  monthIndex: number;
  highlightToday?: Date;
};

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function LunarCalendar({
  year,
  monthIndex,
  highlightToday = new Date(),
}: LunarCalendarProps) {
  const weeks = calendarWeeks(year, monthIndex);
  const todayKey = highlightToday.toISOString().slice(0, 10);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl text-[var(--foreground)]">Lunar month</h2>
        <p className="text-xs text-[var(--muted)]">
          {new Intl.DateTimeFormat(undefined, {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(Date.UTC(year, monthIndex, 1)))}{" "}
          <span className="text-white/25">·</span> UTC noon samples
        </p>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-[var(--muted)]">
        {weekdayLabels.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flatMap((week) =>
          week.map((date) => {
            const inMonth = date.getUTCMonth() === monthIndex;
            const key = date.toISOString().slice(0, 10);
            const isToday = key === todayKey;
            const info = getLunarDayInfo(date);
            return (
              <div
                key={key}
                className={`flex min-h-[5.5rem] flex-col items-center gap-1 rounded-xl border px-0.5 py-2 transition-colors ${
                  inMonth
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-transparent bg-transparent opacity-40"
                } ${isToday ? "ring-1 ring-[var(--accent)]/60" : ""}`}
              >
                <span
                  className={`text-xs tabular-nums ${inMonth ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}
                >
                  {date.getUTCDate()}
                </span>
                <MoonGlyph
                  fraction={info.illumination}
                  waxing={info.waxing}
                  size={36}
                  className="opacity-90"
                />
              </div>
            );
          }),
        )}
      </div>
    </section>
  );
}
