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
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_-20px_var(--glow)] backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        Tonight&apos;s moon
      </p>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <MoonGlyph
          fraction={info.illumination}
          waxing={info.waxing}
          size={160}
          className="drop-shadow-[0_0_24px_rgba(200,210,255,0.25)]"
        />
        <div className="w-full max-w-sm space-y-3 text-sm sm:text-right">
          <h2 className="font-serif text-2xl text-[var(--foreground)] sm:text-3xl">
            {info.phaseName}
          </h2>
          <p className="text-[var(--muted)]">
            Illumination{" "}
            <span className="tabular-nums text-[var(--foreground)]">
              {(info.illumination * 100).toFixed(1)}%
            </span>
            <span className="mx-2 text-white/20">·</span>
            {info.waxing ? "Waxing" : "Waning"}
          </p>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-left text-[var(--muted)]">
            <p className="text-[10px] uppercase tracking-wider text-white/35">
              Moonrise / set (sample: NYC)
            </p>
            {times.note ? (
              <p className="mt-1 text-[var(--foreground)]">{times.note}</p>
            ) : (
              <p className="mt-1 tabular-nums text-[var(--foreground)]">
                {times.rise ? tf.format(times.rise) : "—"} rise
                <span className="mx-2 text-white/25">·</span>
                {times.set ? tf.format(times.set) : "—"} set
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
