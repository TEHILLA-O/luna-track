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
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <header className="mb-12 text-center sm:mb-16">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
            Luna Tracker
          </p>
          <h1
            className="mt-3 bg-gradient-to-br from-[#f5f0ff] via-[#dcd4ff] to-[#9d8ec4] bg-clip-text font-serif text-4xl font-semibold tracking-tight text-transparent sm:text-5xl"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            Follow the silver thread
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            Phases, a month-at-a-glance grid, and space for sky notes and evenings you want to
            remember — nothing leaves your device unless you share it.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-8 lg:col-span-7">
            <TodayMoon now={now} />
            <LunarCalendar year={year} monthIndex={monthIndex} highlightToday={now} />
          </div>
          <div className="space-y-8 lg:col-span-5">
            <SkyJournal />
            <MarkedEvenings />
          </div>
        </div>
      </div>
    </div>
  );
}
