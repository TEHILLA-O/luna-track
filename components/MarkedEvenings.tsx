"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "luna-track-marked-dates";

export type EveningTag = "fast" | "feast" | "rest" | "custom";

export type MarkedEvening = {
  id: string;
  date: string;
  tag: EveningTag;
  label: string;
};

const TAGS: { id: EveningTag; label: string }[] = [
  { id: "fast", label: "Fast / abstain" },
  { id: "feast", label: "Feast / celebrate" },
  { id: "rest", label: "Rest / low light" },
  { id: "custom", label: "Custom" },
];

function load(): MarkedEvening[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MarkedEvening[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: MarkedEvening[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export function MarkedEvenings() {
  const [rows, setRows] = useState<MarkedEvening[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tag, setTag] = useState<EveningTag>("custom");
  const [label, setLabel] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRows(load());
    setMounted(true);
  }, []);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.date.localeCompare(b.date)),
    [rows],
  );

  const add = useCallback(() => {
    const lab = label.trim() || TAGS.find((t) => t.id === tag)?.label || "Marked";
    const row: MarkedEvening = {
      id: crypto.randomUUID(),
      date,
      tag,
      label: lab,
    };
    setRows((prev) => {
      const next = [...prev.filter((r) => !(r.date === date && r.tag === tag)), row].slice(
        0,
        120,
      );
      save(next);
      return next;
    });
    setLabel("");
  }, [date, tag, label]);

  const remove = useCallback((id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      save(next);
      return next;
    });
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
      <h2 className="font-serif text-xl text-[var(--foreground)]">Marked evenings</h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Lightweight reminders for fasting windows, holidays you observe, or quiet nights —
        stored locally, not tied to any single tradition.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)]/40 sm:w-44"
          />
        </label>
        <label className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Tone
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value as EveningTag)}
            className="mt-1 block w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)]/40 sm:w-48"
          >
            {TAGS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 flex-1 text-xs uppercase tracking-wider text-[var(--muted)]">
          Note (optional)
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. family dinner"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-white/25 focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </label>
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-[var(--foreground)] transition hover:bg-white/10"
        >
          Pin evening
        </button>
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {!mounted ? (
          <li className="text-[var(--muted)]">Loading…</li>
        ) : sorted.length === 0 ? (
          <li className="text-[var(--muted)]">Nothing pinned yet.</li>
        ) : (
          sorted.map((r) => (
            <li
              key={r.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-black/25 px-3 py-2"
            >
              <div>
                <span className="text-xs tabular-nums text-[var(--accent)]">{r.date}</span>
                <span className="mx-2 text-white/20">·</span>
                <span className="text-[var(--muted)]">{r.tag}</span>
                <p className="text-[var(--foreground)]">{r.label}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(r.id)}
                className="shrink-0 text-xs text-white/35 underline-offset-2 hover:text-rose-300 hover:underline"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
