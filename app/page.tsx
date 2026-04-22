import { LunarCalendar } from "@/components/LunarCalendar";
import { MarkedEvenings } from "@/components/MarkedEvenings";
import { SkyJournal } from "@/components/SkyJournal";
import { TodayMoon } from "@/components/TodayMoon";

export default function Home() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const monthIndex = now.getUTCMonth();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 starfield" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-14 sm:px-8 sm:pt-16">
        <header className="mb-14 text-center sm:mb-16">
          <div className="luna-overline flex items-center justify-center gap-2">
            <span
              className="inline-block h-1 w-1 rounded-full bg-[var(--accent)] opacity-80"
              aria-hidden
            />
            <span>Luna Tracker</span>
            <span
              className="inline-block h-1 w-1 rounded-full bg-[var(--accent)] opacity-80"
              aria-hidden
            />
          </div>
          <h1 className="mt-5 font-serif text-[2.15rem] font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl sm:leading-[1.08]">
            Quiet moon,
            <span className="block text-[var(--muted)] sm:inline sm:before:content-['_']">
              clear night
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
            Phases, a soft calendar, and notes that stay in your browser.
          </p>
        </header>

        <div className="grid gap-7 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-7 lg:col-span-7">
            <TodayMoon now={now} />
            <LunarCalendar year={year} monthIndex={monthIndex} highlightToday={now} />
          </div>
          <div className="space-y-7 lg:col-span-5">
            <SkyJournal />
            <MarkedEvenings />
          </div>
        </div>
      </div>
    </div>
  );
}
