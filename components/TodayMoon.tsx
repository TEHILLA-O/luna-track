import { MoonGlyph } from "@/components/MoonGlyph";
import { formatMoonTimes, getLunarDayInfo } from "@/lib/lunar";

const DEFAULT_LAT = 40.7128;
const DEFAULT_LNG = -74.006;

type TodayMoonProps = {
  now?: Date;
};

export function TodayMoon({ now = new Date() }: TodayMoonProps) {
  const info = getLunarDayInfo(now);
  const times = formatMoonTimes(now, DEFAULT_LAT, DEFAULT_LNG);
  const tf = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <section className="luna-card">
      <p className="luna-overline">Tonight</p>
      <div className="mt-5 flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <div className="flex shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent-soft)] p-6 sm:p-7">
          <MoonGlyph
            fraction={info.illumination}
            waxing={info.waxing}
            size={152}
            className="drop-shadow-[0_0_20px_rgba(200,190,255,0.2)]"
          />
        </div>
        <div className="w-full max-w-sm space-y-4 text-center sm:text-left">
          <h2 className="font-serif text-[1.65rem] leading-snug text-[var(--foreground)] sm:text-3xl">
            {info.phaseName}
          </h2>
          <p className="text-[15px] text-[var(--muted)]">
            <span className="tabular-nums text-[var(--foreground)]">
              {(info.illumination * 100).toFixed(1)}%
            </span>{" "}
            lit · {info.waxing ? "waxing" : "waning"}
          </p>
          <div className="rounded-2xl border border-[var(--border)] bg-black/15 px-4 py-3 text-left text-[14px] text-[var(--muted)]">
            <p className="luna-overline mb-1 text-[10px] uppercase tracking-[0.12em] text-[var(--muted-2)]">
              Moonrise · Moonset
            </p>
            <p className="text-[11px] text-[var(--muted-2)]">Sample location: New York</p>
            {times.note ? (
              <p className="mt-2 text-[var(--foreground)]">{times.note}</p>
            ) : (
              <p className="mt-2 text-[15px] tabular-nums text-[var(--foreground)]">
                <span className="text-[var(--muted-2)]">Rise</span>{" "}
                {times.rise ? tf.format(times.rise) : "—"}
                <span className="mx-2.5 text-white/15">·</span>
                <span className="text-[var(--muted-2)]">Set</span>{" "}
                {times.set ? tf.format(times.set) : "—"}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
